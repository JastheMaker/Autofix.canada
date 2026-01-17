
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { Button } from '../components/Button';
import { authApi } from '../services/api';
import { 
  Loader2, AlertCircle, Database, CheckCircle2, Mail, 
  Chrome, Facebook, ArrowRight, Fingerprint, ShieldAlert,
  User, Wrench
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await authApi.login(email, password);
      login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') await authApi.signInWithGoogle();
      else await authApi.signInWithFacebook();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-6 text-white shadow-xl shadow-blue-100">
            <Fingerprint className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Accès Cloud</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Instance : dazlsoxbywnotgwwkptx</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleSocial('google')} className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all font-bold text-sm">
            <Chrome className="w-5 h-5 text-red-500" /> Google
          </button>
          <button onClick={() => handleSocial('facebook')} className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all font-bold text-sm">
            <Facebook className="w-5 h-5 text-blue-600" /> Facebook
          </button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Ou email</span></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100 animate-shake">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs font-bold leading-relaxed">{error}</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none" placeholder="Email" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none" placeholder="Mot de passe" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-blue-100">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Se connecter"}
          </Button>
          <p className="text-center text-sm font-bold text-slate-400">
            Besoin d'un compte ? <button type="button" onClick={() => navigate('/register')} className="text-blue-600 hover:underline">Créer maintenant</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'IDENTITY' | 'VERIFY' | 'SUCCESS'>('IDENTITY');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: UserRole.CLIENT
  });

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(formData);
      setStep('VERIFY');
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const { user } = await authApi.verifyEmailOtp(formData.email, otp);
      setStep('SUCCESS');
      setTimeout(() => {
        login(user);
        navigate('/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Code invalide. Vérifiez vos emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
          
          {step === 'IDENTITY' && (
            <div className="p-12 space-y-10 animate-in fade-in">
              <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Inscription Cloud</h2>
                <p className="text-slate-500 font-medium">Créez votre identité sur le réseau AutoFix</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none" placeholder="Nom complet" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none" placeholder="Email" />
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none" placeholder="Mot de passe (6+)" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Profil utilisateur</label>
                  <button onClick={() => setFormData({...formData, role: UserRole.CLIENT})} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${formData.role === UserRole.CLIENT ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}><User className="w-5 h-5" /> <span>Client</span></button>
                  <button onClick={() => setFormData({...formData, role: UserRole.MECHANIC_PRO})} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${formData.role === UserRole.MECHANIC_PRO ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}><Wrench className="w-5 h-5" /> <span>Mécanicien</span></button>
                </div>
              </div>
              <Button onClick={handleRegister} disabled={loading || !formData.email || formData.password.length < 6} className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-blue-100">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Recevoir mon code <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>
            </div>
          )}

          {step === 'VERIFY' && (
            <div className="p-16 space-y-10 animate-in slide-in-from-right-20">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Mail className="w-12 h-12 text-blue-600 animate-bounce" />
                </div>
                <h2 className="text-4xl font-black text-slate-900">Code de Confirmation</h2>
                <p className="text-slate-500 font-medium">Entrez le code envoyé à :<br/><span className="text-blue-600 font-black">{formData.email}</span></p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}
              
              <div className="flex flex-col items-center">
                <input 
                  type="text" maxLength={6} value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full max-w-[300px] text-center text-5xl font-black tracking-[0.8em] py-6 border-b-8 border-slate-100 focus:border-blue-600 outline-none text-blue-600"
                  placeholder="000000"
                />
              </div>

              <div className="space-y-4">
                <Button onClick={handleVerify} disabled={otp.length !== 6 || loading} className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-blue-100">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Vérifier mon identité"}
                </Button>
                <button onClick={() => setStep('IDENTITY')} className="w-full text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">Modifier l'email</button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="p-24 text-center space-y-10 animate-in zoom-in duration-1000">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                <div className="relative w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-3xl">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Compte Validé !</h2>
                <p className="text-slate-500 font-bold text-lg italic">Profil synchronisé avec l'instance PostgreSQL.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 animate-[progress_3s_ease-in-out]"></div></div>
                <div className="flex items-center gap-3 text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">
                  <Database className="w-4 h-4 animate-spin" /> Initialisation du dashboard...
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
