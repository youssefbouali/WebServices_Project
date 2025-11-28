import { Link } from "react-router-dom";
import {
  Heart,
  Activity,
  Calendar,
  Shield,
  BarChart3,
  Bell,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1F2937]">
                HealthTrack
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-[#2563EB] font-bold hover:bg-[#F0F4F8] rounded-md transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-[#2563EB] text-white font-bold rounded-md hover:bg-[#1d4ed8] transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Système de Suivi Médical Intelligent
              </h1>
              <p className="text-lg text-[#93C5FD] mb-8">
                HealthTrack simplifie la gestion de la santé pour les patients,
                les médecins et les administrateurs. Suivi médical en temps
                réel, gestion des rendez-vous et alertes intelligentes.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-[#2563EB] font-bold rounded-md hover:bg-[#F0F4F8] transition-colors"
                >
                  Commencer
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-[#1d4ed8] transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 124 124"
                  fill="none"
                  className="w-full max-w-md"
                >
                  <circle
                    cx="62"
                    cy="62"
                    r="60"
                    stroke="white"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-16 bg-white rounded-full"></div>
                  <div className="w-16 h-8 bg-white rounded-full absolute top-4 left-[-16px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
              Nos Services
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              HealthTrack offre une suite complète de services pour gérer votre
              santé et celle de vos patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Suivi Médical en Temps Réel
              </h3>
              <p className="text-[#6B7280]">
                Surveillance continue de vos données de santé avec alertes en
                temps réel. Accédez à vos métriques de santé instantanément.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Gestion des Rendez-vous
              </h3>
              <p className="text-[#6B7280]">
                Planifiez et gérez facilement les rendez-vous médicaux.
                Confirmations automatiques et rappels pour ne pas oublier.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Alertes Intelligentes
              </h3>
              <p className="text-[#6B7280]">
                Recevez des notifications intelligentes basées sur votre profil
                de santé. Alertes personnalisées pour chaque besoin.
              </p>
            </div>

            {/* Service 4 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Suivi des Traitements
              </h3>
              <p className="text-[#6B7280]">
                Suivi complet des traitements et des médicaments. Historique
                détaillé et rapports pour chaque traitement.
              </p>
            </div>

            {/* Service 5 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Gestion des Appareils
              </h3>
              <p className="text-[#6B7280]">
                Connectez et gérez vos appareils médicaux. Synchronisation
                automatique des données pour un suivi continu.
              </p>
            </div>

            {/* Service 6 */}
            <div className="p-8 border border-[#E5E7EB] rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Gestion des Profils
              </h3>
              <p className="text-[#6B7280]">
                Gestion complète des profils médicaux. Historique médical
                complet et accessibilité à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#F0F4F8] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-12 text-center">
            Caractéristiques Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-6">
                Pour les Patients
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Suivi personnalisé de votre santé
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Gestion simple des rendez-vous
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Alertes et rappels intelligents
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Communication directe avec vos médecins
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-6">
                Pour les Médecins
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Gestion efficace des patients
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Suivi des traitements en temps réel
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Rendez-vous et calendrier optimisés
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Accès aux données médicales complètes
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#1F2937] mb-6">
              Pour les Administrateurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Gestion des rôles et permissions
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Supervision complète du système
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Rapports et statistiques détaillés
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span className="text-[#6B7280]">
                    Gestion de la sécurité des données
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2563EB] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Prêt à transformer votre suivi médical?
          </h2>
          <p className="text-lg text-[#93C5FD] mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à
            HealthTrack pour gérer leur santé
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-[#2563EB] font-bold rounded-md hover:bg-[#F0F4F8] transition-colors"
            >
              S'inscrire Gratuitement
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-[#1d4ed8] transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-[#D1D5DB] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  HealthTrack
                </span>
              </div>
              <p className="text-sm">
                Système de suivi médical intelligent pour une meilleure santé
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Suivi Médical
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rendez-vous
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Alertes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#374151] pt-8 text-center text-sm">
            <p>&copy; 2024 HealthTrack. Tous les droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
