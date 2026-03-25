import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Types
export interface User {
  id: string;
  email: string;
  childName: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Sign Up
export const signUp = async (email: string, password: string, childName: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          childName,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          childName: data.user.user_metadata?.childName || '',
          createdAt: data.user.created_at || '',
        },
      };
    }

    return { success: false, error: 'Sign up failed' };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { success: false, error: 'Unexpected error' };
  }
};

// Sign In
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          childName: data.user.user_metadata?.childName || '',
          createdAt: data.user.created_at || '',
        },
      };
    }

    return { success: false, error: 'Sign in failed' };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { success: false, error: 'Unexpected error' };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    console.error('Sign out error:', err);
    return { success: false, error: 'Sign out failed' };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return {
      id: data.user.id,
      email: data.user.email || '',
      childName: data.user.user_metadata?.childName || '',
      createdAt: data.user.created_at || '',
    };
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

// Listen to Auth Changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        childName: session.user.user_metadata?.childName || '',
        createdAt: session.user.created_at || '',
      });
    } else {
      callback(null);
    }
  });

  return subscription;
};

// Types
export interface RSVPData {
  guestName: string;
  phone: string;
  email: string;
  guestCount: number;
  message: string;
  attending: 'yes' | 'no';
  childName: string;
  submittedAt: string;
}

export interface WishData {
  guestName: string;
  guestPhone: string;
  wishText: string;
  childName: string;
  createdAt?: string;
}

// Save RSVP data
export const saveRSVP = async (data: RSVPData) => {
  try {
    const dbData = {
      guest_name: data.guestName,
      phone: data.phone,
      email: data.email,
      guest_count: data.guestCount,
      message: data.message,
      attending: data.attending,
      child_name: data.childName,
      submitted_at: data.submittedAt,
    };

    const { data: result, error } = await supabase
      .from('rsvps')
      .insert([dbData])
      .select();

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error saving RSVP:', errorMsg);
      console.error('Full error object:', error);
      return { success: false, error: errorMsg };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Unexpected error saving RSVP:', err);
    return { success: false, error: 'Failed to save RSVP - check browser console' };
  }
};

// Save wish data
export const saveWish = async (data: WishData) => {
  try {
    const dbData = {
      guest_name: data.guestName,
      guest_phone: data.guestPhone,
      wish_text: data.wishText,
      child_name: data.childName,
      submitted_at: data.createdAt || new Date().toISOString(),
      is_visible: false,
    };

    const { data: result, error } = await supabase
      .from('wishes')
      .insert([dbData])
      .select();

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error saving wish:', errorMsg);
      console.error('Full error object:', error);
      return { success: false, error: errorMsg };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Unexpected error saving wish:', err);
    return { success: false, error: 'Failed to save wish - check browser console' };
  }
};

// Get wishes
export const getWishes = async (childName: string) => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('child_name', childName)
      .order('submitted_at', { ascending: false });

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error fetching wishes:', errorMsg);
      console.error('Full error object:', error);
      return { success: false, error: errorMsg, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching wishes:', err);
    return { success: false, error: 'Failed to fetch wishes - check browser console', data: [] };
  }
};

// Get visible wishes for homepage
export const getVisibleWishes = async (childName: string) => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('child_name', childName)
      .eq('is_visible', true)
      .order('submitted_at', { ascending: false });

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error fetching visible wishes:', errorMsg);
      return { success: false, error: errorMsg, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching visible wishes:', err);
    return { success: false, error: 'Failed to fetch visible wishes - check browser console', data: [] };
  }
};

export const updateWishVisibility = async (wishId: number, isVisible: boolean) => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .update({ is_visible: isVisible })
      .eq('id', wishId)
      .select();

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error updating wish visibility:', errorMsg);
      return { success: false, error: errorMsg, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error updating wish visibility:', err);
    return { success: false, error: 'Failed to update wish visibility - check browser console', data: [] };
  }
};

// Get RSVPs for dashboard
export const getRSVPs = async (childName: string) => {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('child_name', childName)
      .order('submitted_at', { ascending: false });

    if (error) {
      const errorMsg = error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Error fetching RSVPs:', errorMsg);
      return { success: false, error: errorMsg, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching RSVPs:', err);
    return { success: false, error: 'Failed to fetch RSVPs', data: [] };
  }
};
