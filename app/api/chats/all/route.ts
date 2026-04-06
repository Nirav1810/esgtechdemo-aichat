import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { mapChatRow } from '@/lib/db-mappers';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageType = searchParams.get('pageType');

  let query = supabase
    .from('chats')
    .select(`
      *,
      chat_messages (
        *,
        chat_message_attachments (*)
      )
    `)
    .eq('user_id', session.user.id)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (pageType) {
    query = query.eq('page_type', pageType);
  }

  const { data: chats, error } = await query;

  if (error) {
    console.error('Error fetching all chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }

  return NextResponse.json({ chats: (chats ?? []).map(mapChatRow) });
}
