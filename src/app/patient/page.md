"use client";
import { appointments, pharmacyProducts, orders, medicalRecords } from "@/lib/data";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pill, DollarSign, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PatientPage() {

    const recentAppointments = appointments.slice(0, 2);
    const currentMedications = pharmacyProducts.filter(p => p.id === 'prod-1' || p.id === 'prod-4');
    const recentRecords = medicalRecords.slice(0, 2);

    const totalDoctorSpending = appointments.reduce((sum, apt) => sum + apt.cost, 0);
    const totalPharmacySpending = orders.filter(o => o.status === 'approved').reduce((sum, order) => sum + order.total, 0);
    const totalSpending = totalDoctorSpending + totalPharmacySpending;

    return (
        <DashboardLayout requiredRole="patient">
            {/* <div className="flex items-center justify-between space-y-2">
                <h1 className="font-headline text-3xl md:text-4xl">Welcome, Patient</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PKR {totalSpending.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Doctors & Pharmacy combined</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                        <Pill className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentMedications.length}</div>
                        <p className="text-xs text-muted-foreground">Currently prescribed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                        <p className="text-xs text-muted-foreground">Upcoming and completed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{medicalRecords.length}</div>
                        <p className="text-xs text-muted-foreground">Files uploaded</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1.5">
                            <CardTitle className="font-headline flex items-center gap-2"><Calendar className="h-6 w-6" /> Recent Appointments</CardTitle>
                            <CardDescription>Your upcoming and recent visits.</CardDescription>
                        </div>
                        <Link href="/patient/doctors">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentAppointments.map(apt => (
                            <Card key={apt.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className='flex items-center gap-4'>
                                        <div className='text-center p-2 rounded-md bg-muted'>
                                            <div className='text-sm text-muted-foreground'>
                                                {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                                            </div>
                                            <div className='text-xl font-bold'>
                                                {new Date(apt.date).getDate()}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{apt.doctorName}</p>
                                            <p className="text-sm text-muted-foreground">{apt.time}</p>
                                        </div>
                                    </div>
                                    <Badge variant={apt.type === 'Urgent' ? 'destructive' : 'secondary'}>{apt.type}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1.5">
                            <CardTitle className="font-headline flex items-center gap-2"><FileText className="h-6 w-6" /> Recent Records</CardTitle>
                            <CardDescription>Your recently uploaded documents.</CardDescription>
                        </div>
                         <Link href="/patient/records">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {recentRecords.map(rec => (
                            <div key={rec.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{rec.fileName}</p>
                                    <p className="text-sm text-muted-foreground">Uploaded on {rec.uploadDate}</p>
                                </div>
                                <Badge variant="secondary">{rec.type}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div> */}
            <div></div>
        </DashboardLayout>
    );
}
