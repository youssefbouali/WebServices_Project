import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
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
              {/* Plus sign */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-10 lg:w-[30px] lg:h-[60px] bg-white"></div>
                <div className="w-10 h-5 lg:w-[60px] lg:h-[30px] bg-white absolute top-2.5 left-[-10px] lg:top-[15px] lg:left-[-15px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F0F4F8] px-4 sm:px-6 py-8 lg:py-12">
        <div className="w-full max-w-[500px] bg-white rounded-lg border-2 border-[#E5E7EB] px-6 sm:px-10 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-[#1F2937] text-2xl sm:text-[32px] font-bold mb-2 sm:mb-3">
              Connexion
            </h2>
            <p className="text-[#6B7280] text-sm">
              Accédez à votre compte HealthTrack
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full h-[46px] px-5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#374151] text-sm font-bold mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-[18px] h-[18px] border-2 border-[#D1D5DB] rounded-full peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB]"></div>
                </div>
                <span className="text-[#6B7280] text-[13px]">
                  Se souvenir de moi
                </span>
              </label>
              <a
                href="#"
                className="text-[#2563EB] text-[13px] hover:underline"
              >
                Mot de passe oublié?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[45px] bg-[#2563EB] text-white font-bold text-base rounded-md hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm">
              <span className="text-[#6B7280]">Pas encore de compte? </span>
              <Link
                to="/register"
                className="text-[#2563EB] font-bold hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
