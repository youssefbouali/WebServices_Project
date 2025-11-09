import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";

export default function ProfileDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("informations");

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-xl lg:text-2xl font-bold text-[#1E293B]">
            Détail du Profil
          </h1>
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="text-xs lg:text-sm text-[#64748B]">Admin</span>
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#2563EB] flex items-center justify-center">
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 lg:w-[19px] lg:h-5"
              >
                <path
                  d="M9.28571 9.375C8.5822 9.375 7.88558 9.25375 7.23562 9.01818C6.58567 8.78262 5.9951 8.43734 5.49764 8.00206C5.00019 7.56679 4.60558 7.05004 4.33636 6.48133C4.06714 5.91261 3.92857 5.30307 3.92857 4.6875C3.92857 4.07193 4.06714 3.46239 4.33636 2.89367C4.60558 2.32496 5.00019 1.80821 5.49764 1.37294C5.9951 0.937662 6.58567 0.592384 7.23562 0.356815C7.88558 0.121246 8.5822 -9.17273e-09 9.28571 0C9.98922 -9.17273e-09 10.6858 0.121246 11.3358 0.356815C11.9858 0.592384 12.5763 0.937662 13.0738 1.37294C13.5712 1.80821 13.9658 2.32496 14.2351 2.89367C14.5043 3.46239 14.6429 4.07193 14.6429 4.6875C14.6429 5.30307 14.5043 5.91261 14.2351 6.48133C13.9658 7.05004 13.5712 7.56679 13.0738 8.00206C12.5763 8.43734 11.9858 8.78262 11.3358 9.01818C10.6858 9.25375 9.98922 9.375 9.28571 9.375ZM7.92411 11.5625H10.6473C11.0804 11.5625 11.4286 11.8672 11.4286 12.2461C11.4286 12.4102 11.3616 12.5664 11.2411 12.6914L10.0179 13.9414L11.4018 18.4375H11.4286L12.9732 13.0273C13.0714 12.6875 13.4688 12.4805 13.8438 12.6055C16.6071 13.5273 18.5714 15.8711 18.5714 18.6133C18.5714 19.2031 18.0223 19.6836 17.3482 19.6836L1.22321 19.6875C0.549107 19.6875 0 19.207 0 18.6172C0 15.875 1.96429 13.5312 4.72768 12.6094C5.10268 12.4844 5.5 12.6914 5.59821 13.0312L7.14286 18.4414H7.16964L8.55357 13.9453L7.33036 12.6953C7.20982 12.5703 7.14286 12.4141 7.14286 12.25C7.14286 11.8711 7.49107 11.5664 7.92411 11.5664V11.5625Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Back Button */}
        <div className="px-4 lg:px-10 pt-4 lg:pt-6">
          <Button
            onClick={() => navigate("/profiles")}
            variant="outline"
            className="h-9 px-4 border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
        </div>

        {/* Main Content */}
        <main className="px-4 lg:px-10 py-4 lg:py-6">
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
                      SA
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B] mb-2">
                      Dr. Sara Ahmed
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB] text-xs font-bold">
                        Docteur
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                        <span className="text-[#10B981] text-xs font-bold">
                          Actif
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#64748B] mb-1">
                      Email: sara.ahmed@health.ma
                    </p>
                    <p className="text-sm text-[#64748B]">
                      Téléphone: +212 6XX XXX XXX
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                  <Button
                    onClick={() => navigate("/profiles/edit")}
                    className="bg-[#2563EB] text-white hover:bg-[#1E40AF] h-10 text-sm font-bold w-full lg:w-[180px]"
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 border-[#E2E8F0] text-[#64748B] text-sm font-bold hover:bg-[#F8FAFC] w-full lg:w-[180px]"
                  >
                    Désactiver
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-[#E2E8F0]">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none gap-8 px-4 lg:px-8">
                  <TabsTrigger
                    value="informations"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none bg-transparent px-0 pb-3 data-[state=active]:text-[#2563EB] text-[#64748B] font-bold text-sm data-[state=active]:shadow-none"
                  >
                    Informations
                  </TabsTrigger>
                  <TabsTrigger
                    value="historique"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none bg-transparent px-0 pb-3 data-[state=active]:text-[#2563EB] text-[#64748B] font-normal text-sm data-[state=active]:shadow-none"
                  >
                    Historique
                  </TabsTrigger>
                  <TabsTrigger
                    value="statistiques"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none bg-transparent px-0 pb-3 data-[state=active]:text-[#2563EB] text-[#64748B] font-normal text-sm data-[state=active]:shadow-none"
                  >
                    Statistiques
                  </TabsTrigger>
                  <TabsTrigger
                    value="permissions"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none bg-transparent px-0 pb-3 data-[state=active]:text-[#2563EB] text-[#64748B] font-normal text-sm data-[state=active]:shadow-none"
                  >
                    Permissions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="informations" className="p-4 lg:p-8 mt-0">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-[#1E293B] mb-4">
                    Informations Personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Nom complet
                      </label>
                      <p className="text-sm text-[#1E293B]">Dr. Sara Ahmed</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Date de naissance
                      </label>
                      <p className="text-sm text-[#1E293B]">15/03/1985</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Sexe
                      </label>
                      <p className="text-sm text-[#1E293B]">Féminin</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-[#1E293B] mb-4">
                    Informations Professionnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Spécialité
                      </label>
                      <p className="text-sm text-[#1E293B]">Cardiologie</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Numéro d'inscription
                      </label>
                      <p className="text-sm text-[#1E293B]">INPE-12345</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Années d'expérience
                      </label>
                      <p className="text-sm text-[#1E293B]">12 ans</p>
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
                        Date de création
                      </label>
                      <p className="text-sm text-[#1E293B]">12/01/2024</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Dernière connexion
                      </label>
                      <p className="text-sm text-[#1E293B]">22/10/2025 14:32</p>
                    </div>
                    <div>
                      <label className="block text-[13px] text-[#94A3B8] mb-1">
                        Patients associés
                      </label>
                      <p className="text-sm text-[#2563EB] font-bold">
                        24 patients
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historique" className="p-4 lg:p-8 mt-0">
                <p className="text-[#64748B]">
                  Historique des activités à venir...
                </p>
              </TabsContent>

              <TabsContent value="statistiques" className="p-4 lg:p-8 mt-0">
                <p className="text-[#64748B]">
                  Statistiques du profil à venir...
                </p>
              </TabsContent>

              <TabsContent value="permissions" className="p-4 lg:p-8 mt-0">
                <p className="text-[#64748B]">
                  Gestion des permissions à venir...
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
