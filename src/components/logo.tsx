import { cn } from '@/lib/utils';
import { Stethoscope } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Stethoscope className="h-8 w-8 text-accent" />
      <span className="font-headline text-3xl font-bold text-foreground">
        CureLink
      </span>
    </div>
  );
}
