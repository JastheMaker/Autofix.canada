
import React from 'react';
import { useTranslation } from '../App';
import { UserPlus, Sparkles, Calendar, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "1. Inscription & Profil",
      desc: "Créez votre compte en quelques secondes. Que vous soyez client ou mécanicien, nous vérifions votre identité pour garantir la sécurité de tous."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "2. Diagnostic IA",
      desc: "Décrivez votre problème à notre assistant intelligent. Il analyse vos besoins et vous suggère le service mécanique le plus approprié."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "3. Choix du Mécanicien",
      desc: "Comparez les pros certifiés et les amateurs passionnés selon leurs tarifs, avis et distance. C'est vous qui décidez."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "4. Réservation & Travail",
      desc: "Réservez en un clic. Le mécanicien intervient à domicile ou en atelier. Le paiement est sécurisé et bloqué jusqu'à votre validation."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Réparer sa voiture n'a jamais" été <span className="text-blue-500">aussi simple.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            AutoFix révolutionne l'entretien automobile en connectant directement les propriétaires aux meilleurs talents mécaniques.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-3xl inline-block group-hover:bg-blue-600 group-hover:text-white transition-all">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Confiance Totale
              </div>
              <h2 className="text-3xl font-black text-slate-900">Pourquoi nous faire confiance ?</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-slate-600 italic">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  Mécaniciens professionnels certifiés CPA (Comité Paritaire Automobile).
                </li>
                <li className="flex gap-3 text-slate-600 italic">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  Assurance Responsabilité Civile incluse sur toutes les interventions.
                </li>
                <li className="flex gap-3 text-slate-600 italic">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  Service client disponible 7j/7 basé à Montréal.
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/register">
                  <Button size="lg" className="rounded-2xl px-8 shadow-lg shadow-blue-200">Essayer maintenant</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Garage" 
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
