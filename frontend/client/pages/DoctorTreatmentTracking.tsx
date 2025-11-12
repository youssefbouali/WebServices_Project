import DoctorSidebar from "@/components/DoctorSidebar";
import { useAuth } from "@/lib/auth";

export default function DoctorTreatmentTracking() {
  const { user } = useAuth();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const doctorTitle = user?.role === "DOCTOR" ? `Dr. ${fullName}` : fullName;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <DoctorSidebar />
      <div className="flex-1 lg:ml-[250px]">
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10">
          <h1 className="text-[#1E293B] text-xl lg:text-[28px] font-bold">Suivi Traitements</h1>
          <p className="text-[#64748B] text-sm">{doctorTitle}</p>
        </header>
        <div className="p-6 lg:p-10">
          <p className="text-[#64748B]">Suivi des traitements des patients (à implémenter).</p>
        </div>
      </div>
    </div>
  );
}