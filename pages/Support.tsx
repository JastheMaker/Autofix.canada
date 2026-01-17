
import React, { useState } from 'react';
import { Search, HelpCircle, Book, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '../App';

export const Support: React.FC = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Comment puis-je être sûr de la qualité du mécanicien ?",
      a: "Chaque mécanicien sur AutoFix passe par un processus de vérification. Les mécaniciens 'PRO' fournissent leur licence CPA et preuve d'assurance. Les 'Amateurs' sont évalués après chaque intervention par les clients. Nous surveillons étroitement les notes inférieures à 4 étoiles."
    },
    {
      q: "Que se passe-t-il en cas de litige ?",
      a: "AutoFix dispose d'un service de médiation. Si une réparation ne vous satisfait pas, vous pouvez signaler un incident depuis votre tableau de bord. Le paiement est bloqué jusqu'à résolution du problème."
    },
    {
      q: "Le mécanicien peut-il réparer ma voiture chez moi ?",
      a: "Oui ! De nombreux mécaniciens sur AutoFix sont des 'mécaniciens mobiles'. Ils disposent d'un outillage complet pour intervenir dans votre entrée ou sur votre lieu de travail, tant que l'espace le permet."
    },
    {
      q: "Comment devenir mécanicien sur la plateforme ?",
      a: "Il suffit de cliquer sur 'Devenir mécanicien' et de remplir votre profil. Vous devrez signer électroniquement un contrat de partenariat et fournir vos pièces justificatives."
    }
  ];

  const categories = [
    { icon: <Book />, name: "Premiers pas", count: 12 },
    { icon: <HelpCircle />, name: "Paiements", count: 8 },
    { icon: <MessageSquare />, name: "Réservations", count: 15 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-blue-600 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-6">Comment pouvons-nous vous aider ?</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une réponse..." 
              className="w-full h-14 pl-12 pr-6 rounded-2xl text-slate-900 shadow-xl border-none outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {categories.map((cat, idx) => (
            <button key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-400">{cat.count} articles</p>
              </div>
            </button>
          ))}
        </div>

        <div id="faq" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
