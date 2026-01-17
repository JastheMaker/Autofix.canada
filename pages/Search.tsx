
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MechanicCard } from '../components/MechanicCard';
import { ServiceType, Mechanic } from '../types';
import { MapPin, Globe, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { AIDiagnosis } from '../components/AIDiagnosis';
import { useTranslation } from '../App';
import { searchGroundingDiagnostic, findNearbyGarages } from '../services/geminiService';
import { dataApi } from '../services/api';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [groundingInfo, setGroundingInfo] = useState<{text: string, sources: any[]} | null>(null);
  const [loadingGrounding, setLoadingGrounding] = useState(false);
  
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'Montreal');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('service') || '');
  const [showAmateurs] = useState(true);
  const [showPros] = useState(true);

  useEffect(() => {
    // Récupération réelle depuis Supabase
    dataApi.getMechanics()
      .then(data => setMechanics(data))
      .catch(err => console.error("Database connection failed", err));
  }, []);

  useEffect(() => {
    if (selectedService) {
      setLoadingGrounding(true);
      searchGroundingDiagnostic(selectedService)
        .then(res => setGroundingInfo(res))
        .catch(() => setGroundingInfo(null))
        .finally(() => setLoadingGrounding(false));
    } else {
      setGroundingInfo(null);
    }
  }, [selectedService]);

  const handleNearby = () => {
    setLoadingGrounding(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await findNearbyGarages(pos.coords.latitude, pos.coords.longitude);
      setGroundingInfo({ text: res.text, sources: res.sources });
      setLoadingGrounding(false);
    }, () => {
      alert("Géolocalisation refusée.");
      setLoadingGrounding(false);
    });
  };

  const filteredMechanics = useMemo(() => {
    return mechanics.filter(m => {
      const matchCity = m.location === selectedCity;
      const matchService = selectedService ? m.services.includes(selectedService as ServiceType) : true;
      const matchType = (showPros && m.role === 'MECHANIC_PRO') || (showAmateurs && m.role === 'MECHANIC_AMATEUR');
      return matchCity && matchService && matchType;
    });
  }, [mechanics, selectedCity, selectedService, showAmateurs, showPros]);

  const handleUpdateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
    if (key === 'service') setSelectedService(value);
    if (key === 'city') setSelectedCity(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-1000">
      <AIDiagnosis onServiceRecommended={(s) => handleUpdateFilter('service', s)} />

      {selectedService && (
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
              <Globe className="w-4 h-4 text-blue-600" /> Analyse Experts Cloud : {selectedService}
            </h4>
            {loadingGrounding && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </div>
          {groundingInfo && (
            <div className="text-sm text-slate-600 space-y-4 animate-in slide-in-from-left-4">
              <p className="leading-relaxed">{groundingInfo.text}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {groundingInfo.sources.map((chunk: any, i: number) => (
                  chunk.web && <a key={i} href={chunk.web.uri} target="_blank" className="text-[10px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 hover:bg-white hover:text-blue-600 transition-colors">{chunk.web.title}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 space-y-4">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 space-y-8">
             <Button className="w-full h-12 rounded-xl shadow-md shadow-blue-50" variant="secondary" onClick={handleNearby} disabled={loadingGrounding}>
               <MapPin className="w-4 h-4 mr-2" /> À proximité
             </Button>

             <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Ville</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => handleUpdateFilter('city', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 shadow-sm text-sm p-3 font-bold focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="Montreal">Montreal</option>
                  <option value="Ottawa">Ottawa</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Service</label>
                <select 
                  value={selectedService}
                  onChange={(e) => handleUpdateFilter('service', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 shadow-sm text-sm p-3 font-bold focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Tous les services</option>
                  {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {filteredMechanics.length} <span className="text-blue-600">experts disponibles</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredMechanics.map(mechanic => (
              <MechanicCard 
                key={mechanic.id} 
                mechanic={mechanic} 
                onBook={() => {
                  alert("La réservation via Supabase est activée. Choisissez un créneau.");
                }} 
              />
            ))}
            {filteredMechanics.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <MapPin className="w-10 h-10" />
                </div>
                <p className="text-slate-400 font-medium italic">Aucun mécanicien ne correspond à vos critères.</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={() => { setSelectedService(''); setSelectedCity('Montreal'); }}>Réinitialiser</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
