import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Activity, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getPatientTreatments, Treatment, validateDose, sendReminder } from "@/lib/api/treatments";
import { getProfileById } from "@/lib/api/profiles";
import { toast } from "@/components/ui/use-toast";

export default function TreatmentTracking() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const CIRC = 2 * Math.PI * 40;
  const computeProgress = (t?: Treatment) => {
    if (!t) return 0;
    const start = new Date(t.dateDebut).getTime();
    const end = new Date(t.dateFin).getTime();
    const now = Date.now();
    if (end <= start) return 0;
    const pct = ((now - start) / (end - start)) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  useEffect(() => {
    loadData();
  }, [user, searchParams]);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      const pid = searchParams.get("patientId") ?? user.id;
      const patientData = await getProfileById(pid);
      setPatient(patientData);

      const treatmentsData = await getPatientTreatments(pid);
      setTreatments(treatmentsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateDose = async () => {
    const current = treatments.find((t) => t.statut === "ACTIF");
    if (!current) return;
    setIsValidating(true);
    try {
      const isoNoZ = new Date().toISOString().slice(0, 19);
      await validateDose(current.id, { datePrise: isoNoZ });
      toast({ title: "Prise validée", description: "La prise a été validée avec succès." });
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Échec de validation de la prise";
      setError(message);
      toast({ title: "Erreur", description: message });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSendReminder = async () => {
    const current = treatments.find((t) => t.statut === "ACTIF");
    if (!current) return;
    setIsSendingReminder(true);
    try {
      await sendReminder(current.id);
      toast({ title: "Rappel envoyé", description: "Le rappel a été envoyé." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Échec de l'envoi du rappel";
      setError(message);
      toast({ title: "Erreur", description: message });
    } finally {
      setIsSendingReminder(false);
    }
  };

  const currentTreatment = treatments.find((t) => t.statut === "ACTIF");
  const patientInitials = patient
    ? (patient.firstName[0] + patient.lastName[0]).toUpperCase()
    : "??";
  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : "Patient";
  const today0 = new Date();
  today0.setHours(0, 0, 0, 0);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const dayLabel = (d: Date) => ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][d.getDay()];
  const evolutionBars = (() => {
    if (!currentTreatment) return [] as { label: string; height: number; color: string }[];
    const start0 = new Date(currentTreatment.dateDebut);
    start0.setHours(0, 0, 0, 0);
    const end0 = new Date(currentTreatment.dateFin);
    end0.setHours(23, 59, 59, 999);
    const last = currentTreatment.lastDoseAt ? new Date(currentTreatment.lastDoseAt) : null;
    const arr: { label: string; height: number; color: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const within = d >= start0 && d <= end0;
      const isLast = last ? sameDay(d, last) : false;
      const isPast = d < today0;
      const isToday = sameDay(d, today0);
      let height = 20;
      let color = "#E2E8F0";
      if (within) {
        if (isPast) {
          height = isLast ? 100 : 70;
          color = isLast ? "#10B981" : "#3B82F6";
        } else if (isToday) {
          height = isLast ? 85 : 50;
          color = isLast ? "#10B981" : "#3B82F6";
        } else {
          height = 30;
          color = "#3B82F6";
        }
      }
      arr.push({ label: dayLabel(d), height, color });
    }
    return arr;
  })();
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
                            strokeDasharray={CIRC}
                            strokeDashoffset={CIRC * (1 - computeProgress(currentTreatment) / 100)}
                            transform="rotate(-90 44 44)"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-[#10B981]">
                            {Math.round(computeProgress(currentTreatment))}%
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

                <div className="space-y-4">
                  {treatments.map((t) => (
                    <div key={t.id} className="flex items-start gap-4">
                      {t.suiviCorrect ? (
                        <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0" />
                      )}
                      <div className="flex-1 bg-white border border-[#E2E8F0] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm text-[#1E293B]">
                              {t.medicament} {t.dosage}
                            </p>
                            <p className="text-xs text-[#64748B] mt-1">
                              {t.frequence} • {new Date(t.dateDebut).toLocaleString()} → {new Date(t.dateFin).toLocaleString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
                            {t.statut}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleValidateDose} disabled={isValidating || !currentTreatment} className="w-full mt-6 bg-[#10B981] hover:bg-[#059669] text-white h-11">
                  {isValidating ? "Validation..." : "✓ Valider la Prise"}
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
                  <div className="flex justify-end">
                    <Button onClick={handleSendReminder} disabled={isSendingReminder || !currentTreatment} className="bg-[#2563EB] hover:bg-[#1E40AF] text-white">
                      {isSendingReminder ? "Envoi..." : "Envoyer un rappel"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                  Évolution
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-sm text-[#64748B]">Début: {currentTreatment ? new Date(currentTreatment.dateDebut).toLocaleString() : "-"}</div>
                  <div className="text-sm text-[#64748B]">Fin: {currentTreatment ? new Date(currentTreatment.dateFin).toLocaleString() : "-"}</div>
                  <div className="text-sm text-[#64748B]">Dernière prise: {currentTreatment?.lastDoseAt ? new Date(currentTreatment.lastDoseAt).toLocaleString() : "-"}</div>
                  <div className="text-sm text-[#64748B]">Progression: {Math.round(computeProgress(currentTreatment))}%</div>
                </div>
                <div className="flex items-end justify-between h-32 gap-2">
                  {evolutionBars.map((b, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="w-full rounded-t" style={{ height: `${b.height}%`, backgroundColor: b.color }}></div>
                      <span className="text-xs text-[#64748B] mt-2">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
