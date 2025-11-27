import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ChevronLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { createTreatment } from "../lib/api/treatments";
import { API_BASE_URLS, apiFetch } from "../lib/api/config";
import { listProfiles, Profile } from "@/lib/api/profiles";

export default function TreatmentForm() {
  const [formData, setFormData] = useState({
    patientId: "",
    medicament: "",
    dosage: "",
    frequence: "",
    dateDebut: "",
    dateFin: "",
    instructions: "",
  });
  const [patients, setPatients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    setError("");
    try {
      const profiles = await listProfiles({ role: "PATIENT" });
      if (profiles && profiles.length > 0) {
        setPatients(profiles);
      } else {
        setError("Aucun patient trouvé");
        setPatients([]);
      }
    } catch (err: any) {
      console.error("❌ Erreur chargement patients:", err);
      setError("Impossible de charger les patients (service Profiles)");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!formData.patientId) {
      setError("Veuillez sélectionner un patient");
      setIsSubmitting(false);
      return;
    }

    // Validation des dates
    if (formData.dateDebut && formData.dateFin) {
      const startDate = new Date(formData.dateDebut);
      const endDate = new Date(formData.dateFin);
      if (endDate <= startDate) {
        setError("La date de fin doit être après la date de début");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      console.log("🔄 Création du traitement...", formData);
      
      // Formatage des dates pour Spring Boot
      const toLocalDateTime = (val: string) => {
        if (!val) return "";
        // value from input[type="datetime-local"] is like "YYYY-MM-DDTHH:mm"
        // Ensure seconds are present but no timezone (LocalDateTime expected)
        return val.length === 16 ? `${val}:00` : val;
      };

      const treatmentData = {
        patientId: formData.patientId,
        medicament: formData.medicament,
        dosage: formData.dosage,
        frequence: formData.frequence,
        dateDebut: toLocalDateTime(formData.dateDebut),
        dateFin: toLocalDateTime(formData.dateFin),
        instructions: formData.instructions,
      };

      console.log("📦 Données envoyées:", treatmentData);
      
      const result = await createTreatment(treatmentData);

      console.log("✅ Traitement créé avec succès!", result);
      
      // Redirection vers la page de suivi
      navigate(`/treatment-tracking?patientId=${formData.patientId}`);
      
    } catch (err: any) {
      console.error("❌ Erreur création traitement:", err);
      let message = err?.message || "Erreur lors de la création du traitement";
      
      // Messages d'erreur plus spécifiques
      if (err?.status === 400) {
        message = "Données invalides. Vérifiez tous les champs obligatoires.";
      } else if (err?.status === 500) {
        message = "Erreur serveur. Veuillez réessayer.";
      }
      
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Ajouter un Traitement
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/treatment-tracking">
            <Button
              variant="outline"
              className="mb-6 border-[#E2E8F0] text-[#64748B]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour au suivi
            </Button>
          </Link>

          {/* Form Container */}
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8">
            <h2 className="text-xl font-bold text-[#1E293B] mb-8">
              Informations du Traitement
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div>
                <Label className="text-sm font-bold text-[#475569]">
                  Sélectionner le Patient{" "}
                  <span className="text-[#2563EB]">*</span>
                </Label>
                <div className="relative mt-2">
                  <select
                    value={formData.patientId}
                    onChange={(e) => handleInputChange("patientId", e.target.value)}
                    className="w-full h-[50px] px-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#1E293B] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Choisir un patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                        {patient.email ? ` (${patient.email})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-90deg] w-3 h-3 text-[#64748B] pointer-events-none" />
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-[#64748B] mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement des patients depuis la base de données...
                  </div>
                )}
                {!isLoading && patients.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Aucun patient disponible. Vérifiez que le service Profiles est en cours d'exécution.
                  </p>
                )}
                {!isLoading && patients.length > 0 && (
                  <p className="text-sm text-[#64748B] mt-2">
                    {patients.length} patient(s) chargé(s) depuis MongoDB
                  </p>
                )}
              </div>

              {/* Medication Name */}
              <div>
                <Label className="text-sm font-bold text-[#475569]">
                  Nom du Médicament <span className="text-[#2563EB]">*</span>
                </Label>
                <Input
                  placeholder="Ex: Amoxicilline"
                  value={formData.medicament}
                  onChange={(e) => handleInputChange("medicament", e.target.value)}
                  className="mt-2 h-[50px] bg-[#F8FAFC] border-[#CBD5E1]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Dose and Frequency */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Dose <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: 500mg"
                    value={formData.dosage}
                    onChange={(e) => handleInputChange("dosage", e.target.value)}
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Fréquence <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: 3 fois par jour"
                    value={formData.frequence}
                    onChange={(e) => handleInputChange("frequence", e.target.value)}
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Start and End Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Date de Début <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.dateDebut}
                    onChange={(e) => handleInputChange("dateDebut", e.target.value)}
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Date de Fin <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.dateFin}
                    onChange={(e) => handleInputChange("dateFin", e.target.value)}
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <Label className="text-sm font-bold text-[#475569]">
                  Instructions <span className="text-[#2563EB]">*</span>
                </Label>
                <Input
                  placeholder="Ex: À prendre après les repas"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange("instructions", e.target.value)}
                  className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Link to="/treatment-tracking" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading || patients.length === 0}
                  className="flex-1 h-11 bg-[#2563EB] text-white hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer le Traitement"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
