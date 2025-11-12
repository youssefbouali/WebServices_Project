import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getProfileById, updateProfileById } from "@/lib/api/profiles";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Féminin",
    birthDate: "",
    specialty: "Cardiologie",
    registrationNumber: "",
    experience: "",
    address: "",
    bio: "",
  });

  const profileId = searchParams.get("id") || "";

  useEffect(() => {
    if (!profileId) {
      toast({ description: "ID du profil manquant" });
      navigate("/profiles");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const p = await getProfileById(profileId);
        setFormData((prev) => ({
          ...prev,
          fullName: `${p.firstName} ${p.lastName}`.trim(),
          email: p.email || "",
          phone: p.phone || "",
          bio: p.maladieChronique || "",
        }));
      } catch (err) {
        toast({ description: (err as any)?.message || "Échec de chargement du profil" });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const handleSave = async () => {
    if (!profileId) return;
    try {
      setSaving(true);
      const name = formData.fullName.trim();
      let firstName = name;
      let lastName = "";
      if (name.includes(" ")) {
        const parts = name.split(" ");
        firstName = parts.shift() || "";
        lastName = parts.join(" ");
      }
      await updateProfileById(profileId, {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        maladieChronique: formData.bio || undefined,
      });
      toast({ description: "Profil mis à jour" });
      navigate("/profiles");
    } catch (err) {
      toast({ description: (err as any)?.message || "Échec de la mise à jour" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10">
          <h1 className="text-xl lg:text-2xl font-bold text-[#1E293B]">
            Édition du Profil
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

        {/* Navigation */}
        <div className="px-4 lg:px-10 pt-4 lg:pt-6 flex items-center justify-between">
          <Button
            onClick={() => navigate("/profiles/detail")}
            variant="outline"
            className="h-9 px-4 border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>

          <Button
            variant="ghost"
            className="text-[#64748B] text-[13px] hover:bg-[#F8FAFC] hidden lg:flex items-center gap-2"
          >
            Gestion des Rôles et Permissions
            <ChevronRight className="w-3 h-3 rotate-90" />
          </Button>
        </div>

        {/* Main Content */}
        <main className="px-4 lg:px-10 py-4 lg:py-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3 lg:gap-4">
                <div className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl lg:text-[32px] font-bold">
                    {(formData.fullName || "").split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase() || "--"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="h-8 border-none bg-[#E0E7FF] text-[#2563EB] text-xs hover:bg-[#DBEAFE]"
                >
                  Changer la photo
                </Button>
              </div>

              {/* Form Section */}
              <div className="flex-1 space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-2">
                    Nom complet *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="h-12 border-[#E2E8F0] text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 border-[#E2E8F0] text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Phone & Gender */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Téléphone
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-12 border-[#E2E8F0] text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Sexe
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger className="h-12 border-[#E2E8F0] text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Féminin">Féminin</SelectItem>
                        <SelectItem value="Masculin">Masculin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Birth Date & Specialty */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Date de naissance
                    </label>
                    <Input
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                      className="h-12 border-[#E2E8F0] text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Spécialité
                    </label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, specialty: value })
                      }
                    >
                      <SelectTrigger className="h-12 border-[#E2E8F0] text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                        <SelectItem value="Neurologie">Neurologie</SelectItem>
                        <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                        <SelectItem value="Radiologie">Radiologie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Registration Number & Experience */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Numéro d'inscription
                    </label>
                    <Input
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationNumber: e.target.value,
                        })
                      }
                      className="h-12 border-[#E2E8F0] text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#475569] mb-2">
                      Années d'expérience
                    </label>
                    <Input
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="h-12 border-[#E2E8F0] text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-2">
                    Adresse
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="h-12 border-[#E2E8F0] text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[13px] font-bold text-[#475569] mb-2">
                    Notes / Biographie
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="min-h-[80px] border-[#E2E8F0] text-sm text-[#64748B]"
                    disabled={loading}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse lg:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => navigate("/profiles")}
                    variant="outline"
                    className="h-10 lg:h-11 border-[#E2E8F0] text-[#64748B] text-sm hover:bg-[#F8FAFC] lg:w-[120px]"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#2563EB] text-white hover:bg-[#1E40AF] h-10 lg:h-11 text-sm lg:w-[140px]"
                    disabled={saving || loading}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
