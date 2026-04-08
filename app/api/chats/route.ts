import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { mapChatRow } from '@/lib/db-mappers';
import { insertMessages, fetchChatWithMessages } from '@/lib/chat-utils';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageType = searchParams.get('pageType');

  let query = supabase
    .from('chats')
    .select('id, user_id, page_type, title, created_at, updated_at')
    .eq('user_id', session.user.id)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (pageType) {
    query = query.eq('page_type', pageType);
  }

  const { data: chats, error } = await query;

  if (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }

  return NextResponse.json({ chats: (chats ?? []).map((c) => mapChatRow(c)) });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pageType, title, messages } = body;

    console.log('POST /api/chats - Creating chat:', {
      pageType,
      title,
      messagesCount: messages?.length,
      userId: session.user.id,
    });

    // Insert the chat row
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        user_id: session.user.id,
        page_type: pageType,
        title: title || 'New Chat',
      })
      .select()
      .single();

    if (chatError || !chat) {
      console.error('Error creating chat:', chatError);
      return NextResponse.json({ error: 'Failed to create chat', details: String(chatError) }, { status: 500 });
    }

    // Insert messages if provided
    if (Array.isArray(messages) && messages.length > 0) {
      await insertMessages(chat.id, messages);
    }

    // Fetch back with messages
    const fullChat = await fetchChatWithMessages(chat.id);
    console.log('Chat created successfully:', chat.id, chat.title);
    return NextResponse.json({ chat: fullChat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat', details: String(error) }, { status: 500 });
  }
}

