import PatientSidebar from "@/components/PatientSidebar";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Heart, Activity } from "lucide-react";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : "??";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PatientSidebar />

      <div className="flex-1 lg:ml-[250px]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10">
          <div>
            <h1 className="text-[#1E293B] text-xl lg:text-[28px] font-bold">
              Bonjour, {fullName}
            </h1>
            <p className="text-[#64748B] text-sm hidden sm:block">
              Bienvenue sur votre tableau de bord
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[60px] h-[60px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-[#2563EB] text-xl font-bold">{initials}</span>
            </div>
            <span className="text-[#64748B] text-xs hidden lg:block">{fullName}</span>
            <button
              onClick={() => navigate("/monitoring")}
              className="px-4 h-[32px] bg-[#2563EB] text-white text-[13px] font-bold rounded hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Monitoring
            </button>
            <button
              onClick={handleLogout}
              className="px-4 h-[32px] bg-[#EF4444] text-white text-[13px] font-bold rounded hover:bg-[#DC2626] transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </header>

        {/* Main Content - Logo and Project Name */}
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">
              HealthTrack
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
