'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    // Use service role if available, otherwise use anonymous key
    let supabase = null;

    if (serviceRoleKey && supabaseUrl) {
      supabase = createClient(supabaseUrl, serviceRoleKey);
    } else if (supabaseUrl && supabaseAnonKey) {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        hasServiceRole: !!serviceRoleKey,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration incomplete. Please check environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY)' 
        },
        { status: 500 }
      );
    }

    // Query credentials table
    const { data, error } = await supabase
      .from('credentials')
      .select('id, email')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      console.error('Query error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Credentials match - return success
    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error?.message);
    return NextResponse.json(
      { success: false, error: error?.message || 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
