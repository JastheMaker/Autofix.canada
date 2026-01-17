
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Wrench, ShieldCheck, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { CITIES } from '../constants';
import { ServiceType } from '../types';
import { useTranslation } from '../App';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // Added lang to the useTranslation destructuring to fix missing variable errors
  const { t, lang } = useTranslation();
  const [city, setCity] = useState(CITIES[0]);
  const [service, setService] = useState<string>('');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (service) params.append('service', service);
    navigate(`/search?${params.toString()}`);
  };

  const handleSOS = () => {
    const params = new URLSearchParams();
    params.append('city', city);
    params.append('service', ServiceType.CAR_SOS);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative bg-blue-900 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* SOS Alert Banner */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-4 py-2 rounded-full text-red-100 text-sm font-medium mb-8 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {t('urgentHelp')}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            {t('heroTitle').split(',').map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {i === 1 ? <span className="text-blue-400">{part}</span> : part}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('heroSub')}
          </p>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Standard Search Box */}
            <div className="bg-white rounded-lg p-2 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 h-12">
                <MapPin className="text-slate-400 w-5 h-5 mr-2" />
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 focus:ring-0 appearance-none cursor-pointer"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex-1 flex items-center px-4 h-12">
                <Wrench className="text-slate-400 w-5 h-5 mr-2" />
                <select 
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="">{t('allServices')}</option>
                  {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Button size="lg" className="w-full md:w-auto" onClick={() => handleSearch()}>
                <Search className="w-5 h-5 mr-2" />
                {t('search')}
              </Button>
            </div>

            {/* Emergency SOS Action */}
            <div className="flex justify-center">
              <button 
                onClick={handleSOS}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full duration-500 transition-transform -translate-x-full skew-x-12"></div>
                <AlertCircle className="w-6 h-6 mr-3 animate-bounce" />
                {t('sosBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOS Info Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
              <AlertCircle className="text-red-500 w-6 h-6" />
              {t('urgentHelp')}
            </h2>
            <p className="text-slate-600 mb-0">
              {t('urgentDesc')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              {/* Used t('pro') instead of directly accessing translations object to fix scope error */}
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('pro')} & Sécurité</h3>
              <p className="text-slate-600">
                {lang === 'fr' 
                  ? "Tous nos mécaniciens professionnels sont vérifiés manuellement. Consultez les avis réels des clients."
                  : "All our professional mechanics are manually verified. Read real customer reviews."}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Prix Transparents</h3>
              <p className="text-slate-600">
                {lang === 'fr'
                  ? "Comparez les tarifs horaires des amateurs et des pros. Pas de surprise sur la facture finale."
                  : "Compare hourly rates of amateurs and pros. No surprises on the final bill."}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">À domicile ou au garage</h3>
              <p className="text-slate-600">
                {lang === 'fr'
                  ? "Choisissez le lieu qui vous convient. Nos mécaniciens mobiles se déplacent chez vous."
                  : "Choose the location that suits you. Our mobile mechanics come to you."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
