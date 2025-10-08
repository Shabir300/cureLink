'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Paperclip, Mic, Send, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '@/lib/gemini';
import { MedicineCard } from './medicine-card'; // Import the new component

// Helper functions for the secure API route remain the same
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const response = await fetch('/api/speech', { method: 'POST', body: audioBlob });
  const data = await response.json();
  return data.transcription || '';
}

async function synthesizeSpeech(text: string): Promise<Blob> {
  const response = await fetch('/api/speech', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.blob();
}

// Define the shape of a message
interface ChatMessage {
  role: 'user' | 'model';
  content?: string;
  component?: 'medicineCard';
  data?: any;
}

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await sendMessage(newMessages, messageToSend);

      // FIX: Add defensive check to prevent crashing from non-string responses.
      if (typeof aiResponse === 'string') {
        try {
          const jsonResponse = JSON.parse(aiResponse);
          if (jsonResponse.component === 'medicineCard') {
            setMessages([...newMessages, { role: 'model', component: 'medicineCard', data: jsonResponse.data }]);
          } else {
            throw new Error("Not a component");
          }
        } catch (e) {
          // If parsing fails, treat it as a regular text message
          setMessages([...newMessages, { role: 'model', content: aiResponse }]);
        }
      } else {
        // If the response is not a string, it's likely an error object from a proxy or extension.
        console.error("Received non-string response from AI service:", aiResponse);
        const errorMessage = (aiResponse as any)?.message || "Received a malformed response. This might be due to a browser extension interfering with the request.";
        setMessages([...newMessages, { role: 'model', content: `Error: ${errorMessage}` }]);
      }

    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { role: 'model', content: `Sorry, an error occurred: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        transcribeAndSend(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const transcribeAndSend = async (blob: Blob) => {
    const transcript = await transcribeAudio(blob);
    if (transcript) {
      handleSend(transcript);
    }
  };

  const playAIResponse = async (text: string) => {
    const audioBlob = await synthesizeSpeech(text);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-8 w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">AI Health Assistant</h2>
              <Button variant="ghost" size="icon" onClick={toggleChat}> <X className="w-5 h-5" /> </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {/* Logic to render text, components, or audio */}
                    {msg.component === 'medicineCard' ? (
                      <MedicineCard medicine={msg.data} />
                    ) : (
                      <>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                          <p>{msg.content}</p>
                        </div>
                        {msg.role === 'model' && msg.content && (
                          <Button variant="ghost" size="icon" onClick={() => playAIResponse(msg.content!)} className="shrink-0">
                            <Volume2 className="w-5 h-5" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800"> <p>AI is thinking...</p> </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t flex items-center">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 mx-2"
              />
              <Button variant="ghost" size="icon" onMouseDown={startRecording} onMouseUp={stopRecording} className={isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''}>
                <Mic className="w-5 h-5" />
              </Button>
              <Button onClick={() => handleSend()} size="icon"> <Send className="w-5 h-5" /> </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.div whileHover={{ scale: 1.1 }} className="fixed bottom-8 right-8 z-50">
          <Button onClick={toggleChat} size="lg" className="rounded-full w-16 h-16">
            {isOpen ? <X /> : 'AI'}
          </Button>
        </motion.div>
      )}
    </>
  );
};
