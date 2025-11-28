import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const [accountType, setAccountType] = useState<"PATIENT" | "DOCTOR">(
    "PATIENT",
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    maladieChronique: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || firstName;

      await register({
        email: formData.email,
        firstName,
        lastName,
        role: accountType,
        phone: formData.phone,
        maladieChronique: formData.maladieChronique || undefined,
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Brand */}
      <div className="lg:w-[500px] bg-[#2563EB] flex items-center justify-center flex-col px-6 lg:px-12 py-8 lg:py-0">
        <div className="text-center">
          <h1 className="text-white text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
            HealthTrack
          </h1>
          <p className="text-[#93C5FD] text-sm lg:text-lg">
            Système de Suivi Médical Intelligent
          </p>

          {/* Medical Icon */}
          <div className="mt-8 lg:mt-16 flex justify-center">
            <div className="relative">
              <svg
                width="80"
                height="80"
                viewBox="0 0 124 124"
                fill="none"
                className="lg:w-[124px] lg:h-[124px]"
              >
                <circle cx="62" cy="62" r="60" stroke="white" strokeWidth="4" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-10 lg:w-[30px] lg:h-[60px] bg-white"></div>
                <div className="w-10 h-5 lg:w-[60px] lg:h-[30px] bg-white absolute top-2.5 left-[-10px] lg:top-[15px] lg:left-[-15px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F0F4F8] px-4 sm:px-6 py-8 lg:py-12">
        <div className="w-full max-w-[493px] bg-white rounded-lg border-2 border-[#E5E7EB] px-6 sm:px-10 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-[#1F2937] text-2xl sm:text-[32px] font-bold mb-2 sm:mb-3">
              Inscription
            </h2>
            <p className="text-[#6B7280] text-sm">
              Créez votre compte HealthTrack
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Toggle */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Type de compte
              </label>
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => setAccountType("PATIENT")}
                  className={`flex-1 h-[46px] rounded-md font-bold text-sm transition-all ${
                    accountType === "PATIENT"
                      ? "bg-[#F0F9FF] border-2 border-[#2563EB] text-[#2563EB]"
                      : "bg-[#F9FAFB] border border-[#D1D5DB] text-[#6B7280]"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("DOCTOR")}
                  className={`flex-1 h-[46px] rounded-md font-bold text-sm transition-all ${
                    accountType === "DOCTOR"
                      ? "bg-[#F0F9FF] border-2 border-[#2563EB] text-[#2563EB]"
                      : "bg-[#F9FAFB] border border-[#D1D5DB] text-[#6B7280]"
                  }`}
                >
                  Docteur
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Prénom Nom"
                className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="exemple@email.com"
                className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+212 6XX XXX XXX"
                className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              />
            </div>

            {/* Chronic Disease (for patients) */}
            {accountType === "PATIENT" && (
              <div>
                <label className="block text-[#374151] text-sm font-bold mb-2">
                  Maladie chronique (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.maladieChronique}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maladieChronique: e.target.value,
                    })
                  }
                  placeholder="Ex: Diabète, Hypertension"
                  className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  <Eye className="w-[19px] h-[19px]" />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Confirmer mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  <Eye className="w-[19px] h-[19px]" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[45px] bg-[#2563EB] text-white font-bold text-base rounded-md hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm">
              <span className="text-[#6B7280]">Vous avez déjà un compte? </span>
              <Link
                to="/login"
                className="text-[#2563EB] font-bold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
