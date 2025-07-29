import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const { url, public_id, type } = body;

  if (!url || !public_id || !type) {
    return NextResponse.json({ error: 'Chybí data' }, { status: 400 });
  }

  const { error } = await supabase.from('photos').insert([
    { url, public_id, type },
  ]);

  if (error) {
    console.error('Chyba při ukládání do Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}