import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { mapChatRow } from '@/lib/db-mappers';
import { insertMessages, fetchChatWithMessages } from '@/lib/chat-utils';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: chat, error } = await supabase
    .from('chats')
    .select(`
      *,
      chat_messages (
        *,
        chat_message_attachments (*)
      )
    `)
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (error || !chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  return NextResponse.json({ chat: mapChatRow(chat) });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { messages, title } = body;

  // Verify ownership
  const { data: existing } = await supabase
    .from('chats')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  // Update title and updated_at
  const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title) updatePayload.title = title;

  const { error: updateError } = await supabase
    .from('chats')
    .update(updatePayload)
    .eq('id', params.id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }

  // Replace messages — delete all then re-insert
  if (Array.isArray(messages)) {
    await supabase.from('chat_messages').delete().eq('chat_id', params.id);
    if (messages.length > 0) {
      await insertMessages(params.id, messages);
    }
  }

  const fullChat = await fetchChatWithMessages(params.id);
  return NextResponse.json({ chat: fullChat });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
