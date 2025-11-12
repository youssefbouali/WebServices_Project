import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, MoreVertical, ChevronLeft, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Profile,
  listProfiles,
  registerProfile,
  deleteProfileById,
  getCurrentProfile,
} from "@/lib/api/profiles";

type RoleFilter = "ALL" | "PATIENT" | "DOCTOR" | "ADMIN";

function roleBadgeColor(role: Profile["role"]) {
  switch (role) {
    case "PATIENT":
      return "bg-[#DBEAFE] text-[#2563EB]";
    case "DOCTOR":
      return "bg-[#D1FAE5] text-[#059669]";
    case "ADMIN":
      return "bg-[#FEE2E2] text-[#DC2626]";
  }
}

export default function ProfilesDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [addOpen, setAddOpen] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "PATIENT" as Profile["role"],
    phone: "",
    maladieChronique: "",
    password: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Récupérer le profil courant (pour éviter suppression de soi-même)
        try {
          const me = await getCurrentProfile();
          setCurrentProfileId(me.id);
        } catch (_) {
          // ignorer silencieusement si non connecté ou non autorisé
        }
        const data = await listProfiles();
        setProfiles(data);
      } catch (err) {
        const message =
          (err as any)?.message || "Échec du chargement des profils";
        setError(message);
        toast({ description: message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesRole = roleFilter === "ALL" || p.role === roleFilter;
      const matchesSearch =
        !q ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [profiles, search, roleFilter]);

  async function handleDelete(id: string) {
    const target = profiles.find(p => p.id === id);
    // Empêcher la suppression de son propre compte pour éviter perte d'accès et liste vide
    if (currentProfileId && id === currentProfileId) {
      toast({ description: "Vous ne pouvez pas supprimer votre propre compte depuis ce tableau." });
      return;
    }
    // Sauvegarde de l'état avant suppression pour détection d'incohérences
    const before = profiles.slice();
    // Optimistic update: retirer l'élément localement
    setProfiles(prev => prev.filter(p => p.id !== id));
    try {
      await deleteProfileById(id);
      // Recharge depuis l'API pour garantir la cohérence avec le backend
      const fresh = await listProfiles();
      const expectedLen = before.length - 1;
      if (fresh.length < expectedLen) {
        // Incohérence détectée: plus d'éléments supprimés que prévu
        setProfiles(before.filter(p => p.id !== id));
        toast({ description: "Attention: incohérence côté serveur détectée. Seul le profil ciblé a été retiré dans l’interface." });
      } else {
        setProfiles(fresh);
        toast({ description: `Profil supprimé${target ? `: ${target.email}` : ""}` });
      }
    } catch (err) {
      // En cas d'erreur, recharger pour restaurer l'état réel
      const restored = await listProfiles().catch(() => null);
      if (restored) setProfiles(restored);
      toast({ description: (err as any)?.message || "Échec de suppression" });
    }
  }

  function requestDelete(profile: Profile) {
    setConfirmDelete({ open: true, profile });
  }

  function handleEdit(id: string) {
    navigate(`/profiles/edit?id=${encodeURIComponent(id)}`);
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { profile } = await registerProfile(addForm);
      setProfiles((prev) => [profile, ...prev]);
      setAddOpen(false);
      setAddForm({
        email: "",
        firstName: "",
        lastName: "",
        role: "PATIENT",
        phone: "",
        maladieChronique: "",
        password: "",
      });
      toast({ description: "Profil ajouté" });
    } catch (err) {
      toast({ description: (err as any)?.message || "Échec d’ajout" });
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Tableau de Bord - Profils
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 9.6875C9.2965 9.6875 8.59988 9.56625 7.94992 9.33068C7.29996 9.09512 6.70939 8.74984 6.21194 8.31456C5.71448 7.87929 5.31988 7.36254 5.05065 6.79383C4.78143 6.22511 4.64287 5.61557 4.64287 5C4.64287 4.38443 4.78143 3.77489 5.05065 3.20617C5.31988 2.63746 5.71448 2.12071 6.21194 1.68544C6.70939 1.25016 7.29996 0.904884 7.94992 0.669315C8.59988 0.433746 9.2965 0.3125 10 0.3125C10.7035 0.3125 11.4001 0.433746 12.0501 0.669315C12.7001 0.904884 13.2906 1.25016 13.7881 1.68544C14.2855 2.12071 14.6801 2.63746 14.9494 3.20617C15.2186 3.77489 15.3572 4.38443 15.3572 5C15.3572 5.61557 15.2186 6.22511 14.9494 6.79383C14.6801 7.36254 14.2855 7.87929 13.7881 8.31456C13.2906 8.74984 12.7001 9.09512 12.0501 9.33068C11.4001 9.56625 10.7035 9.6875 10 9.6875ZM8.6384 11.875H11.3616C11.7947 11.875 12.1429 12.1797 12.1429 12.5586C12.1429 12.7227 12.0759 12.8789 11.9554 13.0039L10.7322 14.2539L12.1161 18.75H12.1429L13.6875 13.3398C13.7857 13 14.183 12.793 14.558 12.918C17.3214 13.8398 19.2857 16.1836 19.2857 18.9258C19.2857 19.5156 18.7366 19.9961 18.0625 19.9961L1.93751 20C1.2634 20 0.714294 19.5195 0.714294 18.9297C0.714294 16.1875 2.67858 13.8438 5.44197 12.9219C5.81697 12.7969 6.21429 13.0039 6.31251 13.3438L7.85715 18.7539H7.88394L9.26787 14.2578L8.04465 13.0078C7.92412 12.8828 7.85715 12.7266 7.85715 12.5625C7.85715 12.1836 8.20537 11.8789 8.6384 11.8789V11.875Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Active Treatments */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Traitements Actifs
                  </p>
                  <p className="text-[36px] font-bold text-[#2563EB] leading-tight">
                    24
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Prises Aujourd'hui
                  </p>
                  <p className="text-[36px] font-bold text-[#10B981] leading-tight">
                    18/24
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="11" fill="#D1FAE5" />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Missed Reminders */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    Rappels Manqués
                  </p>
                  <p className="text-[36px] font-bold text-[#EF4444] leading-tight">
                    6
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#FEE2E2] flex items-center justify-center relative">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="10"
                      stroke="#EF4444"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="absolute text-[14px] font-bold text-[#EF4444]">
                    !
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6">
            <div className="p-5 flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-white" />
                <Input
                  placeholder="Rechercher un profil..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] h-10 text-[14px] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setRoleFilter("ALL")}
                  className={`h-10 text-[13px] px-6 ${
                    roleFilter === "ALL"
                      ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                      : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Tous
                </Button>
                <Button
                  onClick={() => setRoleFilter("DOCTOR")}
                  className={`h-10 text-[13px] px-6 ${
                    roleFilter === "DOCTOR"
                      ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                      : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Docteurs
                </Button>
                <Button
                  onClick={() => setRoleFilter("PATIENT")}
                  className={`h-10 text-[13px] px-6 ${
                    roleFilter === "PATIENT"
                      ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                      : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Patients
                </Button>
                <Button
                  onClick={() => setRoleFilter("ADMIN")}
                  className={`h-10 text-[13px] px-6 ${
                    roleFilter === "ADMIN"
                      ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                      : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Admins
                </Button>
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setAddOpen(true)}
                className="bg-[#10B981] text-white hover:bg-[#059669] h-10 text-[13px] px-5"
              >
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </div>
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Profil
                  </h3>
                </div>
                <div className="col-span-3">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Email
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Téléphone
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Rôle
                  </h3>
                </div>
                <div className="col-span-2">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase">
                    Actions
                  </h3>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#E2E8F0]">
              {loading && (
                <div className="px-6 py-4 text-sm text-[#64748B]">
                  Chargement des profils...
                </div>
              )}
              {error && (
                <div className="px-6 py-4 text-sm text-[#DC2626]">{error}</div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="px-6 py-4 text-sm text-[#64748B]">
                  Aucun profil trouvé
                </div>
              )}
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Profil */}
                    <div className="col-span-3 flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profiles/detail?id=${encodeURIComponent(p.id)}`)}>
                      <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[12px] font-bold">
                          {(p.firstName[0] + p.lastName[0]).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] text-[#1E293B] font-normal truncate">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] truncate">
                          ID: {p.id}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                      <p className="text-[13px] text-[#1E293B] truncate">
                        {p.email}
                      </p>
                    </div>

                    {/* Téléphone */}
                    <div className="col-span-2">
                      <p className="text-[13px] text-[#1E293B]">
                        {p.phone || "—"}
                      </p>
                    </div>

                    {/* Rôle */}
                    <div className="col-span-2">
                      <Badge
                        className={`${roleBadgeColor(
                          p.role,
                        )} rounded-full px-3 py-1 text-[11px] font-normal border-0`}
                      >
                        {p.role}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-between">
                      <Badge
                        className={`${p.isActive ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEE2E2] text-[#DC2626]"} rounded-full px-3 py-1 text-[11px] font-normal border-0`}
                      >
                        {p.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-[#64748B] hover:text-[#1E293B] transition-colors" title="Actions">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleEdit(p.id)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444]" onClick={() => requestDelete(p)}>
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-[35px] h-[35px] rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <button className="w-[35px] h-[35px] rounded-lg bg-[#2563EB] flex items-center justify-center">
                  <span className="text-[13px] text-white font-normal">1</span>
                </button>
                <button className="w-[35px] h-[35px] rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                  <span className="text-[13px] text-[#64748B] font-normal">
                    2
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
        {/* SweetAlert-style confirm dialog */}
        <Dialog open={confirmDelete.open} onOpenChange={(o) => setConfirmDelete({ open: o, profile: o ? confirmDelete.profile : null })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm text-[#1E293B]">Vous êtes sur le point de supprimer ce profil :</p>
              {confirmDelete.profile && (
                <div className="rounded-md border border-[#E2E8F0] p-3 bg-[#F8FAFC]">
                  <p className="text-[13px] text-[#1E293B] font-medium">{confirmDelete.profile.firstName} {confirmDelete.profile.lastName}</p>
                  <p className="text-[12px] text-[#64748B]">{confirmDelete.profile.email}</p>
                  <p className="text-[12px] text-[#64748B]">Rôle: {confirmDelete.profile.role}</p>
                </div>
              )}
              <p className="text-[12px] text-[#DC2626]">Cette action est définitive. Elle ne peut pas être annulée.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setConfirmDelete({ open: false, profile: null })}>
                Annuler
              </Button>
              <Button
                type="button"
                className="bg-[#EF4444] hover:bg-[#DC2626]"
                onClick={() => {
                  if (confirmDelete.profile) {
                    handleDelete(confirmDelete.profile.id);
                  }
                  setConfirmDelete({ open: false, profile: null });
                }}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AddProfileDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onSubmit={handleAddSubmit}
          form={addForm}
          setForm={setAddForm}
        />
      </div>
    </div>
  );
}

// Add Profile Dialog
function AddProfileDialog({ open, onOpenChange, onSubmit, form, setForm }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  form: {
    email: string;
    firstName: string;
    lastName: string;
    role: Profile["role"];
    phone: string;
    maladieChronique?: string;
    password: string;
  };
  setForm: (f: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Rôle</Label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Profile["role"] })
                }
                className="w-full h-10 border border-[#E2E8F0] rounded-md text-sm"
              >
                <option value="PATIENT">PATIENT</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <Label>Maladie chronique (optionnel)</Label>
              <Input
                value={form.maladieChronique}
                onChange={(e) =>
                  setForm({ ...form, maladieChronique: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#10B981] hover:bg-[#059669]">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
