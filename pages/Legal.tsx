
import React from 'react';
import { Shield, Lock, FileText, Info } from 'lucide-react';

interface LegalProps {
  type: 'tos' | 'privacy' | 'cookies';
}

export const Legal: React.FC<LegalProps> = ({ type }) => {
  const content = {
    tos: {
      title: "Conditions Générales d'Utilisation",
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      text: `Dernière mise à jour : Janvier 2024.

      1. ACCEPTATION DES CONDITIONS
      En accédant au site AutoFix Booking, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.

      2. DESCRIPTION DU SERVICE
      AutoFix est une plateforme de mise en relation entre propriétaires de véhicules et mécaniciens (professionnels et amateurs). AutoFix n'est pas un atelier de réparation automobile.

      3. RESPONSABILITÉ DES UTILISATEURS
      Les utilisateurs s'engagent à fournir des informations véridiques. Les mécaniciens sont responsables de la qualité de leur travail et de leur couverture d'assurance.

      4. PAIEMENTS ET COMMISSIONS
      Les transactions sont facilitées par la plateforme. AutoFix prélève une commission de service sur chaque réservation confirmée.`
    },
    privacy: {
      title: "Politique de Confidentialité",
      icon: <Lock className="w-12 h-12 text-purple-600" />,
      text: `Nous accordons une importance capitale à la protection de vos données.

      1. COLLECTE DES DONNÉES
      Nous collectons votre nom, email, numéro de téléphone et données de géolocalisation pour assurer le service de mise en relation.

      2. UTILISATION DES DONNÉES
      Vos données servent uniquement au fonctionnement de la plateforme. Nous ne vendons jamais vos données personnelles à des tiers.

      3. SÉCURITÉ
      Toutes les communications sur AutoFix sont cryptées via le protocole SSL/TLS. Les documents de vérification des mécaniciens sont stockés sur des serveurs sécurisés isolés.`
    },
    cookies: {
      title: "Gestion des Cookies",
      icon: <Shield className="w-12 h-12 text-green-600" />,
      text: `AutoFix utilise des cookies pour améliorer votre expérience utilisateur.

      1. COOKIES ESSENTIELS
      Ces cookies sont nécessaires au fonctionnement du site (session de connexion, préférences linguistiques).

      2. COOKIES ANALYTIQUES
      Nous utilisons ces outils pour comprendre comment les utilisateurs interagissent avec le site et améliorer nos fonctionnalités.

      3. VOTRE CHOIX
      Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.`
    }
  };

  const active = content[type];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="p-5 bg-slate-50 rounded-3xl mb-6">
              {active.icon}
            </div>
            <h1 className="text-4xl font-black text-slate-900">{active.title}</h1>
          </div>

          <div className="prose prose-slate max-w-none">
            {active.text.split('\n').map((line, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
                {line.trim()}
              </p>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-3xl flex gap-4 items-start border border-blue-100">
            <Info className="text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800 italic">
              Pour toute question relative à ce document, veuillez contacter notre service juridique à l'adresse legal@autofix.ca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
