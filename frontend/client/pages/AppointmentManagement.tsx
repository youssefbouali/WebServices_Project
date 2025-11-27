import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Search, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPatientAppointments, Appointment } from "@/lib/api/appointments";
import { getProfileById } from "@/lib/api/profiles";

type DisplayAppointment = Appointment & {
  patientInitials: string;
  patientName: string;
  doctorInitials: string;
  doctorName: string;
  reason: string;
  time: string;
  date: string;
  id: number;
  status: string;
};

export default function AppointmentManagement() {
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      const rawAppointments = await getPatientAppointments(parseInt(user.id));

      // Fetch patient and doctor details for each appointment
      const displayAppointments: DisplayAppointment[] = await Promise.all(
        rawAppointments.map(async (appt) => {
            try {
            const patient = await getProfileById(appt.patientId.toString());

            // prefer server-provided doctorName (returned by planification service)
            // fall back to calling profile service only when necessary
            let doctorNameFromServer = (appt as any).doctorName as string | undefined | null;
            let doctor = null;
            if (!doctorNameFromServer) {
              doctor = await getProfileById(appt.doctorId.toString());
            }

            const dateObj = new Date(appt.dateRdv);
            const date = dateObj.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const time = dateObj.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const computedDoctorName = doctorNameFromServer
              ? doctorNameFromServer
              : doctor
              ? `${doctor.firstName} ${doctor.lastName}`
              : "Docteur inconnu";

            const computedDoctorInitials = doctorNameFromServer
              ? doctorNameFromServer
                  .split(" ")
                  .filter(Boolean)
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : doctor
              ? (doctor.firstName[0] + doctor.lastName[0]).toUpperCase()
              : "??";

            return {
              ...appt,
              id: appt.rdvId,
              patientInitials: (
                patient.firstName[0] + patient.lastName[0]
              ).toUpperCase(),
              patientName: `${patient.firstName} ${patient.lastName}`,
              doctorInitials: computedDoctorInitials,
              doctorName: computedDoctorName,
              reason: "Consultation médicale",
              time,
              date,
              status:
                appt.statut === "confirmé"
                  ? "Confirmé"
                  : appt.statut === "en attente"
                    ? "En attente"
                    : "Annulé",
            };
          } catch (err) {
            return {
              ...appt,
              id: appt.rdvId,
              patientInitials: "??",
              patientName: "Patient inconnu",
              doctorInitials: "??",
              doctorName: "Docteur inconnu",
              reason: "Consultation",
              time: "??:??",
              date: "Date inconnue",
              status:
                appt.statut === "confirmé"
                  ? "Confirmé"
                  : appt.statut === "en attente"
                    ? "En attente"
                    : "Annulé",
            };
          }
        }),
      );

      // Filter by status if needed
      let filtered = displayAppointments;
      if (statusFilter !== "Tous statuts") {
        const statusMap: Record<string, string> = {
          Confirmé: "confirmé",
          "En attente": "en attente",
          Annulé: "annulé",
        };
        filtered = displayAppointments.filter(
          (a) => a.statut === statusMap[statusFilter],
        );
      }

      setAppointments(filtered);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load appointments";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-[#D1FAE5] text-[#10B981]";
      case "En attente":
        return "bg-[#FEF3C7] text-[#F59E0B]";
      case "Annulé":
        return "bg-[#FEE2E2] text-[#EF4444]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[250px] flex flex-col">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-[#1E293B] text-lg lg:text-2xl font-bold">
            Gestion des Rendez-vous
          </h1>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-[#64748B] text-xs lg:text-sm hidden sm:block">
              Admin
            </span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 9.6875C9.2965 9.6875 8.59988 9.56625 7.94992 9.33068C7.29996 9.09512 6.70939 8.74984 6.21194 8.31456C5.71448 7.87929 5.31988 7.36254 5.05065 6.79383C4.78143 6.22511 4.64287 5.61557 4.64287 5C4.64287 4.38443 4.78143 3.77489 5.05065 3.20617C5.31988 2.63746 5.71448 2.12071 6.21194 1.68544C6.70939 1.25016 7.29996 0.904884 7.94992 0.669315C8.59988 0.433746 9.2965 0.3125 10 0.3125C10.7035 0.3125 11.4001 0.433746 12.0501 0.669315C12.7001 0.904884 13.2906 1.25016 13.7881 1.68544C14.2855 2.12071 14.6801 2.63746 14.9494 3.20617C15.2186 3.77489 15.3572 4.38443 15.3572 5C15.3572 5.61557 15.2186 6.22511 14.9494 6.79383C14.6801 7.36254 14.2855 7.87929 13.7881 8.31456C13.2906 8.74984 12.7001 9.09512 12.0501 9.33068C11.4001 9.56625 10.7035 9.6875 10 9.6875ZM8.6384 11.875H11.3616C11.7947 11.875 12.1429 12.1797 12.1429 12.5586C12.1429 12.7227 12.0759 12.8789 11.9554 13.0039L10.7322 14.2539L12.1161 18.75H12.1429L13.6875 13.3398C13.7857 13 14.183 12.793 14.558 12.918C17.3214 13.8398 19.2857 16.1836 19.2857 18.9258C19.2857 19.5156 18.7366 19.9961 18.0625 19.9961L1.93751 20C1.2634 20 0.714294 19.5195 0.714294 18.9297C0.714294 16.1875 2.67858 13.8438 5.44197 12.9219C5.81697 12.7969 6.21429 13.0039 6.31251 13.3438L7.85715 18.7539H7.88394L9.26787 14.2578L8.04465 13.0078C7.92412 12.8828 7.85715 12.7266 7.85715 12.5625C7.85715 12.1836 8.20537 11.8789 8.6384 11.8789V11.875Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 lg:px-10 py-4 lg:py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">
              Aujourd'hui
            </p>
            <div className="text-[#2563EB] text-3xl lg:text-4xl font-bold mb-1">
              12
            </div>
            <p className="text-[#64748B] text-xs">rendez-vous</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">
              Cette Semaine
            </p>
            <div className="text-[#10B981] text-3xl lg:text-4xl font-bold mb-1">
              48
            </div>
            <p className="text-[#64748B] text-xs">rendez-vous</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">En Attente</p>
            <div className="text-[#F59E0B] text-3xl lg:text-4xl font-bold mb-1">
              8
            </div>
            <p className="text-[#64748B] text-xs">à confirmer</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">Annulés</p>
            <div className="text-[#EF4444] text-3xl lg:text-4xl font-bold mb-1">
              3
            </div>
            <p className="text-[#64748B] text-xs">ce mois</p>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="px-4 lg:px-10 pb-6 lg:pb-10">
          {/* Search & Filters */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl px-3 lg:px-5 py-3 flex flex-wrap items-center gap-2 lg:gap-4 mb-4 lg:mb-5">
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                placeholder="Rechercher un rendez-vous..."
                className="w-full h-10 pl-4 pr-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center">
                <Search className="w-3 h-3 text-white" />
              </div>
            </div>

            <button className="px-4 lg:px-6 h-10 bg-white border border-[#E2E8F0] rounded-md text-[13px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              📅 Filtrer par date
            </button>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 lg:px-6 h-10 bg-white border border-[#E2E8F0] rounded-md text-[13px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors appearance-none pr-8 cursor-pointer"
              >
                <option>Tous statuts</option>
                <option>Confirmé</option>
                <option>En attente</option>
                <option>Annulé</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                ▾
              </div>
            </div>

            <Link
              to="/appointments/new"
              className="px-4 lg:px-8 h-10 bg-[#10B981] text-white rounded-md text-sm font-bold hover:bg-[#059669] transition-colors flex items-center whitespace-nowrap"
            >
              + Nouveau RDV
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="bg-[#F8FAFC] px-4 lg:px-8 py-3 lg:py-4 hidden lg:grid grid-cols-12 gap-4 border-b border-[#E2E8F0]">
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Date & Heure
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Patient
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Docteur
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Motif
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
              <div className="px-6 py-8 text-center text-[#64748B]">
                Chargement des rendez-vous...
              </div>
            )}
            {error && (
              <div className="px-6 py-8 text-center text-red-600">
                Erreur: {error}
              </div>
            )}
            {!isLoading && !error && appointments.length === 0 && (
              <div className="px-6 py-8 text-center text-[#64748B]">
                Aucun rendez-vous trouvé
              </div>
            )}

            {/* Table Body */}
            <div className="divide-y divide-[#E2E8F0]">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="px-4 lg:px-8 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-4 items-start lg:items-center hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* Date & Time */}
                  <div className="lg:col-span-2 w-full">
                    <div className="text-[#1E293B] text-sm font-medium">
                      {appointment.date}
                    </div>
                    <div className="text-[#64748B] text-xs mt-0.5">
                      {appointment.time}
                    </div>
                  </div>

                  {/* Patient */}
                  <div className="lg:col-span-2 flex items-center gap-3 w-full pl-0 lg:pl-0">
                    <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {appointment.patientInitials}
                    </div>
                    <span className="text-[#1E293B] text-sm">
                      {appointment.patientName}
                    </span>
                  </div>

                  {/* Doctor */}
                  <div className="lg:col-span-2 flex items-center gap-3 w-full pl-10 lg:pl-0">
                    <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {appointment.doctorInitials}
                    </div>
                    <span className="text-[#1E293B] text-sm">
                      {appointment.doctorName}
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="lg:col-span-2 text-[#64748B] text-sm pl-10 lg:pl-0">
                    {appointment.reason}
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-2 pl-10 lg:pl-0">
                    <span
                      className={`inline-block px-3 lg:px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 absolute top-4 right-4 lg:static">
                    <button className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                      <MoreVertical className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-8 py-4 lg:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
              <span className="text-[#64748B] text-[13px]">
                Affichage 1-6 sur 48 rendez-vous
              </span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-9 bg-white border border-[#E2E8F0] rounded flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <button className="w-10 h-9 bg-[#2563EB] rounded flex items-center justify-center text-white text-sm">
                  1
                </button>
                <button className="w-10 h-10 bg-white border border-[#E2E8F0] rounded flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
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
