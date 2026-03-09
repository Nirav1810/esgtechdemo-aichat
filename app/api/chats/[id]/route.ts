import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import dbConnect from '@/lib/mongodb';
import { Types } from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid chat ID' }, { status: 400 });
  }

  const chat = await Chat.findOne({
    _id: params.id,
    userId: session.user.id,
  });

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  return NextResponse.json({ chat: JSON.parse(JSON.stringify(chat)) });
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

  await dbConnect();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid chat ID' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (messages) updateData.messages = messages;
  if (title) updateData.title = title;

  const chat = await Chat.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    { $set: updateData },
    { new: true }
  );

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  return NextResponse.json({ chat: JSON.parse(JSON.stringify(chat)) });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid chat ID' }, { status: 400 });
  }

  await Chat.findOneAndDelete({
    _id: params.id,
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
}
