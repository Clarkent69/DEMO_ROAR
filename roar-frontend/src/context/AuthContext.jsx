import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { MOCK_USERS, ROLES } from '../config/roles';

const AuthContext = createContext(null);

// Check if real Supabase credentials are configured
const isSupabaseConfigured = Boolean(
  (import.meta.env.VITE_SUPABASE_URL || 'https://vsgjczzksykgjukrchnm.supabase.co') !== 'https://your-project-id.supabase.co'
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('roar_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // ─── Supabase live session listener ───────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const syncSessionUser = async (sessionUserObj) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUserObj.id)
          .single();

        let resolvedRole = profile?.role;
        if (!resolvedRole) {
          resolvedRole = ROLES.STUDENT;
          // Create student profile record for first-time Microsoft/OAuth login
          await supabase.from('profiles').upsert({
            id: sessionUserObj.id,
            email: sessionUserObj.email,
            role: ROLES.STUDENT,
          });
        }

        const appUser = {
          id: sessionUserObj.id,
          email: sessionUserObj.email,
          role: resolvedRole,
          name:
            sessionUserObj.user_metadata?.full_name ||
            sessionUserObj.user_metadata?.name ||
            sessionUserObj.email?.split('@')[0] ||
            sessionUserObj.email,
        };
        setUser(appUser);
        localStorage.setItem('roar_user', JSON.stringify(appUser));
      } catch (err) {
        console.warn('Profile sync fallback:', err);
        const appUser = {
          id: sessionUserObj.id,
          email: sessionUserObj.email,
          role: ROLES.STUDENT,
          name: sessionUserObj.email,
        };
        setUser(appUser);
        localStorage.setItem('roar_user', JSON.stringify(appUser));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await syncSessionUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('roar_user');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    // Always check mock users first — demo credentials work regardless of Supabase config
    const matchedMock = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (matchedMock) {
      const sessionUser = { name: matchedMock.name, email: matchedMock.email, role: matchedMock.role };
      setUser(sessionUser);
      localStorage.setItem('roar_user', JSON.stringify(sessionUser));
      return { success: true };
    }

    // Fall through to Supabase for real accounts
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, message: error.message };
      return { success: true };
    }

    return { success: false, message: 'Invalid institutional credentials.' };
  };

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = async (email, password, role) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { success: false, message: error.message };

      // Write role into profiles table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          role,
        });
      }
      return { success: true, message: 'Account created. Check your email to confirm.' };
    }

    // Mock fallback — create in-memory session immediately
    const sessionUser = { name: email.split('@')[0], email, role };
    setUser(sessionUser);
    localStorage.setItem('roar_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  // ─── Microsoft Azure OAuth ────────────────────────────────────────────────
  const loginWithMicrosoft = async () => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase configuration is required for Microsoft login.' };
    }
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email openid profile',
        redirectTo: redirectUrl,
      },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, data };
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('roar_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithMicrosoft,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
