'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Pill, Warehouse, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

// A fallback image for medicines
const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1584308666744-8480404b65ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzfGVufDB8fHx8MTc1OTQxMDc4MHww&ixlib=rb-4.1.0&q=80&w=1080";

export const MedicineCard = ({ medicine }: { medicine: any }) => {
  if (!medicine) return null;

  const handleShowOnMap = () => {
    if (medicine.googleMapsLink) {
      window.open(medicine.googleMapsLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="w-full max-w-sm border-gray-300 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Pill className="h-6 w-6 text-blue-500" />
          <CardTitle className="text-xl font-bold">{medicine.name || 'N/A'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-40 w-full overflow-hidden rounded-md">
            <Image 
                src={medicine.imageUrl || FALLBACK_IMAGE_URL} 
                alt={medicine.name || 'Medicine'} 
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Warehouse className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">{medicine.pharmacyName || 'Pharmacy details not available'}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span>{medicine.pharmacyAddress || 'Address not available'}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
            <div className="text-lg font-bold text-green-600">
                Rs. {medicine.price || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
                Stock: {medicine.stock ?? 'N/A'}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleShowOnMap} disabled={!medicine.googleMapsLink} className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          Show on map
        </Button>
        <Button variant="outline" className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
