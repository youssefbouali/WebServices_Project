import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  User,
  Tablet,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/patient-dashboard", label: "Tableau de Bord", icon: Activity },
    { path: "/patient/profil", label: "Mon Profil", icon: User },
    { path: "/patient/devices", label: "Mes Appareils", icon: Tablet },
    { path: "/patient/rendez-vous", label: "Mes Rendez-vous", icon: Calendar },
    { path: "/patient/alertes", label: "Mes Alertes", icon: AlertTriangle },
    {
      path: "/patient/suivi-traitements",
      label: "Suivi Traitements",
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="w-[250px] bg-[#2563EB] min-h-screen flex-shrink-0 fixed left-0 top-0 z-50">
      <div className="px-10 pt-3 pb-2">
        <h1 className="text-white text-[24px] font-bold leading-tight">
          HealthTrack
        </h1>
        <p className="text-[#93C5FD] text-[12px] mt-1">
          Système de Suivi Médical
        </p>
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
                    ? "bg-[#2563EB] text-white border border-white"
                    : "text-[#93C5FD] hover:bg-white/10"
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
