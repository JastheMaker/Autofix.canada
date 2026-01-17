
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-6">Parlons de votre projet.</h1>
              <p className="text-lg text-slate-600">Vous avez une question spécifique ou besoin d'un partenariat ? Notre équipe est là pour vous répondre.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Mail /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Email</h4>
                  <p className="text-slate-500">contact@autofix.ca</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Phone /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Téléphone</h4>
                  <p className="text-slate-500">+1 (514) 555-0199</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><MapPin /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Siège Social</h4>
                  <p className="text-slate-500">1234 Rue Peel, Montréal, QC H3B 5N4</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">Message envoyé !</h3>
                <p className="text-slate-500">Nous vous répondrons dans les plus brefs délais.</p>
                <Button onClick={() => setSubmitted(false)}>Envoyer un autre message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Nom Complet</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none" placeholder="Jean Dupont" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Email</label>
                    <input type="email" required className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none" placeholder="jean@mail.ca" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Sujet</label>
                  <select className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none appearance-none">
                    <option>Question Générale</option>
                    <option>Problème de Réservation</option>
                    <option>Devenir Partenaire</option>
                    <option>Litige avec un mécanicien</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Message</label>
                  <textarea required rows={5} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg">
                  <Send className="w-5 h-5 mr-2" /> Envoyer le message
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
