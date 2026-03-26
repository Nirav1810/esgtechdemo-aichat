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
    .sort({ updatedAt: -1 })
    .limit(100);

  return NextResponse.json({ chats: JSON.parse(JSON.stringify(chats)) });
}
