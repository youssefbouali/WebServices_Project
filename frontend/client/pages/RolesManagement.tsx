import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { User } from "lucide-react";

type Permission = {
  id: string;
  label: string;
  checked: boolean;
};

type PermissionGroup = {
  title: string;
  permissions: Permission[];
};

export default function RolesManagement() {
  const [selectedRole, setSelectedRole] = useState<string>("docteur");

  const [permissions, setPermissions] = useState<
    Record<string, PermissionGroup>
  >({
    profils: {
      title: "Profils",
      permissions: [
        {
          id: "view-profiles",
          label: "Consulter les profils patients",
          checked: true,
        },
        {
          id: "edit-profiles",
          label: "Modifier les profils patients",
          checked: true,
        },
      ],
    },
    appareils: {
      title: "Appareils",
      permissions: [
        {
          id: "view-devices",
          label: "Voir les données des capteurs",
          checked: true,
        },
        { id: "manage-devices", label: "Gérer les appareils", checked: false },
      ],
    },
    planification: {
      title: "Planification",
      permissions: [
        {
          id: "create-appointments",
          label: "Créer des rendez-vous",
          checked: true,
        },
        {
          id: "cancel-appointments",
          label: "Annuler des rendez-vous",
          checked: true,
        },
      ],
    },
    traitements: {
      title: "Traitements",
      permissions: [
        {
          id: "prescribe-treatments",
          label: "Prescrire des traitements",
          checked: true,
        },
        {
          id: "view-history",
          label: "Consulter l'historique médical",
          checked: true,
        },
      ],
    },
  });

  const handlePermissionToggle = (groupKey: string, permissionId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        permissions: prev[groupKey].permissions.map((p) =>
          p.id === permissionId ? { ...p, checked: !p.checked } : p,
        ),
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      <div className="flex-1 lg:ml-[250px]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10">
          <h1 className="text-[#1E293B] text-xl lg:text-2xl font-bold">
            Gestion des Rôles et Permissions
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[#64748B] text-sm hidden sm:block">
              Admin
            </span>
            <div className="w-11 h-11 rounded-full bg-[#2563EB] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 lg:p-10">
          {/* User Profile Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-[70px] h-[70px] rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">SA</span>
              </div>
              <div className="flex-1">
                <h2 className="text-[#1E293B] text-lg font-bold mb-1">
                  Dr. Sara Ahmed
                </h2>
                <p className="text-[#64748B] text-sm">sara.ahmed@health.ma</p>
              </div>
              <div className="bg-[#DBEAFE] text-[#2563EB] px-6 py-2 rounded-full text-xs font-normal">
                Docteur
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Available Roles */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="text-[#1E293B] text-base font-bold mb-2">
                Rôles Disponibles
              </h3>
              <p className="text-[#64748B] text-xs mb-6">
                Sélectionnez les rôles à attribuer
              </p>

              <div className="space-y-4">
                {/* Docteur Role */}
                <label className="flex items-start gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-colors">
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedRole === "docteur"}
                      onChange={() => setSelectedRole("docteur")}
                      className="w-5 h-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#1E293B] text-[15px] font-bold mb-1">
                      Docteur
                    </div>
                    <div className="text-[#64748B] text-xs">
                      Accès aux patients et dossiers médicaux
                    </div>
                  </div>
                </label>

                {/* Patient Role */}
                <label className="flex items-start gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-colors">
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedRole === "patient"}
                      onChange={() => setSelectedRole("patient")}
                      className="w-5 h-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#1E293B] text-[15px] font-bold mb-1">
                      Patient
                    </div>
                    <div className="text-[#64748B] text-xs">
                      Accès limité aux données personnelles
                    </div>
                  </div>
                </label>

                {/* Administrateur Role */}
                <label className="flex items-start gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9] transition-colors">
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedRole === "admin"}
                      onChange={() => setSelectedRole("admin")}
                      className="w-5 h-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#1E293B] text-[15px] font-bold mb-1">
                      Administrateur
                    </div>
                    <div className="text-[#64748B] text-xs">
                      Accès complet à la plateforme
                    </div>
                  </div>
                </label>
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-[#FEF3C7] border-[1.5px] border-[#FBBF24] rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex-shrink-0 mt-0.5"></div>
                  <div>
                    <div className="text-[#92400E] text-[11px] font-bold mb-1">
                      INFO
                    </div>
                    <div className="text-[#92400E] text-[11px] leading-relaxed">
                      Un utilisateur peut avoir plusieurs rôles.
                    </div>
                    <div className="text-[#92400E] text-[11px] leading-relaxed">
                      Les permissions sont cumulatives.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Permissions */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="text-[#1E293B] text-base font-bold mb-2">
                Permissions - Docteur
              </h3>
              <p className="text-[#64748B] text-xs mb-6">
                Gérez les permissions détaillées
              </p>

              <div className="space-y-6">
                {Object.entries(permissions).map(([key, group]) => (
                  <div key={key}>
                    <h4 className="text-[#475569] text-[13px] font-bold mb-3">
                      {group.title}
                    </h4>
                    <div className="space-y-2">
                      {group.permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-md cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={permission.checked}
                              onChange={() =>
                                handlePermissionToggle(key, permission.id)
                              }
                              className="sr-only peer"
                            />
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                permission.checked
                                  ? "bg-[#10B981] border-[#10B981]"
                                  : permission.id === "manage-devices"
                                    ? "bg-[#EF4444] border-[#EF4444]"
                                    : "bg-white border-[#CBD5E1]"
                              }`}
                            >
                              {permission.checked && (
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  viewBox="0 0 10 11"
                                  fill="none"
                                >
                                  <path
                                    d="M0.707031 5.53003L3.70703 8.53003L8.70703 0.530029"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-[#1E293B] text-xs">
                            {permission.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="px-8 h-10 bg-white border border-[#E2E8F0] text-[#64748B] rounded-md text-sm hover:bg-[#F8FAFC] transition-colors">
              Annuler
            </button>
            <button className="px-10 h-10 bg-[#2563EB] text-white rounded-md text-sm font-normal hover:bg-[#1d4ed8] transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
