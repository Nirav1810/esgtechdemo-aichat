import { supabase } from '@/lib/supabase';
import { mapChatRow } from '@/lib/db-mappers';

export async function insertMessages(chatId: string, messages: any[]) {
  const messageRows = messages.map((msg, index) => ({
    chat_id: chatId,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp || new Date().toISOString(),
    generated_image_data_url: msg.generatedImageDataUrl ?? null,
    generated_image_mime_type: msg.generatedImageMimeType ?? null,
    generated_image_model: msg.generatedImageModel ?? null,
    order: index,
  }));

  const { data: insertedMessages, error: msgError } = await supabase
    .from('chat_messages')
    .insert(messageRows)
    .select('id');

  if (msgError) {
    console.error('Error inserting messages:', msgError);
    return;
  }

  // Insert attachments for each message
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const msgId = insertedMessages?.[i]?.id;
    if (msgId && Array.isArray(msg.attachments) && msg.attachments.length > 0) {
      const attachmentRows = msg.attachments.map((att: any) => ({
        message_id: msgId,
        name: att.name,
        size: att.size,
        kind: att.kind,
        preview_data_url: att.previewDataUrl ?? null,
      }));
      await supabase.from('chat_message_attachments').insert(attachmentRows);
    }
  }
}

export async function fetchChatWithMessages(chatId: string) {
  const { data: row } = await supabase
    .from('chats')
    .select(`
      *,
      chat_messages (
        *,
        chat_message_attachments (*)
      )
    `)
    .eq('id', chatId)
    .single();

  return row ? mapChatRow(row) : null;
}
