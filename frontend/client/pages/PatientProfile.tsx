import { useEffect, useState } from "react";
import PatientSidebar from "@/components/PatientSidebar";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, MapPin, Calendar, LogOut, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getProfileById, Profile } from "@/lib/api/profiles";

export default function PatientProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : "??";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) {
        throw new Error("User not found");
      }
      const profileData = await getProfileById(user.id);
      setProfile(profileData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Échec du chargement du profil";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PatientSidebar />
      <div className="flex-1 ml-0 lg:ml-[250px]">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-lg lg:text-2xl font-bold text-[#1E293B]">
            Mon Profil
          </h1>
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="text-[#64748B] text-xs lg:text-sm hidden sm:block">
              {fullName}
            </span>
            <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-[#2563EB] font-bold text-xs">
                {initials}
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

        {/* Main Content */}
        <main className="p-4 lg:p-10">
          {/* Loading/Error state */}
          {loading && (
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 text-center text-[#64748B]">
              Chargement du profil...
            </div>
          )}
          {error && (
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 text-center text-red-600">
              Erreur: {error}
            </div>
          )}

          {/* Profile Card */}
          {!loading && !error && profile && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] px-6 lg:px-8 py-8 lg:py-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 lg:gap-6">
                      {/* Avatar */}
                      <div className="w-24 h-24 lg:w-[100px] lg:h-[100px] rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-[#2563EB] text-3xl lg:text-4xl font-bold">
                          {initials}
                        </span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 text-white pt-2">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                          {fullName}
                        </h2>
                        <p className="text-blue-100 text-sm lg:text-base">
                          {profile.role === "PATIENT"
                            ? "Patient"
                            : "Utilisateur"}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
                      <Edit2 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Modifier</span>
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="px-6 lg:px-8 py-6 lg:py-8">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                        Informations Personnelles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#2563EB] font-bold">👤</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Prénom
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B] break-words">
                              {profile.firstName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#2563EB] font-bold">👤</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Nom
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B] break-words">
                              {profile.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-[#F59E0B]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Date de Naissance
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B]">
                              {profile.dateNaissance
                                ? new Date(
                                    profile.dateNaissance,
                                  ).toLocaleDateString("fr-FR")
                                : "Non renseignée"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#9333EA] font-bold">🔑</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              ID Patient
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B] break-all">
                              {profile.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-[#E2E8F0] pt-6">
                      <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                        Coordonnées
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Email
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B] break-all">
                              {profile.email || "Non renseigné"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Téléphone
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B]">
                              {profile.telephone || "Non renseigné"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Adresse
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B]">
                              {profile.adresse || "Non renseignée"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    {profile.groupe_sanguin && (
                      <div className="border-t border-[#E2E8F0] pt-6">
                        <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                          Informations Médicales
                        </h3>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#DC2626] font-bold">🩸</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs lg:text-sm text-[#64748B] mb-1">
                              Groupe Sanguin
                            </p>
                            <p className="text-sm lg:text-base font-medium text-[#1E293B]">
                              {profile.groupe_sanguin}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
