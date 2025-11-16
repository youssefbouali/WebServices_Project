import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Tablet,
} from "lucide-react";

export default function DoctorSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/doctor-dashboard", label: "Tableau de Bord", icon: Activity },
    { path: "/doctor/mes-patients", label: "Mes Patients", icon: Users },
    { path: "/doctor/appointments", label: "Rendez-vous", icon: Calendar },
    { path: "/doctor/alertes", label: "Alertes", icon: AlertTriangle },
    {
      path: "/doctor/suivi-traitements",
      label: "Suivi Traitements",
      icon: TrendingUp,
    },
    { path: "/doctor/devices", label: "Appareils (patients)", icon: Tablet },
  ];

  return (
    <aside className="w-[250px] bg-[#1D4ED8] min-h-screen flex-shrink-0 fixed left-0 top-0 z-50">
      <div className="px-10 pt-3 pb-2">
        <h1 className="text-white text-[24px] font-bold leading-tight">
          HealthTrack
        </h1>
        <p className="text-[#93C5FD] text-[12px] mt-1">Espace Médecin</p>
      </div>

      <nav className="px-5 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                ${
                  isActive
                    ? "bg-[#1D4ED8] text-white border border-white"
                    : "text-[#BFDBFE] hover:bg-white/10"
                }
                ${!isActive ? "opacity-60 hover:opacity-100" : ""}
              `}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[14px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
