import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Activity, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getPatientTreatments, Treatment } from "@/lib/api/treatments";
import { getProfileById } from "@/lib/api/profiles";

export default function TreatmentTracking() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      // Load patient info
      const patientData = await getProfileById(user.id);
      setPatient(patientData);

      // Load treatments for patient
      const treatmentsData = await getPatientTreatments(parseInt(user.id));
      setTreatments(treatmentsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTreatment = treatments.find((t) => t.statut === "ACTIF");
  const patientInitials = patient
    ? (patient.firstName[0] + patient.lastName[0]).toUpperCase()
    : "??";
  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : "Patient";
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Page de suivi du traitement
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Back Button */}
          <Link to="/profiles">
            <Button
              variant="outline"
              className="mb-6 border-[#E2E8F0] text-[#64748B]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Info & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Loading/Error state */}
              {isLoading && (
                <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 text-center text-[#64748B]">
                  Chargement des données...
                </div>
              )}
              {error && (
                <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 text-center text-red-600">
                  Erreur: {error}
                </div>
              )}

              {/* Patient Card */}
              {!isLoading && !error && (
                <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-15 h-15 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] font-bold text-xl flex-shrink-0">
                      {patientInitials}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1E293B]">
                        {patientName}
                      </h3>
                      {currentTreatment ? (
                        <>
                          <p className="text-sm text-[#64748B] mt-1">
                            Traitement: {currentTreatment.medicament}{" "}
                            {currentTreatment.dosage}
                          </p>
                          <p className="text-xs text-[#64748B] mt-1">
                            {currentTreatment.frequence}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-[#64748B] mt-1">
                          Aucun traitement actif
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-[#64748B] mb-2">
                        Progression Globale
                      </p>
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full" viewBox="0 0 88 88">
                          <circle
                            cx="44"
                            cy="44"
                            r="40"
                            stroke="#E2E8F0"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="44"
                            cy="44"
                            r="40"
                            stroke="#10B981"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray="251.2"
                            strokeDashoffset="37.68"
                            transform="rotate(-90 44 44)"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-[#10B981]">
                            85%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Section */}
              <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
                <h3 className="text-xl font-bold text-[#1E293B] mb-6">
                  Historique des Prises
                </h3>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-6 before:bottom-6 before:w-0.5 before:bg-[#CBD5E1]">
                  {/* Completed */}
                  <div className="flex items-start gap-4 relative">
                    <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 relative z-10 bg-white" />
                    <div className="flex-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-[#15803D]">
                            Prise effectuée
                          </p>
                          <p className="text-xs text-[#166534] mt-1">
                            Aujourd'hui - 08:00
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs rounded-full">
                          Validé
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex items-start gap-4 relative">
                    <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 relative z-10 bg-white" />
                    <div className="flex-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-[#15803D]">
                            Prise effectuée
                          </p>
                          <p className="text-xs text-[#166534] mt-1">
                            Hier - 20:00
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs rounded-full">
                          Validé
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Missed */}
                  <div className="flex items-start gap-4 relative">
                    <XCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0 relative z-10 bg-white" />
                    <div className="flex-1 bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-[#DC2626]">
                            Prise manquée
                          </p>
                          <p className="text-xs text-[#991B1B] mt-1">
                            Hier - 14:00
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs rounded-full">
                          Manqué
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex items-start gap-4 relative">
                    <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 relative z-10 bg-white" />
                    <div className="flex-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-[#15803D]">
                            Prise effectuée
                          </p>
                          <p className="text-xs text-[#166534] mt-1">
                            Avant-hier - 08:00
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs rounded-full">
                          Validé
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-[#10B981] hover:bg-[#059669] text-white h-11">
                  ✓ Valider la Prise
                </Button>
              </div>
            </div>

            {/* Right Column - Stats & Reminders */}
            <div className="space-y-6">
              {/* Upcoming Reminders */}
              <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                  Rappels à Venir
                </h3>
                <div className="space-y-3">
                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1E40AF]">
                          Aujourd'hui 14:00
                        </p>
                        <p className="text-xs text-[#1E40AF] mt-1">
                          Prise de midi
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#64748B] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#475569]">
                          Aujourd'hui 20:00
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          Prise du soir
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                  Évolution
                </h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-[#3B82F6] rounded-t"
                      style={{ height: "50%" }}
                    ></div>
                    <span className="text-xs text-[#64748B] mt-2">Lun</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-[#3B82F6] rounded-t"
                      style={{ height: "65%" }}
                    ></div>
                    <span className="text-xs text-[#64748B] mt-2">Mar</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-[#10B981] rounded-t"
                      style={{ height: "80%" }}
                    ></div>
                    <span className="text-xs text-[#64748B] mt-2">Mer</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-[#10B981] rounded-t"
                      style={{ height: "100%" }}
                    ></div>
                    <span className="text-xs text-[#64748B] mt-2">Jeu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
