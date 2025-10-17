"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import FindDoctor from "@/components/patient/find-doctor";

const FindDoctorPage = () => {
  return (
    <DashboardLayout requiredRole="patient">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="font-headline text-3xl md:text-4xl">Find a Doctor</h1>
      </div>
      <div className="h-[calc(100vh-12rem)]">
        <FindDoctor />
      </div>
    </DashboardLayout>
  );
};

export default FindDoctorPage;