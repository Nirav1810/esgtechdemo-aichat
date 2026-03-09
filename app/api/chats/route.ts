import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import dbConnect from '@/lib/mongodb';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageType = searchParams.get('pageType');

  await dbConnect();

  const query: Record<string, unknown> = { userId: session.user.id };
  if (pageType) {
    query.pageType = pageType;
  }

  const chats = await Chat.find(query)
    .select('title pageType createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50);

  return NextResponse.json({ chats: JSON.parse(JSON.stringify(chats)) });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pageType, title, messages } = body;

    console.log("POST /api/chats - Creating chat:", { pageType, title, messagesCount: messages?.length, userId: session.user.id });

    await dbConnect();

    const chat = await Chat.create({
      userId: session.user.id,
      pageType,
      title: title || 'New Chat',
      messages: messages || [],
    });

    console.log("Chat created successfully:", chat._id, chat.title);
    return NextResponse.json({ chat: JSON.parse(JSON.stringify(chat)) });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json({ error: 'Failed to create chat', details: String(error) }, { status: 500 });
  }
}
