import { supabase } from './client';
import type { AuthError, User, Session } from '@supabase/supabase-js';

export interface SignInWithEmailResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpWithEmailResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<SignInWithEmailResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  options?: {
    data?: Record<string, any>;
    redirectTo?: string;
  }
): Promise<SignUpWithEmailResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: options?.data,
      emailRedirectTo: options?.redirectTo,
    },
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

export async function signInWithOtp(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  return { error };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  return { error };
}

export async function updateUser(attributes: {
  email?: string;
  password?: string;
  data?: Record<string, any>;
}): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.updateUser(attributes);

  return {
    user: data.user,
    error,
  };
}
