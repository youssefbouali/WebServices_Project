import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Save,
  FileText,
  Upload,
  QrCode,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createDevice } from "@/lib/api/devices";
import { useToast } from "@/hooks/use-toast";

export default function DeviceRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "sensor",
    manufacturer: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires (Nom et Type)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createDevice({
        name: formData.name,
        type: formData.type,
        manufacturer: formData.manufacturer,
        notes: formData.notes,
      });
      toast({
        title: "Succès",
        description: "L'appareil a été créé avec succès",
      });
      navigate("/devices");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create device";
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
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      <main className="flex-1 ml-0 lg:ml-[250px]">
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Enregistrement d'appareil
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Admin</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <Link
            to="/devices"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 px-4 py-2 rounded-lg border border-gray-200 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </Link>

          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Nouveau dispositif médical
                </h2>
                <p className="text-gray-600">
                  Remplissez les informations ci-dessous pour enregistrer
                  l'appareil
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'appareil *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Moniteur Cardiaque 01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'appareil *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sensor">Capteur</option>
                    <option value="monitor">Moniteur</option>
                    <option value="device">Appareil Médical</option>
                    <option value="pump">Pompe</option>
                    <option value="ventilator">Respirateur</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricant
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="Ex: Philips Healthcare"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes additionnelles
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Informations supplémentaires sur l'appareil..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6 flex items-center justify-between">
                <Link
                  to="/devices"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">←</span>
                  <span>Annuler</span>
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/devices")}
                    className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Quitter</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span className="text-lg">✓</span>
                    <span>
                      {isSubmitting
                        ? "Enregistrement..."
                        : "Enregistrer l'appareil"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Scanner QR Code</h3>
                  <p className="text-sm text-gray-600">Enregistrement rapide</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Import CSV</h3>
                  <p className="text-sm text-gray-600">Enregistrement en lot</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Historique</h3>
                  <p className="text-sm text-gray-600">
                    Voir les enregistrements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
