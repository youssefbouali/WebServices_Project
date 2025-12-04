import { useState, useEffect } from "react";
import DoctorSidebar from "@/components/DoctorSidebar";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LogOut,
  Edit2,
  X,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  getDoctorAppointments,
  Appointment,
  cancelAppointment,
  updateAppointment,
  confirmAppointment,
} from "@/lib/api/appointments";
import { useToast } from "@/hooks/use-toast";

type DisplayAppointment = Appointment & {
  patientInitials: string;
  patientName: string;
  doctorInitials: string;
  doctorName: string;
  reason: string;
  time: string;
  date: string;
};

export default function DoctorAppointments() {
  const [statusFilter, setStatusFilter] = useState("Tous statuts");
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const doctorTitle = user?.role === "DOCTOR" ? `Dr. ${fullName}` : fullName;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCancelAppointment = async (rdvId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous?")) {
      return;
    }

    try {
      setIsActionLoading(true);
      await cancelAppointment(rdvId);
      toast({
        title: "Succès",
        description: "Rendez-vous annulé avec succès",
      });
      loadAppointments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'annulation";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateAppointment = async (rdvId: number) => {
    if (!editDate || !editTime) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et heure",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsActionLoading(true);
      const dateTimeString = `${editDate}T${editTime}:00`;
      await updateAppointment(rdvId, dateTimeString);
      toast({
        title: "Succès",
        description: "Rendez-vous mis à jour avec succès",
      });
      setEditingId(null);
      loadAppointments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmAppointment = async (rdvId: number) => {
    try {
      setIsActionLoading(true);
      await confirmAppointment(rdvId);
      toast({
        title: "Succès",
        description: "Rendez-vous confirmé",
      });
      loadAppointments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la confirmation";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setIsActionLoading(false);
    }
  };

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

      const rawAppointments = await getDoctorAppointments(user.id);

      const displayAppointments: DisplayAppointment[] = rawAppointments.map(
        (appt) => {
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

          const patientName = appt.patientName && appt.patientName.trim().length > 0
            ? appt.patientName
            : `Patient #${appt.patientId}`;
          const patientInitials = (patientName
            .split(/\s+/)
            .map((s) => s[0] || "")
            .join("") || "PT")
            .toUpperCase();

          const doctorName = appt.doctorName && appt.doctorName.trim().length > 0
            ? appt.doctorName
            : `Docteur #${appt.doctorId}`;
          const doctorInitials = (doctorName
            .replace(/^Dr\.?\s*/i, "")
            .split(/\s+/)
            .map((s) => s[0] || "")
            .join("") || "?")
            .toUpperCase();

          return {
            ...appt,
            patientInitials,
            patientName,
            doctorInitials,
            doctorName,
            reason: "Consultation médicale",
            time,
            date,
          };
        },
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
      <DoctorSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[250px] flex flex-col">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-[#1E293B] text-lg lg:text-2xl font-bold">
            Rendez-vous
          </h1>
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="text-[#64748B] text-xs lg:text-sm hidden sm:block">
              {doctorTitle}
            </span>
            <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-[#2563EB] font-bold text-xs">
                {(user?.firstName?.[0] || "?") + (user?.lastName?.[0] || "?")}
              </span>
            </div>
            <button
              onClick={() => navigate("/monitoring")}
              className="flex items-center gap-2 px-3 py-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8] rounded-lg transition-colors text-xs lg:text-sm"
              title="Monitoring"
            >
              <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Monitoring</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs lg:text-sm hidden sm:block">
                Déconnexion
              </span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 lg:px-10 py-4 lg:py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">À venir</p>
            <div className="text-[#2563EB] text-3xl lg:text-4xl font-bold mb-1">
              {
                appointments.filter((a) => new Date(a.dateRdv) > new Date())
                  .length
              }
            </div>
            <p className="text-[#64748B] text-xs">rendez-vous</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">Confirmés</p>
            <div className="text-[#10B981] text-3xl lg:text-4xl font-bold mb-1">
              {appointments.filter((a) => a.statut === "confirmé").length}
            </div>
            <p className="text-[#64748B] text-xs">confirmés</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">En Attente</p>
            <div className="text-[#F59E0B] text-3xl lg:text-4xl font-bold mb-1">
              {appointments.filter((a) => a.statut === "en attente").length}
            </div>
            <p className="text-[#64748B] text-xs">à confirmer</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 lg:p-8">
            <p className="text-[#64748B] text-xs lg:text-sm mb-1">Annulés</p>
            <div className="text-[#EF4444] text-3xl lg:text-4xl font-bold mb-1">
              {appointments.filter((a) => a.statut === "annulé").length}
            </div>
            <p className="text-[#64748B] text-xs">annulés</p>
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
              <div className="col-span-3 text-[#475569] text-[13px] font-bold">
                Motif
              </div>
              <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                Statut
              </div>
              <div className="col-span-3 text-[#475569] text-[13px] font-bold">
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
                  key={appointment.rdvId}
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

                  {/* Reason */}
                  <div className="lg:col-span-3 text-[#64748B] text-sm pl-10 lg:pl-0">
                    {appointment.reason}
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-2 pl-10 lg:pl-0">
                    <span
                      className={`inline-block px-3 lg:px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                        appointment.statut,
                      )}`}
                    >
                      {appointment.statut === "confirmé"
                        ? "Confirmé"
                        : appointment.statut === "en attente"
                          ? "En attente"
                          : "Annulé"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex items-center gap-2 absolute top-4 right-4 lg:static">
                    {appointment.statut !== "annulé" && (
                      <>
                        {(appointment.statut === "en attente" || appointment.statut === "En attente") && (
                          <button
                            onClick={() => handleConfirmAppointment(appointment.rdvId)}
                            disabled={isActionLoading}
                            className="px-3 h-7 rounded bg-[#D1FAE5] text-[#065F46] text-xs font-bold hover:bg-[#A7F3D0] transition-colors disabled:opacity-50"
                          >
                            Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingId(appointment.rdvId);
                            setEditDate(appointment.dateRdv.split("T")[0]);
                            setEditTime(
                              appointment.dateRdv
                                .split("T")[1]
                                ?.substring(0, 5),
                            );
                          }}
                          className="w-7 h-7 rounded-full bg-[#DBEAFE] flex items-center justify-center hover:bg-[#BFDBFE] transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        </button>
                        <button
                          onClick={() =>
                            handleCancelAppointment(appointment.rdvId)
                          }
                          disabled={isActionLoading}
                          className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center hover:bg-[#FECACA] transition-colors disabled:opacity-50"
                          title="Annuler"
                        >
                          <X className="w-3.5 h-3.5 text-[#EF4444]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-8 py-4 lg:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
              <span className="text-[#64748B] text-[13px]">
                Affichage {appointments.length > 0 ? "1" : "0"}-
                {appointments.length} sur {appointments.length} rendez-vous
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

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-[#1E293B] text-lg font-bold mb-4">
              Modifier le Rendez-vous
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#1E293B] text-sm font-bold mb-2">
                  Nouvelle Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-[#1E293B] text-sm font-bold mb-2">
                  Nouvelle Heure
                </label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full h-10 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 px-4 py-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#E2E8F0] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdateAppointment(editingId)}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
              >
                {isActionLoading ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
