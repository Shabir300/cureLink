'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Calendar,
  HeartPulse,
  Stethoscope,
  Pill,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AIChat } from '@/components/ai-chat/ai-chat'; // Import the AIChat component

const patientNavItems = [
  { href: '/patient', icon: Home, label: 'Find a Doctor' },
  // { href: '/patient/doctors', icon: Stethoscope, label: 'Find a Doctor' },
  { href: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
  { href: '/patient/orders', icon: ShoppingCart, label: 'My Orders' },
  { href: '/patient/records', icon: FileText, label: 'Medical Records' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const doctorNavItems = [
  { href: '/doctor', icon: Home, label: 'Dashboard' },
  { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const pharmacyNavItems = [
  { href: '/pharmacy', icon: Home, label: 'Dashboard' },
  { href: '/pharmacy/medicines', icon: Pill, label: 'Inventory' },
  { href: '/pharmacy/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const hospitalNavItems = [
  { href: '/hospital', icon: Home, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const getNavItems = (role: string) => {
  switch (role) {
    case 'patient':
      return patientNavItems;
    case 'doctor':
      return doctorNavItems;
    case 'pharmacy':
      return pharmacyNavItems;
    case 'hospital':
      return hospitalNavItems;
    default:
      return [];
  }
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const navItems = getNavItems(user?.role || '');
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // setIsLoggingOut(true);
      await logout();          // call context logout (signOut + setUser(null))
      router.push('/');   // redirect to the login page
    } catch (err) {
      // optionally show toast here if you have a toast hook in this file
      console.error('Logout error', err);
    }
  };

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <img
                    src={user?.photoURL || '/placeholder-user.jpg'}
                    alt="user avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
          <AIChat />
        </div>
      </div>
    </SidebarProvider>
  );
}
