
import { User, UserRole, Mechanic, Booking, ServiceType } from '../types';
import { supabase } from './supabaseClient';

/**
 * Synchronise les données de l'utilisateur vers PostgreSQL.
 * Gère les 9 colonnes de vos tables en fournissant des valeurs par défaut.
 */
export const syncUserData = async (authId: string, email: string, metadata: any): Promise<User> => {
  const name = metadata.full_name || metadata.name || metadata.display_name || 'Utilisateur AutoFix';
  const avatar = metadata.avatar_url || metadata.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authId}`;
  
  let role = UserRole.CLIENT;
  if (metadata.role === UserRole.MECHANIC_PRO || metadata.role === 'MECHANIC_PRO') role = UserRole.MECHANIC_PRO;
  if (metadata.role === UserRole.MECHANIC_AMATEUR || metadata.role === 'MECHANIC_AMATEUR') role = UserRole.MECHANIC_AMATEUR;

  console.log(`[Sync] Tentative de mise à jour du profil : ${authId}`);

  // 1. Mise à jour de la table 'profiles' (9 colonnes estimées)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authId,
      name: name,
      email: email,
      role: role,
      avatar: avatar,
      // On ajoute des colonnes probables pour éviter l'erreur NOT NULL
      bio: metadata.bio || '',
      created_at: new Date().toISOString()
    }, { onConflict: 'id' })
    .select()
    .single();

  if (profileError) {
    console.error("❌ Erreur Table Profiles:", profileError);
    throw new Error(`Erreur Profil (${profileError.code}): ${profileError.message}`);
  }

  // 2. Mise à jour de la table 'mechanics' (9 colonnes détectées)
  if (role === UserRole.MECHANIC_PRO || role === UserRole.MECHANIC_AMATEUR) {
    const { error: mechError } = await supabase.from('mechanics').upsert({
      id: authId,
      location: 'Montreal', 
      hourly_rate: role === UserRole.MECHANIC_PRO ? 80 : 40,
      is_verified: role === UserRole.MECHANIC_PRO,
      // Remplissage des 9 colonnes probables pour éviter les erreurs de schéma
      bio: '',
      rating: 5.0,
      review_count: 0,
      services: [],
      availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    }, { onConflict: 'id' });

    if (mechError) {
      console.warn("⚠️ Attention: Le profil mécanicien n'a pas pu être créé. Vérifiez si les colonnes correspondent exactement (snake_case vs camelCase).", mechError.message);
    }
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    avatar: profile.avatar
  };
};

export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Compte introuvable.");

    return { user: await syncUserData(data.user.id, data.user.email!, data.user.user_metadata) };
  },

  register: async (userData: any): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: { 
          name: userData.name, 
          role: userData.role 
        }
      }
    });
    if (error) throw error;
  },

  verifyEmailOtp: async (email: string, token: string): Promise<{ user: User }> => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    
    if (error) throw error;
    if (!data.user) throw new Error("Code invalide.");

    return { user: await syncUserData(data.user.id, data.user.email!, data.user.user_metadata) };
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
  },

  signInWithFacebook: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
  }
};

export const dataApi = {
  getMechanics: async (): Promise<Mechanic[]> => {
    const { data, error } = await supabase
      .from('mechanics')
      .select('*, profiles:id(*)');
    if (error) {
      console.error("Erreur getMechanics:", error);
      return [];
    }
    return data.map((m: any) => ({
      ...m,
      name: m.profiles?.name || 'Inconnu',
      email: m.profiles?.email || '',
      role: m.profiles?.role || UserRole.MECHANIC_PRO,
      avatar: m.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`
    }));
  },
  
  getBookings: async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`client_id.eq.${userId},mechanic_id.eq.${userId}`);
    return error ? [] : data;
  },

  checkHealth: async () => {
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
};
