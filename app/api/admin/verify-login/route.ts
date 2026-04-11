'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // Trim whitespace from inputs
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return NextResponse.json(
      { success: false, error: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    // Use service role if available and looks valid, otherwise use anonymous key
    let supabase = null;

    // Check if service role key is valid (not a placeholder)
    const isValidServiceRole = serviceRoleKey && !serviceRoleKey.includes('your_') && serviceRoleKey.length > 20;

    if (isValidServiceRole && supabaseUrl) {
      supabase = createClient(supabaseUrl, serviceRoleKey);
    } else if (supabaseUrl && supabaseAnonKey) {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        hasValidServiceRole: isValidServiceRole,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration incomplete. Please check environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY)' 
        },
        { status: 500 }
      );
    }

    // Debug: Log all credentials to find the issue
    const { data: allCredentials } = await supabase
      .from('credentials')
      .select('id, email, password');
    
    console.log('=== LOGIN DEBUG ===');
    console.log('Attempted email:', trimmedEmail);
    console.log('Attempted password:', trimmedPassword);
    console.log('All credentials in DB:', allCredentials);

    // Query credentials table
    const { data, error } = await supabase
      .from('credentials')
      .select('id, email')
      .eq('email', trimmedEmail)
      .eq('password', trimmedPassword)
      .single();

    if (error) {
      console.error('Query error:', error.message);
      console.error('Attempted login - Email:', trimmedEmail);
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
