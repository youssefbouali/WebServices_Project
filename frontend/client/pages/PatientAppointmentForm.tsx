import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "@/components/PatientSidebar";
import { useAuth } from "@/lib/auth";
import { ChevronLeft, LogOut, AlertCircle, Activity } from "lucide-react";
import {
  scheduleAppointment,
  CreateAppointmentRequest,
} from "@/lib/api/appointments";
import { listProfilesByRole } from "@/lib/api/profiles";
import { useToast } from "@/hooks/use-toast";

export default function PatientAppointmentForm() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    doctorId: "",
    dateRdv: "",
    time: "",
  });

  // Load doctors on mount
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      const data = await listProfilesByRole("DOCTOR");
      setDoctors(data);
    } catch (err) {
      setError("Impossible de charger les docteurs");
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des docteurs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.doctorId || !formData.dateRdv || !formData.time) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!user?.id) {
      setError("Impossible de récupérer votre ID utilisateur");
      return;
    }

    try {
      setIsSubmitting(true);
      const dateTimeString = `${formData.dateRdv}T${formData.time}:00`;

      const appointmentData: CreateAppointmentRequest = {
        patientId: user.id,
        doctorId: formData.doctorId,
        dateRdv: dateTimeString,
      };

      await scheduleAppointment(appointmentData);

      toast({
        title: "Succès",
        description: "Rendez-vous planifié avec succès",
      });

      navigate("/patient/appointments");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la planification";
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F7FA]">
      <PatientSidebar />

      <div className="flex-1 ml-0 lg:ml-[250px] flex flex-col">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-[#1E293B] text-lg lg:text-2xl font-bold">
            Planifier un Rendez-vous
          </h1>
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="text-[#64748B] text-xs lg:text-sm hidden sm:block">
              {fullName}
            </span>
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

        {/* Form Content */}
        <div className="px-4 lg:px-10 py-6 lg:py-10 flex-1">
          <div className="max-w-4xl">
            {/* Back Button */}
            <button
              onClick={() => navigate("/patient/appointments")}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border border-[#E2E8F0] rounded text-[#64748B] text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>

            {/* Form Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-10">
              <div className="mb-6">
                <h2 className="text-[#1E293B] text-xl font-bold mb-2">
                  Informations du Rendez-vous
                </h2>
                <p className="text-[#64748B] text-sm">
                  Remplissez les détails ci-dessous pour planifier un
                  rendez-vous
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <div className="text-[#991B1B] text-sm">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-[#1E293B] text-sm font-bold mb-2">
                    Sélectionner le Docteur *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.doctorId}
                      onChange={(e) =>
                        setFormData({ ...formData, doctorId: e.target.value })
                      }
                      disabled={isLoadingDoctors}
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isLoadingDoctors
                          ? "Chargement des docteurs..."
                          : "Sélectionner un docteur"}
                      </option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                      ▾
                    </div>
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Date */}
                  <div>
                    <label className="block text-[#1E293B] text-sm font-bold mb-2">
                      Date du Rendez-vous *
                    </label>
                    <input
                      type="date"
                      value={formData.dateRdv}
                      onChange={(e) =>
                        setFormData({ ...formData, dateRdv: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-[#1E293B] text-sm font-bold mb-2">
                      Heure *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/patient/appointments")}
                    className="flex-1 px-8 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#E2E8F0] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingDoctors}
                    className="flex-1 px-8 py-3 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-[#1E40AF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "En cours..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
