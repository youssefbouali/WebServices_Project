import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/auth";
import { ChevronLeft, LogOut } from "lucide-react";

export default function AppointmentForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient: "Ahmed Khalid",
    doctor: "Dr. Sara Ahmed - Cardiologie",
    date: "22 Octobre 2025",
    time: "09:30",
    reason: "Suivi cardiaque - Contrôle régulier",
    notes: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[250px] flex flex-col">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-[#1E293B] text-lg lg:text-2xl font-bold">
            Planifier un Nouveau Rendez-vous
          </h1>
          <div className="flex items-center gap-2 lg:gap-4">
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
        <div className="px-4 lg:px-10 py-6 lg:py-10">
          <div className="max-w-4xl">
            {/* Back Button */}
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border border-[#E2E8F0] rounded text-[#64748B] text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>

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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-[#1E293B] text-sm font-bold mb-2">
                    Sélectionner le Patient *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.patient}
                      onChange={(e) =>
                        setFormData({ ...formData, patient: e.target.value })
                      }
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option>Ahmed Khalid</option>
                      <option>Fatima Zahra</option>
                      <option>Youssef Bouali</option>
                      <option>Brahim Chakir</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                      ▾
                    </div>
                  </div>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block text-[#1E293B] text-sm font-bold mb-2">
                    Sélectionner le Docteur *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.doctor}
                      onChange={(e) =>
                        setFormData({ ...formData, doctor: e.target.value })
                      }
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option>Dr. Sara Ahmed - Cardiologie</option>
                      <option>Dr. Mohammed Hassan - Médecine générale</option>
                      <option>Dr. Amina Bennis - Pédiatrie</option>
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
                    <div className="relative">
                      <input
                        type="text"
                        value={`📅 ${formData.date}`}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date: e.target.value.replace("📅 ", ""),
                          })
                        }
                        className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-[#1E293B] text-sm font-bold mb-2">
                      Heure *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={`🕐 ${formData.time}`}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            time: e.target.value.replace("🕐 ", ""),
                          })
                        }
                        className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>

                {/* Consultation Reason */}
                <div>
                  <label className="block text-[#1E293B] text-sm font-bold mb-2">
                    Motif de la Consultation *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option>Suivi cardiaque - Contrôle régulier</option>
                      <option>Consultation générale</option>
                      <option>Urgence</option>
                      <option>Bilan annuel</option>
                      <option>Contrôle post-opératoire</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                      ▾
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[#1E293B] text-sm font-bold mb-2">
                    Notes Additionnelles (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Ajoutez des informations complémentaires..."
                    rows={4}
                    className="w-full px-6 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#1E293B] placeholder:text-[#94A3B8] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Availability Confirmation */}
                <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#166534] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="text-[#166534] text-sm font-bold mb-1">
                        Disponibilité confirmée
                      </div>
                      <div className="text-[#16A34A] text-xs">
                        Dr. Sara Ahmed est disponible le 22 Oct à 09:30
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    to="/appointments"
                    className="flex-1 px-8 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#475569] text-center hover:bg-[#E2E8F0] transition-colors"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-3 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-[#1E40AF] transition-colors"
                  >
                    Enregistrer
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
