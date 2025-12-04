import { useState, useEffect } from "react";
import DoctorSidebar from "@/components/DoctorSidebar";
import { useAuth } from "@/lib/auth";
import { LogOut, Search, Mail, Phone, AlertCircle, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listProfiles, Profile } from "@/lib/api/profiles";

export default function DoctorPatients() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const doctorTitle = user?.role === "DOCTOR" ? `Dr. ${fullName}` : fullName;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await listProfiles({
        role: "PATIENT",
      });
      setPatients(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load patients";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <DoctorSidebar />
      <div className="flex-1 lg:ml-[250px]">
        <header className="h-16 lg:h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-[#1E293B] text-lg lg:text-[28px] font-bold">
            Mes Patients
          </h1>
          <div className="flex items-center gap-2 lg:gap-4">
            <p className="text-[#64748B] text-sm hidden sm:block">
              {doctorTitle}
            </p>
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

        <div className="p-4 lg:p-10">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-4 pr-12 bg-white border border-[#E2E8F0] rounded-lg text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="text-[#991B1B] text-sm">{error}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 text-[#64748B]">
              Chargement des patients...
            </div>
          )}

          {/* Patients Table */}
          {!isLoading && !error && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
                <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                  Nom
                </div>
                <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                  Email
                </div>
                <div className="col-span-2 text-[#475569] text-[13px] font-bold">
                  Téléphone
                </div>
                <div className="col-span-3 text-[#475569] text-[13px] font-bold">
                  Maladie Chronique
                </div>
                <div className="col-span-3 text-[#475569] text-[13px] font-bold">
                  Statut
                </div>
              </div>

              {/* Table Body */}
              {filteredPatients.length === 0 ? (
                <div className="px-6 py-12 text-center text-[#64748B]">
                  {searchTerm
                    ? "Aucun patient ne correspond à votre recherche"
                    : "Aucun patient trouvé"}
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="px-4 lg:px-6 py-4 lg:grid lg:grid-cols-12 gap-4 lg:gap-4 items-center hover:bg-[#F8FAFC] transition-colors flex flex-col"
                    >
                      {/* Name */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#2563EB] font-bold text-sm">
                              {(patient.firstName[0] || "?") +
                                (patient.lastName[0] || "?")}
                            </span>
                          </div>
                          <span className="text-[#1E293B] text-sm font-medium">
                            {patient.firstName} {patient.lastName}
                          </span>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="lg:col-span-2 flex items-center gap-2 text-[#64748B] text-sm lg:text-base">
                        <Mail className="w-4 h-4 flex-shrink-0 hidden lg:block" />
                        {patient.email}
                      </div>

                      {/* Phone */}
                      <div className="lg:col-span-2 flex items-center gap-2 text-[#64748B] text-sm lg:text-base">
                        <Phone className="w-4 h-4 flex-shrink-0 hidden lg:block" />
                        {patient.phone || "-"}
                      </div>

                      {/* Chronic Disease */}
                      <div className="lg:col-span-3 text-[#64748B] text-sm lg:text-base">
                        {patient.maladieChronique || "-"}
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-3">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
                            patient.isActive
                              ? "bg-[#D1FAE5] text-[#10B981]"
                              : "bg-[#FEE2E2] text-[#EF4444]"
                          }`}
                        >
                          {patient.isActive ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {filteredPatients.length > 0 && (
                <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[#64748B] text-sm">
                  {filteredPatients.length} patient
                  {filteredPatients.length > 1 ? "s" : ""} affiché
                  {filteredPatients.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
