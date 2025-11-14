import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { createTreatment } from "@/lib/api/treatments";
import { listProfiles } from "@/lib/api/profiles";

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
  const [patients, setPatients] = useState<any[]>([]);
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
    try {
      const data = await listProfiles({ role: "PATIENT" });
      setPatients(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load patients";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.patientId) {
        throw new Error("Patient is required");
      }

      await createTreatment({
        patientId: formData.patientId,
        medicament: formData.medicament,
        dosage: formData.dosage,
        frequence: formData.frequence,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        instructions: formData.instructions,
      });

      navigate(`/treatment-tracking?patientId=${formData.patientId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create treatment";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Page d'ajout d'un traitement
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
          <Link to="/profiles">
            <Button
              variant="outline"
              className="mb-6 border-[#E2E8F0] text-[#64748B]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
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
                    onChange={(e) =>
                      setFormData({ ...formData, patientId: e.target.value })
                    }
                    className="w-full h-[50px] px-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#94A3B8] appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Choisir un patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-90deg] w-3 h-3 text-[#64748B] pointer-events-none" />
                </div>
              </div>

              {/* Medication Name */}
              <div>
                <Label className="text-sm font-bold text-[#475569]">
                  Nom du Médicament <span className="text-[#2563EB]">*</span>
                </Label>
                <Input
                  placeholder="Ex: Amoxicilline"
                  value={formData.medicament}
                  onChange={(e) =>
                    setFormData({ ...formData, medicament: e.target.value })
                  }
                  className="mt-2 h-[50px] bg-[#F8FAFC] border-[#CBD5E1]"
                  required
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
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Fréquence <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: 3 fois par jour"
                    value={formData.frequence}
                    onChange={(e) =>
                      setFormData({ ...formData, frequence: e.target.value })
                    }
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
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
                    onChange={(e) =>
                      setFormData({ ...formData, dateDebut: e.target.value })
                    }
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-[#475569]">
                    Date de Fin <span className="text-[#2563EB]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.dateFin}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFin: e.target.value })
                    }
                    className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                    required
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
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  className="mt-2 h-[50px] bg-white border-[#CBD5E1]"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Link to="/treatment-tracking" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]"
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-[#2563EB] text-white hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
