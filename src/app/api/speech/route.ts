import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Initialize clients with credentials from the JSON file

// const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
// const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// const speechClient = new SpeechClient({ credentials });
// const ttsClient = new TextToSpeechClient({ credentials });

// ✅ Load and parse Google credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

// ✅ Initialize clients with credentials
const speechClient = new SpeechClient({ credentials });
const ttsClient = new TextToSpeechClient({ credentials });

// Handler for Speech-to-Text
export async function POST(request: Request) {
  try {
    const blob = await request.blob();
    const audioBytes = await blob.arrayBuffer();
    const content = Buffer.from(audioBytes).toString('base64');

    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      model: 'medical_conversation',
    };
    const audio = { content };

    const [response] = await speechClient.recognize({ config, audio });
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0].transcript)
      .join('\n');

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Error in Speech-to-Text API:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}

// Handler for Text-to-Speech
export async function PUT(request: Request) {
  try {
    const { text } = await request.json();

    const ttsRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.95,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(ttsRequest);
    const audioContent = response.audioContent;

    return new NextResponse(audioContent, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mp3',
      },
    });
  } catch (error) {
    console.error('Error in Text-to-Speech API:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
