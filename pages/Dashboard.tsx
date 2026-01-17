
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { UserRole, Booking } from '../types';
import { dataApi } from '../services/api';
import { VisualAssistant } from '../components/VisualAssistant';
import { Cloud, Loader2, ShieldCheck, RefreshCcw, LayoutDashboard, Settings, Zap, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/Button';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTINGS'>('OVERVIEW');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const alive = await dataApi.checkHealth();
    setIsCloudConnected(alive);
    if (alive) {
      const data = await dataApi.getBookings(user.id);
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Bonjour, {user.name.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                PostgreSQL Cloud : <span className="text-blue-600">dazlsoxbywnotgwwkptx</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('OVERVIEW')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'OVERVIEW' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Activités
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'SETTINGS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Paramètres
          </button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" /> Historique des interventions
                </h3>
                <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <RefreshCcw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{b.date}</td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">{b.service}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                            b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-slate-900 group-hover:text-blue-600 transition-colors">{b.price}$</td>
                      </tr>
                    ))}
                    {!loading && bookings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="max-w-xs mx-auto space-y-4 opacity-30">
                            <Cloud className="w-12 h-12 mx-auto" />
                            <p className="text-sm font-bold uppercase tracking-widest">Aucune donnée trouvée sur Supabase</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <VisualAssistant />
            
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-500">Infrastructure Cloud</h4>
                  <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-black flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-blue-400" /> PostgreSQL
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">ID: dazlsoxbywnotgwwkptx</div>
                </div>

                <div className="pt-4 p-5 bg-slate-800/50 rounded-3xl flex items-center gap-4 border border-slate-700/50">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                  <span className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                    Protection RLS Active : Accès restreint aux données du propriétaire.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-100 text-center space-y-8 animate-in slide-in-from-bottom-8">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-slate-300" />
           </div>
           <div className="space-y-2">
             <h2 className="text-3xl font-black text-slate-900">Préférences Cloud</h2>
             <p className="text-slate-500 font-medium">Configurez vos alertes de maintenance et vos informations de facturation.</p>
           </div>
           <div className="flex justify-center gap-4">
              <Button variant="outline" className="rounded-2xl px-8 h-12">Changer mot de passe</Button>
              <Button className="rounded-2xl px-8 h-12">Sauvegarder</Button>
           </div>
        </div>
      )}
    </div>
  );
};
