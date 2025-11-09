import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Tablet,
  Calendar,
  Activity,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { listProfiles, Profile as ProfileType } from "@/lib/api/profiles";

interface DisplayProfile {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  initialsColor: string;
  roleColor: string;
  statusColor: string;
}

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [profiles, setProfiles] = useState<DisplayProfile[]>([]);
  const [stats, setStats] = useState({
    totalDocteurs: 0,
    totalPatients: 0,
    totalAdministrateurs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfiles();
  }, [activeFilter]);

  const loadProfiles = async () => {
    setIsLoading(true);
    setError("");
    try {
      let data: ProfileType[] = [];

      if (activeFilter === "Tous") {
        data = await listProfiles();
      } else if (activeFilter === "Docteurs") {
        data = await listProfiles({ role: "DOCTOR" });
      } else if (activeFilter === "Patients") {
        data = await listProfiles({ role: "PATIENT" });
      }

      const displayProfiles: DisplayProfile[] = data.map((profile) => ({
        id: profile.id,
        initials: (profile.firstName[0] + profile.lastName[0]).toUpperCase(),
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        role:
          profile.role === "DOCTOR"
            ? "Docteur"
            : profile.role === "PATIENT"
              ? "Patient"
              : "Administrateur",
        status: profile.isActive ? "Actif" : "Inactif",
        initialsColor: getInitialsColor(profile.role),
        roleColor: getRoleColor(profile.role),
        statusColor: profile.isActive
          ? "bg-[#D1FAE5] text-[#10B981]"
          : "bg-[#FEE2E2] text-[#EF4444]",
      }));

      setProfiles(displayProfiles);

      // Update stats
      const doctorCount = data.filter((p) => p.role === "DOCTOR").length;
      const patientCount = data.filter((p) => p.role === "PATIENT").length;
      const adminCount = data.filter((p) => p.role === "ADMIN").length;

      setStats({
        totalDocteurs: doctorCount,
        totalPatients: patientCount,
        totalAdministrateurs: adminCount,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load profiles";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialsColor = (role: string): string => {
    switch (role) {
      case "DOCTOR":
        return "bg-[#DBEAFE] text-[#2563EB]";
      case "PATIENT":
        return "bg-[#D1FAE5] text-[#10B981]";
      case "ADMIN":
        return "bg-[#FEF3C7] text-[#F59E0B]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "DOCTOR":
        return "bg-[#DBEAFE] text-[#2563EB]";
      case "PATIENT":
        return "bg-[#D1FAE5] text-[#10B981]";
      case "ADMIN":
        return "bg-[#FEF3C7] text-[#F59E0B]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <div className="w-full lg:w-[250px] bg-[#2563EB] flex flex-col">
        {/* Logo */}
        <div className="px-6 lg:px-10 py-4">
          <h1 className="text-white text-xl lg:text-2xl font-bold">
            HealthTrack
          </h1>
          <p className="text-[#93C5FD] text-xs mt-1 hidden lg:block">
            Système de Suivi Médical
          </p>
        </div>

        {/* Menu */}
        <nav className="mt-4 lg:mt-8 px-3 lg:px-5 space-y-2 pb-4 lg:pb-0 overflow-x-auto flex lg:flex-col gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 bg-white rounded-lg border border-white whitespace-nowrap"
          >
            <LayoutDashboard className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <span className="text-sm font-semibold text-[#2563EB]">
              Tableau de Bord
            </span>
          </Link>

          <Link
            to="/profiles"
            className="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 opacity-60 whitespace-nowrap"
          >
            <Users className="w-5 h-5 text-[#93C5FD] flex-shrink-0" />
            <span className="text-sm font-semibold text-[#93C5FD]">
              Profils
            </span>
          </Link>

          <Link
            to="/devices"
            className="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 opacity-60 whitespace-nowrap"
          >
            <Tablet className="w-5 h-5 text-[#93C5FD] flex-shrink-0" />
            <span className="text-sm font-semibold text-[#93C5FD]">
              Appareils
            </span>
          </Link>

          <Link
            to="/appointments"
            className="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 opacity-60 whitespace-nowrap"
          >
            <Calendar className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-sm font-semibold text-white">
              Planification
            </span>
          </Link>

          <Link
            to="/treatment-tracking"
            className="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 opacity-60 whitespace-nowrap"
          >
            <Activity className="w-5 h-5 text-[#93C5FD] flex-shrink-0" />
            <span className="text-sm font-semibold text-[#93C5FD]">
              Suivi Traitement
            </span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h2 className="text-[#1E293B] text-lg lg:text-2xl font-bold">
            Tableau de Bord - Profils
          </h2>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-[#64748B] text-xs lg:text-sm hidden sm:block">
              {user?.role === "DOCTOR"
                ? "Docteur"
                : user?.role === "PATIENT"
                  ? "Patient"
                  : "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="text-[#2563EB] text-xs lg:text-sm hover:underline hidden sm:inline"
            >
              Déconnexion
            </button>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10.0001 9.6875C9.29656 9.6875 8.59994 9.56625 7.94998 9.33068C7.30002 9.09512 6.70945 8.74984 6.212 8.31456C5.71454 7.87929 5.31994 7.36254 5.05071 6.79383C4.78149 6.22511 4.64293 5.61557 4.64293 5C4.64293 4.38443 4.78149 3.77489 5.05071 3.20617C5.31994 2.63746 5.71454 2.12071 6.212 1.68544C6.70945 1.25016 7.30002 0.904884 7.94998 0.669315C8.59994 0.433746 9.29656 0.3125 10.0001 0.3125C10.7036 0.3125 11.4002 0.433746 12.0502 0.669315C12.7001 0.904884 13.2907 1.25016 13.7881 1.68544C14.2856 2.12071 14.6802 2.63746 14.9494 3.20617C15.2186 3.77489 15.3572 4.38443 15.3572 5C15.3572 5.61557 15.2186 6.22511 14.9494 6.79383C14.6802 7.36254 14.2856 7.87929 13.7881 8.31456C13.2907 8.74984 12.7001 9.09512 12.0502 9.33068C11.4002 9.56625 10.7036 9.6875 10.0001 9.6875ZM8.63846 11.875H11.3617C11.7947 11.875 12.1429 12.1797 12.1429 12.5586C12.1429 12.7227 12.076 12.8789 11.9554 13.0039L10.7322 14.2539L12.1161 18.75H12.1429L13.6876 13.3398C13.7858 13 14.1831 12.793 14.5581 12.918C17.3215 13.8398 19.2858 16.1836 19.2858 18.9258C19.2858 19.5156 18.7367 19.9961 18.0626 19.9961L1.93757 20C1.26346 20 0.714355 19.5195 0.714355 18.9297C0.714355 16.1875 2.67864 13.8438 5.44203 12.9219C5.81703 12.7969 6.21436 13.0039 6.31257 13.3438L7.85721 18.7539H7.884L9.26793 14.2578L8.04471 13.0078C7.92418 12.8828 7.85721 12.7266 7.85721 12.5625C7.85721 12.1836 8.20543 11.8789 8.63846 11.8789V11.875Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 lg:px-10 py-4 lg:py-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-7">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-8">
            <p className="text-[#64748B] text-sm mb-2">Total Docteurs</p>
            <div className="flex items-center justify-between">
              <span className="text-[#1E40AF] text-4xl font-bold">
                {stats.totalDocteurs}
              </span>
              <div className="w-[50px] h-[50px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M12.0029 0C11.0935 0 10.1931 0.172438 9.3529 0.50747C8.51275 0.842501 7.74938 1.33356 7.10635 1.95262C6.46333 2.57168 5.95326 3.30661 5.60526 4.11544C5.25726 4.92428 5.07814 5.79119 5.07814 6.66667C5.07814 7.54215 5.25726 8.40905 5.60526 9.21789C5.95326 10.0267 6.46333 10.7617 7.10635 11.3807C7.74938 11.9998 8.51275 12.4908 9.3529 12.8259C10.1931 13.1609 11.0935 13.3333 12.0029 13.3333C12.9123 13.3333 13.8127 13.1609 14.6529 12.8259C15.493 12.4908 16.2564 11.9998 16.8994 11.3807C17.5424 10.7617 18.0525 10.0267 18.4005 9.21789C18.7485 8.40905 18.9276 7.54215 18.9276 6.66667C18.9276 5.79119 18.7485 4.92428 18.4005 4.11544C18.0525 3.30661 17.5424 2.57168 16.8994 1.95262C16.2564 1.33356 15.493 0.842501 14.6529 0.50747C13.8127 0.172438 12.9123 0 12.0029 0ZM15.4653 17.3778C15.1536 17.35 14.8305 17.3333 14.5073 17.3333H9.49267C9.16951 17.3333 8.85213 17.35 8.53474 17.3778V21.1278C9.4869 21.55 10.1505 22.4778 10.1505 23.55C10.1505 25.0222 8.90983 26.2167 7.38062 26.2167C5.85141 26.2167 4.61072 25.0222 4.61072 23.55C4.61072 22.4722 5.27434 21.5444 6.2265 21.1278V17.8833C2.59678 19.1667 0 22.5333 0 26.4778C0 27.3167 0.709786 28 1.58115 28H22.4189C23.2902 28 24 27.3167 24 26.4778C24 22.5333 21.4032 19.1722 17.7677 17.8889V19.9667C19.1123 20.4222 20.076 21.6611 20.076 23.1111V24.8889C20.076 25.5 19.5566 26 18.9219 26C18.2871 26 17.7677 25.5 17.7677 24.8889V23.1111C17.7677 22.5 17.2484 22 16.6136 22C15.9788 22 15.4595 22.5 15.4595 23.1111V24.8889C15.4595 25.5 14.9401 26 14.3054 26C13.6706 26 13.1512 25.5 13.1512 24.8889V23.1111C13.1512 21.6611 14.1149 20.4278 15.4595 19.9667V17.3778H15.4653Z"
                    fill="#1E40AF"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-8">
            <p className="text-[#64748B] text-sm mb-2">Total Patients</p>
            <div className="flex items-center justify-between">
              <span className="text-[#10B981] text-4xl font-bold">
                {stats.totalPatients}
              </span>
              <div className="w-[50px] h-[50px] rounded-full bg-[#D1FAE5] flex items-center justify-center">
                <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
                  <path
                    d="M0 3.05882C0 1.37169 1.19583 0 2.66667 0H13.3333C14.8042 0 16 1.37169 16 3.05882V8.85625C14.0458 9.76434 12.6667 11.9629 12.6667 14.5294C12.6667 15.8533 13.0333 17.0816 13.6583 18.0853C11.5125 19.089 10 21.5074 10 24.332C10 24.3798 10 24.4228 10 24.4706H2.66667C1.19583 24.4706 0 23.0989 0 21.4118V3.05882ZM6 19.1176V22.1765H8.225C8.525 20.7713 9.1125 19.4952 9.90833 18.4342C9.65417 17.5022 8.89583 16.8235 8 16.8235C6.89583 16.8235 6 17.8511 6 19.1176ZM7.66667 4.20588C7.3 4.20588 7 4.55 7 4.97059V6.5H5.66667C5.3 6.5 5 6.84412 5 7.26471V8.02941C5 8.45 5.3 8.79412 5.66667 8.79412H7V10.3235C7 10.7441 7.3 11.0882 7.66667 11.0882H8.33333C8.7 11.0882 9 10.7441 9 10.3235V8.79412H10.3333C10.7 8.79412 11 8.45 11 8.02941V7.26471C11 6.84412 10.7 6.5 10.3333 6.5H9V4.97059C9 4.55 8.7 4.20588 8.33333 4.20588H7.66667ZM14.6667 14.5294C14.6667 13.5153 15.0179 12.5428 15.643 11.8258C16.2681 11.1087 17.1159 10.7059 18 10.7059C18.8841 10.7059 19.7319 11.1087 20.357 11.8258C20.9821 12.5428 21.3333 13.5153 21.3333 14.5294C21.3333 15.5435 20.9821 16.516 20.357 17.2331C19.7319 17.9501 18.8841 18.3529 18 18.3529C17.1159 18.3529 16.2681 17.9501 15.643 17.2331C15.0179 16.516 14.6667 15.5435 14.6667 14.5294ZM12 24.4706C12 21.9375 13.7917 19.8824 16 19.8824H20C22.2083 19.8824 24 21.9375 24 24.4706C24 25.3165 23.4042 26 22.6667 26H13.3333C12.5958 26 12 25.3165 12 24.4706Z"
                    fill="#10B981"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-8">
            <p className="text-[#64748B] text-sm mb-2">Administrateurs</p>
            <div className="flex items-center justify-between">
              <span className="text-[#F59E0B] text-4xl font-bold">
                {stats.totalAdministrateurs}
              </span>
              <div className="w-[50px] h-[50px] rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M12 13.5625C11.1558 13.5625 10.3199 13.3928 9.53993 13.063C8.75998 12.7332 8.0513 12.2498 7.45435 11.6404C6.8574 11.031 6.38387 10.3076 6.06081 9.51136C5.73774 8.71516 5.57146 7.8618 5.57146 7C5.57146 6.1382 5.73774 5.28484 6.06081 4.48864C6.38387 3.69244 6.8574 2.969 7.45435 2.35961C8.0513 1.75023 8.75998 1.26684 9.53993 0.937041C10.3199 0.607244 11.1558 0.4375 12 0.4375C12.8442 0.4375 13.6802 0.607244 14.4601 0.937041C15.2401 1.26684 15.9488 1.75023 16.5457 2.35961C17.1427 2.969 17.6162 3.69244 17.9393 4.48864C18.2623 5.28484 18.4286 6.1382 18.4286 7C18.4286 7.8618 18.2623 8.71516 17.9393 9.51136C17.6162 10.3076 17.1427 11.031 16.5457 11.6404C15.9488 12.2498 15.2401 12.7332 14.4601 13.063C13.6802 13.3928 12.8442 13.5625 12 13.5625ZM10.3661 16.625H13.634C14.1536 16.625 14.5715 17.0516 14.5715 17.582C14.5715 17.8117 14.4911 18.0305 14.3465 18.2055L12.8786 19.9555L14.5393 26.25H14.5715L16.425 18.6758C16.5429 18.2 17.0197 17.9102 17.4697 18.0852C20.7857 19.3758 23.1429 22.657 23.1429 26.4961C23.1429 27.3219 22.484 27.9945 21.675 27.9945L2.32503 28C1.51611 28 0.857178 27.3273 0.857178 26.5016C0.857178 22.6625 3.21432 19.3812 6.53039 18.0906C6.98039 17.9156 7.45718 18.2055 7.57503 18.6812L9.42861 26.2555H9.46075L11.1215 19.9609L9.65361 18.2109C9.50896 18.0359 9.42861 17.8172 9.42861 17.5875C9.42861 17.057 9.84646 16.6305 10.3661 16.6305V16.625Z"
                    fill="#F59E0B"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="px-4 lg:px-10 pb-6 lg:pb-10">
          {/* Search & Filters */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl px-3 lg:px-5 py-3 flex flex-wrap items-center gap-2 lg:gap-4 mb-4 lg:mb-5">
            <div className="flex-1 min-w-[300px] relative">
              <input
                type="text"
                placeholder="Rechercher un profil..."
                className="w-full h-10 pl-4 pr-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center">
                <Search className="w-3 h-3 text-white" />
              </div>
            </div>

            <button
              onClick={() => setActiveFilter("Tous")}
              className={`px-6 h-10 rounded-md text-[13px] transition-colors ${
                activeFilter === "Tous"
                  ? "bg-[#2563EB] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveFilter("Docteurs")}
              className={`px-6 h-10 rounded-md text-[13px] transition-colors ${
                activeFilter === "Docteurs"
                  ? "bg-[#2563EB] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              Docteurs
            </button>
            <button
              onClick={() => setActiveFilter("Patients")}
              className={`px-6 h-10 rounded-md text-[13px] transition-colors ${
                activeFilter === "Patients"
                  ? "bg-[#2563EB] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              Patients
            </button>
            <button className="px-5 h-10 bg-[#10B981] text-white rounded-md text-[13px] flex items-center gap-2 hover:bg-[#059669] transition-colors">
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="bg-[#F8FAFC] px-4 lg:px-8 py-3 lg:py-4 hidden lg:grid grid-cols-12 gap-4 border-b border-[#E2E8F0]">
              <div className="col-span-3 text-[#475569] text-[13px] font-bold">
                Nom Complet
              </div>
              <div className="col-span-3 text-[#475569] text-[13px] font-bold">
                Email
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Rôle
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Statut
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Actions
              </div>
            </div>

            {/* Loading/Error state */}
            {isLoading && (
              <div className="px-4 lg:px-8 py-8 text-center text-[#64748B]">
                Chargement des profils...
              </div>
            )}
            {error && (
              <div className="px-4 lg:px-8 py-8 text-center text-red-600">
                Erreur: {error}
              </div>
            )}
            {!isLoading && !error && profiles.length === 0 && (
              <div className="px-4 lg:px-8 py-8 text-center text-[#64748B]">
                Aucun profil trouvé
              </div>
            )}

            {/* Table Body */}
            <div className="divide-y divide-[#E2E8F0]">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="px-4 lg:px-8 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-4 items-start lg:items-center hover:bg-[#F8FAFC] transition-colors relative"
                >
                  <div className="lg:col-span-3 flex items-center gap-3 w-full">
                    <div
                      className={`w-9 h-9 rounded-full ${profile.initialsColor} flex items-center justify-center text-xs font-bold flex-shrink-0`}
                    >
                      {profile.initials}
                    </div>
                    <span className="text-[#1E293B] text-sm">
                      {profile.name}
                    </span>
                  </div>
                  <div className="lg:col-span-3 text-[#64748B] text-[13px] w-full truncate pl-12 lg:pl-0">
                    {profile.email}
                  </div>
                  <div className="lg:col-span-2 flex gap-2 pl-12 lg:pl-0">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full ${profile.roleColor} text-xs`}
                    >
                      {profile.role}
                    </span>
                  </div>
                  <div className="lg:col-span-2 pl-12 lg:pl-0">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full ${profile.statusColor} text-xs`}
                    >
                      {profile.status}
                    </span>
                  </div>
                  <div className="lg:col-span-2 absolute top-4 right-4 lg:static">
                    <button className="w-[30px] h-[30px] rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#64748B]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-8 py-4 lg:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
              <span className="text-[#64748B] text-[13px]">
                Affichage de {profiles.length} profil
                {profiles.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-9 bg-white border border-[#E2E8F0] rounded flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <button className="w-10 h-9 bg-[#2563EB] rounded flex items-center justify-center text-white text-sm">
                  1
                </button>
                <button className="w-10 h-9 bg-white border border-[#E2E8F0] rounded flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#2563EB]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
