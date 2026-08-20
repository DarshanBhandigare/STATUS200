import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, AuthState } from '../types/auth';
import { DEMO_PORTFOLIOS } from '../features/portfolio/demoData';

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface AuthContextType extends AuthState {
  signUp: (params: SignUpParams) => Promise<{ error: Error | null }>;
  signIn: (params: SignInParams) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  signInAsDemoUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const LOCAL_STORAGE_USER_KEY = 'devfolio_local_user';

const DEMO_USER: UserProfile = {
  id: 'demo-user-id',
  email: 'alex.morgan.dev@example.com',
  fullName: 'Alex Morgan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  headline: 'Full Stack & Cloud Developer @ XYZ University',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          setSession(initialSession);

          if (initialSession?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', initialSession.user.id)
              .single();

            setUser({
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              fullName: profile?.full_name || initialSession.user.user_metadata?.full_name || 'User',
              avatarUrl: profile?.avatar_url || initialSession.user.user_metadata?.avatar_url,
              headline: profile?.headline,
              createdAt: profile?.created_at || new Date().toISOString(),
            });
          }
        } catch (err: any) {
          console.error('Supabase getSession error:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }

        const client = supabase;
        if (client) {
          const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, currentSession) => {
            setSession(currentSession);
            if (currentSession?.user) {
              const { data: profile } = await client
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                fullName: profile?.full_name || currentSession.user.user_metadata?.full_name || 'User',
                avatarUrl: profile?.avatar_url || currentSession.user.user_metadata?.avatar_url,
                headline: profile?.headline,
                createdAt: profile?.created_at || new Date().toISOString(),
              });
            } else {
              setUser(null);
            }
            setIsLoading(false);
          });

          return () => {
            subscription.unsubscribe();
          };
        }
      } else {
        // Local/Demo Mode initial check
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
        // Initialize demo portfolios if not present
        if (!localStorage.getItem('devfolio_portfolios')) {
          localStorage.setItem('devfolio_portfolios', JSON.stringify(DEMO_PORTFOLIOS));
        }
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = useCallback(async ({ email, password, fullName }: SignUpParams) => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName,
            createdAt: new Date().toISOString(),
          });
        }
        return { error: null };
      } catch (err: any) {
        setError(err.message);
        return { error: err };
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo / Local Mode Signup
      const localUser: UserProfile = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      setUser(localUser);
      setIsLoading(false);
      return { error: null };
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInParams) => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          setUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
            avatarUrl: profile?.avatar_url,
            headline: profile?.headline,
            createdAt: profile?.created_at || new Date().toISOString(),
          });
        }
        return { error: null };
      } catch (err: any) {
        setError(err.message);
        return { error: err };
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo / Local Mode Sign In
      const existing = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      let localUser: UserProfile;
      if (existing) {
        localUser = JSON.parse(existing);
        localUser.email = email;
      } else {
        localUser = {
          id: 'usr_local_123',
          email,
          fullName: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
      }
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      setUser(localUser);
      setIsLoading(false);
      return { error: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    setUser(null);
    setSession(null);
    setIsLoading(false);
  }, []);

  const signInAsDemoUser = useCallback(() => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsLoading(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: googleError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (googleError) throw googleError;
        return { error: null };
      } catch (err: any) {
        setError(err.message);
        return { error: err };
      } finally {
        setIsLoading(false);
      }
    } else {
      signInAsDemoUser();
      return { error: null };
    }
  }, [signInAsDemoUser]);

  const deleteAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt Postgres RPC user deletion
        const { error: rpcError } = await supabase.rpc('delete_user_account');
        if (rpcError) {
          // Fallback: delete profile & portfolios manually if rpc not created
          if (user?.id) {
            await supabase.from('portfolios').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);
          }
        }
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        return { error: null };
      } catch (err: any) {
        setError(err.message);
        return { error: err };
      } finally {
        setIsLoading(false);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem('devfolio_portfolios');
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return { error: null };
    }
  }, [user]);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) throw error;
        return { error: null };
      } catch (err: any) {
        return { error: err };
      }
    }
    // Demo mode: pretend it worked
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        return { error: null };
      } catch (err: any) {
        return { error: err };
      }
    }
    return { error: null };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          avatar_url: updated.avatarUrl,
          headline: updated.headline,
        })
        .eq('id', user.id);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    }
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDemoMode: !isSupabaseConfigured,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        deleteAccount,
        signInAsDemoUser,
        updateProfile,
        sendPasswordResetEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
