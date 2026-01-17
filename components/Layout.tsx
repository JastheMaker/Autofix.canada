
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Menu, X, LogOut, Globe, Facebook, Instagram, Twitter, HelpCircle, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth, useTranslation } from '../App';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                <Wrench className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">
                AUTO<span className="text-blue-600">FIX</span>
              </span>
            </Link>

            <nav className="hidden md:flex gap-8 items-center">
              <Link to="/search" className={isActive('/search')}>{t('findMech')}</Link>
              {user && <Link to="/dashboard" className={isActive('/dashboard')}>{t('myDash')}</Link>}
              
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <button 
                  onClick={toggleLang}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                  <Globe className="w-4 h-4" />
                  {lang === 'fr' ? 'EN' : 'FR'}
                </button>

                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
                      <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login">
                      <Button variant="secondary" size="sm" className="rounded-full px-6">{t('login')}</Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="rounded-full px-6 shadow-lg shadow-blue-200">{t('register')}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
             <Link to="/search" className="block py-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>{t('findMech')}</Link>
             <Link to="/how-it-works" className="block py-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>{t('howItWorks')}</Link>
             {user && <Link to="/dashboard" className="block py-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>{t('myDash')}</Link>}
             <div className="pt-4 border-t flex items-center justify-between">
                <button onClick={toggleLang} className="text-sm font-bold">{lang === 'fr' ? 'English' : 'Français'}</button>
                {!user && (
                   <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm">{t('register')}</Button>
                   </Link>
                )}
             </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white">
                <Wrench className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-black tracking-tighter">AUTOFIX</span>
              </div>
              <p className="text-sm leading-relaxed">{t('footerText')}</p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-white"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-white"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-white"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> {t('quickLinks')}
              </h3>
              <ul className="space-y-4 text-sm">
                <li><Link to="/search" className="hover:text-white transition-colors">{t('findMech')}</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">{t('becomePartner')}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">{t('howItWorks')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" /> Support
              </h3>
              <ul className="space-y-4 text-sm">
                <li><Link to="/support" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contactez-nous</Link></li>
                <li><Link to="/support#faq" className="hover:text-white transition-colors">FAQ Clients</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Newsletter
              </h3>
              <p className="text-xs mb-4">Recevez nos conseils d'entretien et promos.</p>
              {newsletterStatus === 'success' ? (
                <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Inscription réussie !
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    placeholder="Email" 
                    className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                  <Button size="sm" type="submit">Go</Button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex gap-6 uppercase tracking-widest font-bold">
              <Link to="/tos" className="hover:text-white">{t('tos')}</Link>
              <Link to="/privacy" className="hover:text-white">{t('privacy')}</Link>
              <Link to="/cookies" className="hover:text-white">Cookies</Link>
            </div>
            <div className="text-slate-600">
              © 2024 AUTOFIX BOOKING. {lang === 'fr' ? 'TOUS DROITS RÉSERVÉS.' : 'ALL RIGHTS RESERVED.'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
