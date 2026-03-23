import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface RSVPData {
  name: string;
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
  wish: string;
  childName: string;
  createdAt: string;
}

// Save RSVP data
export const saveRSVP = async (data: RSVPData) => {
  try {
    const dbData = {
      name: data.name,
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
      wish: data.wish,
      child_name: data.childName,
      created_at: data.createdAt,
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
      .order('created_at', { ascending: false });

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
