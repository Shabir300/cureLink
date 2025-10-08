'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Stethoscope, Building, Star } from 'lucide-react';
import Image from 'next/image';

const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1551198802-5264102c7a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTc1OTQxODg3Nnww&ixlib=rb-4.1.0&q=80&w=1080";

export const DoctorCard = ({ doctor }: { doctor: any }) => {
  if (!doctor) return null;

  const handleShowOnMap = () => {
    if (doctor.googleMapsLink) {
      window.open(doctor.googleMapsLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="w-full max-w-sm border-gray-300 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
            <Image 
                src={doctor.imageUrl || FALLBACK_IMAGE_URL} 
                alt={doctor.name || 'Doctor'} 
                layout="fill"
                objectFit="cover"
            />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">{doctor.name || 'N/A'}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Stethoscope className="h-4 w-4" />
              <span>{doctor.specialization || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">{doctor.clinicName || 'Clinic details not available'}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span>{doctor.clinicAddress || 'Address not available'}</span>
        </div>
        {doctor.rating && (
            <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="h-4 w-4" />
                <span className="font-semibold">{doctor.rating} / 5</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleShowOnMap} disabled={!doctor.googleMapsLink} className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          Show on map
        </Button>
        <Button variant="outline" className="w-full">
            Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};
