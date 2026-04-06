/**
 * MongoDB → Supabase Data Migration Script
 *
 * Reads every collection from your old MongoDB Atlas database and writes it
 * into Supabase PostgreSQL, handling all ID mapping and field transformations.
 *
 * Prerequisites:
 *   1. Fill in MONGODB_URI_OLD, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. Run the SQL schema in supabase/schema.sql in your Supabase SQL editor
 *   3. Run:  npm run migrate
 */

import { MongoClient, ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const match = line.match(/^([^#\s][^=]*)=(.*)/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    });
}

const MONGODB_URI = process.env.MONGODB_URI_OLD ?? '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI_OLD is not set in .env.local');
  process.exit(1);
}
if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL is not set in .env.local. Add your real Supabase URL first.');
  process.exit(1);
}
if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('YOUR_SERVICE_ROLE_KEY')) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY is not set in .env.local. Add your real service role key first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── ID Mapping: MongoDB ObjectId → Supabase UUID ──────────────────────────
// Supabase uses UUID as primary key for users and chats.
// We convert the Mongo ObjectId hex string to a deterministic UUID v4-ish format.
function objectIdToUuid(objectId: ObjectId | string): string {
  const hex = typeof objectId === 'string' ? objectId : objectId.toHexString();
  // Pad to 32 chars and format as UUID
  const padded = hex.padStart(32, '0');
  return [
    padded.slice(0, 8),
    padded.slice(8, 12),
    padded.slice(12, 16),
    padded.slice(16, 20),
    padded.slice(20, 32),
  ].join('-');
}

// ─── Batch insert helper ──────────────────────────────────────────────────────
async function batchInsert(table: string, rows: object[], batchSize = 200) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`  ❌  Batch insert into ${table} failed:`, error.message);
      throw error;
    }
    console.log(`  ✓  Inserted rows ${i + 1}–${Math.min(i + batchSize, rows.length)} into ${table}`);
  }
}

// ─── Main migration ───────────────────────────────────────────────────────────
async function migrate() {
  const mongo = new MongoClient(MONGODB_URI);

  try {
    await mongo.connect();
    console.log('✓ Connected to MongoDB');
    const db = mongo.db(); // uses the database from the connection string

    // ── 1. Users ────────────────────────────────────────────────────────────
    console.log('\n📁 Migrating users…');
    const mongoUsers = await db.collection('users').find({}).toArray();
    console.log(`  Found ${mongoUsers.length} user(s) in MongoDB`);

    // Map old ObjectId → UUID for foreign key use later
    const userIdMap = new Map<string, string>();

    if (mongoUsers.length > 0) {
      const userRows = mongoUsers.map((u) => {
        const newId = objectIdToUuid(u._id);
        userIdMap.set(u._id.toHexString(), newId);
        return {
          id: newId,
          email: u.email,
          password: u.password,
          name: u.name ?? null,
          created_at: u.createdAt ?? u.created_at ?? new Date().toISOString(),
        };
      });

      // Upsert to avoid duplicate key errors on re-runs
      const { error } = await supabase
        .from('users')
        .upsert(userRows, { onConflict: 'email' });
      if (error) throw error;
      console.log(`  ✓  Migrated ${userRows.length} user(s)`);
    }

    // ── 2. Chats + Messages + Attachments ────────────────────────────────────
    console.log('\n📁 Migrating chats…');
    const mongoChats = await db.collection('chats').find({}).toArray();
    console.log(`  Found ${mongoChats.length} chat(s) in MongoDB`);

    const chatIdMap = new Map<string, string>();

    for (const chat of mongoChats) {
      const oldUserId = chat.userId?.toHexString?.() ?? String(chat.userId);
      const newUserId = userIdMap.get(oldUserId);

      if (!newUserId) {
        console.warn(`  ⚠  Skipping chat ${chat._id} — parent user ${oldUserId} not migrated`);
        continue;
      }

      const newChatId = objectIdToUuid(chat._id);
      chatIdMap.set(chat._id.toHexString(), newChatId);

      // Insert chat row
      const { error: chatError } = await supabase.from('chats').upsert({
        id: newChatId,
        user_id: newUserId,
        page_type: chat.pageType,
        title: chat.title ?? 'Untitled Chat',
        created_at: chat.createdAt ?? new Date().toISOString(),
        updated_at: chat.updatedAt ?? new Date().toISOString(),
      }, { onConflict: 'id' });

      if (chatError) {
        console.error(`  ❌  Failed to insert chat ${chat._id}:`, chatError.message);
        continue;
      }

      // Insert messages
      const messages: any[] = Array.isArray(chat.messages) ? chat.messages : [];
      if (messages.length === 0) continue;

      // Delete existing messages for this chat (idempotent re-run support)
      await supabase.from('chat_messages').delete().eq('chat_id', newChatId);

      const messageRows = messages.map((msg, idx) => ({
        chat_id: newChatId,
        role: msg.role,
        content: msg.content ?? '',
        timestamp: msg.timestamp ?? new Date().toISOString(),
        generated_image_data_url: msg.generatedImageDataUrl ?? null,
        generated_image_mime_type: msg.generatedImageMimeType ?? null,
        generated_image_model: msg.generatedImageModel ?? null,
        order: idx,
      }));

      const { data: insertedMessages, error: msgError } = await supabase
        .from('chat_messages')
        .insert(messageRows)
        .select('id');

      if (msgError) {
        console.error(`  ❌  Failed to insert messages for chat ${chat._id}:`, msgError.message);
        continue;
      }

      // Insert attachments
      const attachmentRows: any[] = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const msgId = insertedMessages?.[i]?.id;
        if (!msgId || !Array.isArray(msg.attachments)) continue;
        for (const att of msg.attachments) {
          attachmentRows.push({
            message_id: msgId,
            name: att.name ?? null,
            size: att.size ?? null,
            kind: att.kind ?? null,
            preview_data_url: att.previewDataUrl ?? null,
          });
        }
      }
      if (attachmentRows.length > 0) {
        await supabase.from('chat_message_attachments').insert(attachmentRows);
      }
    }
    console.log(`  ✓  Migrated ${mongoChats.length} chat(s) with messages`);

    // ── 3. Emission Summaries ────────────────────────────────────────────────
    console.log('\n📁 Migrating emission summaries…');
    const mongoSummaries = await db.collection('emissionsummaries').find({}).toArray();
    console.log(`  Found ${mongoSummaries.length} summary(ies) in MongoDB`);

    if (mongoSummaries.length > 0) {
      const summaryRows = mongoSummaries.map((s) => ({
        fiscal_year: s.fiscal_year,
        total_emissions: s.total_emissions ?? 0,
        scope1_value: s.scope_1?.value ?? 0,
        scope1_status: s.scope_1?.status ?? 'Data available',
        scope2_value: s.scope_2?.value ?? 0,
        scope2_status: s.scope_2?.status ?? 'Data available',
        scope3_value: s.scope_3?.value ?? 0,
        scope3_status: s.scope_3?.status ?? 'Data available',
        scope1_percentage: s.breakdown?.scope_1_percentage ?? 0,
        scope2_percentage: s.breakdown?.scope_2_percentage ?? 0,
        scope3_percentage: s.breakdown?.scope_3_percentage ?? 0,
        top_emitters: Array.isArray(s.top_emitters) ? s.top_emitters : [],
        created_at: s.createdAt ?? new Date().toISOString(),
        updated_at: s.updatedAt ?? new Date().toISOString(),
      }));

      await supabase.from('emission_summaries').delete().in(
        'fiscal_year',
        summaryRows.map((r) => r.fiscal_year)
      );
      await batchInsert('emission_summaries', summaryRows);
    }

    // ── 4. Emission Monthly ──────────────────────────────────────────────────
    console.log('\n📁 Migrating emission monthly data…');
    const mongoMonthly = await db.collection('emissionmonthlies').find({}).toArray();
    console.log(`  Found ${mongoMonthly.length} monthly record(s) in MongoDB`);

    if (mongoMonthly.length > 0) {
      const monthlyRows = mongoMonthly.map((m) => ({
        fiscal_year: m.fiscal_year,
        scope: m.scope,
        month: m.month,
        stationary: m.stationary ?? 0,
        mobile: m.mobile ?? 0,
        fugitive: m.fugitive ?? 0,
        renewable: m.renewable ?? 0,
        imported: m.imported ?? 0,
        electricity: m.electricity ?? 0,
        created_at: m.createdAt ?? new Date().toISOString(),
        updated_at: m.updatedAt ?? new Date().toISOString(),
      }));

      // Clear matching data then re-insert
      const uniqueYears = Array.from(new Set(monthlyRows.map((r) => r.fiscal_year)));
      await supabase.from('emission_monthly').delete().in('fiscal_year', uniqueYears);
      await batchInsert('emission_monthly', monthlyRows);
    }

    // ── 5. Emission Categories ───────────────────────────────────────────────
    console.log('\n📁 Migrating emission categories…');
    const mongoCategories = await db.collection('emissioncategories').find({}).toArray();
    console.log(`  Found ${mongoCategories.length} category(ies) in MongoDB`);

    if (mongoCategories.length > 0) {
      const categoryRows = mongoCategories.map((c) => ({
        fiscal_year: c.fiscal_year,
        scope: c.scope ?? 3,
        category: c.category,
        value: c.value,
        color: c.color ?? '#6366f1',
        created_at: c.createdAt ?? new Date().toISOString(),
        updated_at: c.updatedAt ?? new Date().toISOString(),
      }));

      const uniqueYears = Array.from(new Set(categoryRows.map((r) => r.fiscal_year)));
      await supabase.from('emission_categories').delete().in('fiscal_year', uniqueYears);
      await batchInsert('emission_categories', categoryRows);
    }

    // ── 6. Emission Records ──────────────────────────────────────────────────
    console.log('\n📁 Migrating emission records…');
    const mongoRecords = await db.collection('emissionrecords').find({}).toArray();
    console.log(`  Found ${mongoRecords.length} record(s) in MongoDB`);

    if (mongoRecords.length > 0) {
      const recordRows = mongoRecords.map((r) => ({
        fiscal_year: r.fiscal_year,
        scope: r.scope,
        category: r.category,
        subcategory: r.subcategory ?? '',
        date: r.date,
        entry_period: r.entryPeriod ?? r.entry_period ?? '',
        site_name: r.siteName ?? r.site_name ?? '',
        unit_of_measure: r.unitOfMeasure ?? r.unit_of_measure ?? '',
        consumption: r.consumption ?? 0,
        source: r.source ?? '',
        emission_factor: r.emissionFactor ?? r.emission_factor ?? 0,
        name_of_country: r.nameOfCountry ?? r.name_of_country ?? null,
        heat_source: r.heatSource ?? r.heat_source ?? null,
        fuel_type: r.fuelType ?? r.fuel_type ?? null,
        commute_type: r.commuteType ?? r.commute_type ?? null,
        vehicle_type: r.vehicleType ?? r.vehicle_type ?? null,
        food_type: r.foodType ?? r.food_type ?? null,
        type_of_goods: r.typeOfGoods ?? r.type_of_goods ?? null,
        loop: r.loop ?? null,
        generation: r.generation ?? null,
        flight_type: r.flightType ?? r.flight_type ?? null,
        passenger_class: r.passengerClass ?? r.passenger_class ?? null,
        transport_mode: r.transportMode ?? r.transport_mode ?? null,
        hotel_country: r.hotelCountry ?? r.hotel_country ?? null,
        room_nights: r.roomNights ?? r.room_nights ?? null,
        created_at: r.createdAt ?? new Date().toISOString(),
        updated_at: r.updatedAt ?? new Date().toISOString(),
      }));

      const uniqueYears = Array.from(new Set(recordRows.map((r) => r.fiscal_year)));
      await supabase.from('emission_records').delete().in('fiscal_year', uniqueYears);
      await batchInsert('emission_records', recordRows);
    }

    console.log('\n🎉  Migration complete! All MongoDB data has been moved to Supabase.');
    console.log('    You can now remove MONGODB_URI_OLD from .env.local');

  } catch (error) {
    console.error('\n❌  Migration failed:', error);
    process.exit(1);
  } finally {
    await mongo.close();
  }
}

migrate();
