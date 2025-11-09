import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] px-6">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 124 124" fill="none">
              <circle cx="62" cy="62" r="60" stroke="#2563EB" strokeWidth="4" />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-[28px] h-[56px] bg-[#2563EB]"></div>
              <div className="w-[56px] h-[28px] bg-[#2563EB] absolute top-[14px] left-[-14px]"></div>
            </div>
          </div>
        </div>

        <h1 className="text-[#1F2937] text-4xl font-bold mb-4">
          Page non trouvée
        </h1>
        <p className="text-[#6B7280] text-lg mb-8 max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 bg-[#2563EB] text-white font-bold rounded-md hover:bg-[#1d4ed8] transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
