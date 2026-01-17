
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Dashboard } from './pages/Dashboard';
import { Login, Register } from './pages/Auth';
import { HowItWorks } from './pages/HowItWorks';
import { Support } from './pages/Support';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { User, Language, UserRole } from './types';
import { authApi, syncUserData } from './services/api';
import { supabase } from './services/supabaseClient';

export const translations = {
  fr: {
    heroTitle: "Votre mécanicien, quand et où vous voulez.",
    heroSub: "Réservez un mécanicien professionnel ou amateur. Service à domicile, garage ou dépannage d'urgence.",
    sosBtn: "CAR SOS - Urgence Route",
    findMech: "Trouver un mécanicien",
    myDash: "Mon Tableau de bord",
    logout: "Déconnexion",
    login: "Connexion",
    register: "S'inscrire",
    search: "Rechercher",
    allServices: "Tous les services",
    footerText: "La plateforme de référence pour l'entretien automobile. Qualité, sécurité et transparence garanties.",
    quickLinks: "Plateforme",
    legal: "Légal",
    becomePartner: "Devenir mécanicien",
    howItWorks: "Comment ça marche",
    tos: "Conditions d'utilisation",
    privacy: "Confidentialité",
    resultsFound: "mécanicien(s) disponible(s)",
    resetFilters: "Réinitialiser",
    city: "Ville",
    service: "Service",
    mechType: "Type de mécanicien",
    pro: "Professionnel",
    amateur: "Amateur",
    bookNow: "Réserver",
    urgentHelp: "Urgence sur la route ?",
    urgentDesc: "Panne moteur, pneu crevé ou batterie à plat ? Nos dépanneurs SOS interviennent en moins de 45 minutes.",
    regStep1: "Identité",
    regStep2: "Vérification",
    regStep3: "Contrat & Signature",
    regStep4: "Confirmation",
    iAmClient: "Propriétaire de véhicule",
    iAmMech: "Auto Professional",
    nameLabel: "Nom complet",
    emailLabel: "Adresse Email professionnelle",
    roleLabel: "Choisissez votre profil",
    licenseLabel: "Numéro de certification / Licence CPA",
    uploadDoc: "Télécharger un justificatif (PDF, JPG)",
    docHint: "Diplôme, Assurance RC Pro ou Pièce d'identité",
    contractTitle: "Contrat de Partenariat & Conditions",
    agreeTerms: "Je certifie l'exactitude des données et accepte le contrat",
    signatureLabel: "Signature électronique (Tapez votre nom)",
    finishReg: "Activer mon compte",
    clientContract: "CLAUSE 1. OBJET : Le présent contrat définit les conditions de mise en relation entre le Client et les Prestataires. CLAUSE 2. SÉCURITÉ : Le client s'engage à fournir un environnement de travail sécurisé. CLAUSE 3. PAIEMENT : Les tarifs sont fixés à l'avance et ne peuvent être modifiés sans accord préalable.",
    mechContract: "CLAUSE 1. ENGAGEMENT : Le prestataire s'engage à une obligation de moyens et de résultat. CLAUSE 2. COMMISSION : AutoFix prélève 15% de frais de service. CLAUSE 3. DÉONTOLOGIE : Le prestataire doit respecter la charte de qualité AutoFix sous peine de radiation."
  },
  en: {
    heroTitle: "Your mechanic, anytime, anywhere.",
    heroSub: "Book a professional or amateur mechanic. Mobile service, garage, or emergency roadside assistance.",
    sosBtn: "CAR SOS - Emergency",
    findMech: "Find a mechanic",
    myDash: "Dashboard",
    logout: "Logout",
    login: "Login",
    register: "Register",
    search: "Search",
    allServices: "All Services",
    footerText: "The leading platform for car maintenance. Quality, safety, and transparency guaranteed.",
    quickLinks: "Platform",
    legal: "Legal",
    becomePartner: "Become a mechanic",
    howItWorks: "How it works",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    resultsFound: "mechanic(s) found",
    resetFilters: "Reset",
    city: "City",
    service: "Service",
    mechType: "Mechanic Type",
    pro: "Professional",
    amateur: "Amateur",
    bookNow: "Book Now",
    urgentHelp: "Roadside Emergency?",
    urgentDesc: "Engine failure, flat tire, or dead battery? Our SOS mechanics arrive in less than 45 minutes.",
    regStep1: "Identity",
    regStep2: "Verification",
    regStep3: "Contract & Signature",
    regStep4: "Confirmation",
    iAmClient: "Vehicle Owner",
    iAmMech: "Auto Professional",
    nameLabel: "Full Name",
    emailLabel: "Professional Email",
    roleLabel: "Choose your profile",
    licenseLabel: "Certification / License Number",
    uploadDoc: "Upload documentation (PDF, JPG)",
    docHint: "Diploma, Insurance or ID Card",
    contractTitle: "Partnership Agreement",
    agreeTerms: "I certify data accuracy and accept the contract",
    signatureLabel: "Electronic Signature (Type your name)",
    finishReg: "Activate my account",
    clientContract: "CLAUSE 1. OBJECT: This contract defines the terms of connection between the Client and Providers. CLAUSE 2. SAFETY: The client agrees to provide a safe working environment. CLAUSE 3. PAYMENT: Rates are fixed in advance and cannot be changed without prior agreement.",
    mechContract: "CLAUSE 1. COMMITMENT: The provider commits to a high standard of quality. CLAUSE 2. COMMISSION: AutoFix takes a 15% service fee. CLAUSE 3. ETHICS: The provider must follow the AutoFix quality charter or face removal."
  }
};

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.fr) => string;
}
const LanguageContext = createContext<LanguageContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation error");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('fr');

  const t = (key: keyof typeof translations.fr) => (translations[lang] as any)[key] || key;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
  };

  useEffect(() => {
    // Initialiser et écouter les changements de session
    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // En cas de retour de login social, on synchronise systématiquement
        const userData = await syncUserData(
          session.user.id, 
          session.user.email!, 
          session.user.user_metadata
        );
        setUser(userData);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Synchro automatique si l'utilisateur est authentifié
        const userData = await syncUserData(
          session.user.id, 
          session.user.email!, 
          session.user.user_metadata
        );
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    const savedLang = localStorage.getItem('autofix_lang') as Language;
    if (savedLang) setLang(savedLang);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tos" element={<Legal type="tos" />} />
              <Route path="/privacy" element={<Legal type="privacy" />} />
              <Route path="/cookies" element={<Legal type="cookies" />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
