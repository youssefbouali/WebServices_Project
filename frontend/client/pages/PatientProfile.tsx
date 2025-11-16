import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "@/components/PatientSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function PatientProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const initials = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : "??";

  const handleEditProfile = () => {
    if (user?.id) {
      navigate(`/profiles/edit?id=${encodeURIComponent(user.id)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PatientSidebar />
      <div className="flex-1 lg:ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-xl lg:text-2xl font-bold text-[#1E293B]">
            Mon Profil
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs lg:text-sm text-[#64748B]">{fullName}</span>
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-[#2563EB] font-bold text-sm">{initials}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-10 py-6 lg:py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-[#F8FAFC] px-4 lg:px-8 py-6 lg:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
                {/* Profile Info */}
                <div className="flex items-center gap-4 lg:gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 lg:w-[120px] lg:h-[120px] rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-3xl lg:text-4xl font-bold">
                      {initials}
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B] mb-2">
                      {fullName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB] text-xs font-bold">
                        {user?.role ?? "—"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                        <span className="text-xs font-bold text-[#10B981]">
                          Actif
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#64748B] mb-1">
                      Email: {user?.email ?? "—"}
                    </p>
                    <p className="text-sm text-[#64748B]">
                      Téléphone: {user?.phone ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full lg:w-auto">
                  <Button
                    onClick={handleEditProfile}
                    disabled={loading}
                    className="bg-[#2563EB] text-white hover:bg-[#1E40AF] h-10 text-sm font-bold w-full lg:w-[180px]"
                  >
                    Modifier le profil
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-4 lg:px-8 py-6 lg:py-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-[#1E293B] mb-4">
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Prénom
                    </label>
                    <p className="text-sm text-[#1E293B]">{user?.firstName ?? "—"}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Nom
                    </label>
                    <p className="text-sm text-[#1E293B]">{user?.lastName ?? "—"}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Email
                    </label>
                    <p className="text-sm text-[#1E293B]">{user?.email ?? "—"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-[#1E293B] mb-4">
                  Coordonnées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Téléphone
                    </label>
                    <p className="text-sm text-[#1E293B]">{user?.phone ?? "—"}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Adresse
                    </label>
                    <p className="text-sm text-[#1E293B]">—</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Ville
                    </label>
                    <p className="text-sm text-[#1E293B]">—</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-base font-bold text-[#1E293B] mb-4">
                  Informations du Compte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Rôle
                    </label>
                    <p className="text-sm text-[#1E293B]">{user?.role ?? "—"}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Statut
                    </label>
                    <p className="text-sm text-[#10B981] font-bold">Actif</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#94A3B8] mb-1">
                      Dernière mise à jour
                    </label>
                    <p className="text-sm text-[#1E293B]">—</p>
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
