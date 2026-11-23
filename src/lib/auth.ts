
import { supabase } from "./supabase";

export async function signUp(data: {
  fullName: string;
  shopName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email.trim(),
    password: data.password,
    options: {
      data: {
        full_name: data.fullName.trim(),
        shop_name: data.shopName.trim(),
        phone: data.phone.trim(),
      },
    },
  });

  if (error) throw error;

  return result;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
}

export function onAuthStateChange(
  callback: (session: Awaited<ReturnType<typeof getCurrentSession>>) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
