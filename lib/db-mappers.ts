/**
 * DB Mappers — convert Supabase snake_case rows to the shape the frontend expects
 * (preserving the same field names that were used with Mongoose).
 */

// ─── Chat ────────────────────────────────────────────────────────────────────

export function mapChatRow(row: any) {
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    pageType: row.page_type,
    title: row.title,
    messages: mapMessageRows(row.chat_messages),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessageRows(messages: any[] = []) {
  return [...messages]
    .sort((a, b) => a.order - b.order)
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      generatedImageDataUrl: msg.generated_image_data_url ?? undefined,
      generatedImageMimeType: msg.generated_image_mime_type ?? undefined,
      generatedImageModel: msg.generated_image_model ?? undefined,
      attachments: (msg.chat_message_attachments ?? []).map((att: any) => ({
        name: att.name,
        size: att.size,
        kind: att.kind,
        previewDataUrl: att.preview_data_url ?? undefined,
      })),
    }));
}

// ─── Emission Summary ────────────────────────────────────────────────────────

export function mapEmissionSummaryRow(row: any) {
  return {
    _id: String(row.id),
    fiscal_year: row.fiscal_year,
    total_emissions: row.total_emissions,
    scope_1: { value: row.scope1_value, status: row.scope1_status },
    scope_2: { value: row.scope2_value, status: row.scope2_status },
    scope_3: { value: row.scope3_value, status: row.scope3_status },
    breakdown: {
      scope_1_percentage: row.scope1_percentage,
      scope_2_percentage: row.scope2_percentage,
      scope_3_percentage: row.scope3_percentage,
    },
    top_emitters: row.top_emitters ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Emission Monthly ─────────────────────────────────────────────────────────

export function mapEmissionMonthlyRow(row: any) {
  return {
    _id: String(row.id),
    fiscal_year: row.fiscal_year,
    scope: row.scope,
    month: row.month,
    stationary: row.stationary,
    mobile: row.mobile,
    fugitive: row.fugitive,
    renewable: row.renewable,
    imported: row.imported,
    electricity: row.electricity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Emission Category ────────────────────────────────────────────────────────

export function mapEmissionCategoryRow(row: any) {
  return {
    _id: String(row.id),
    fiscal_year: row.fiscal_year,
    scope: row.scope,
    category: row.category,
    value: row.value,
    color: row.color,
    name: row.category, // legacy alias used by some frontend paths
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Emission Record ──────────────────────────────────────────────────────────

export function mapEmissionRecordRow(row: any) {
  return {
    _id: String(row.id),
    id: String(row.id),
    fiscal_year: row.fiscal_year,
    scope: row.scope,
    category: row.category,
    subcategory: row.subcategory,
    date: row.date,
    entryPeriod: row.entry_period,
    siteName: row.site_name,
    unitOfMeasure: row.unit_of_measure,
    consumption: row.consumption,
    source: row.source,
    emissionFactor: row.emission_factor,
    nameOfCountry: row.name_of_country ?? undefined,
    heatSource: row.heat_source ?? undefined,
    fuelType: row.fuel_type ?? undefined,
    commuteType: row.commute_type ?? undefined,
    vehicleType: row.vehicle_type ?? undefined,
    foodType: row.food_type ?? undefined,
    typeOfGoods: row.type_of_goods ?? undefined,
    loop: row.loop ?? undefined,
    generation: row.generation ?? undefined,
    flightType: row.flight_type ?? undefined,
    passengerClass: row.passenger_class ?? undefined,
    transportMode: row.transport_mode ?? undefined,
    hotelCountry: row.hotel_country ?? undefined,
    roomNights: row.room_nights ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Input → Supabase row (camelCase → snake_case) ───────────────────────────

export function emissionRecordToRow(data: any) {
  return {
    entry_period: data.entryPeriod ?? data.entry_period ?? '',
    site_name: data.siteName ?? data.site_name ?? '',
    unit_of_measure: data.unitOfMeasure ?? data.unit_of_measure ?? '',
    emission_factor: data.emissionFactor ?? data.emission_factor ?? 0,
    name_of_country: data.nameOfCountry ?? data.name_of_country ?? null,
    heat_source: data.heatSource ?? data.heat_source ?? null,
    fuel_type: data.fuelType ?? data.fuel_type ?? null,
    commute_type: data.commuteType ?? data.commute_type ?? null,
    vehicle_type: data.vehicleType ?? data.vehicle_type ?? null,
    food_type: data.foodType ?? data.food_type ?? null,
    type_of_goods: data.typeOfGoods ?? data.type_of_goods ?? null,
    flight_type: data.flightType ?? data.flight_type ?? null,
    passenger_class: data.passengerClass ?? data.passenger_class ?? null,
    transport_mode: data.transportMode ?? data.transport_mode ?? null,
    hotel_country: data.hotelCountry ?? data.hotel_country ?? null,
    room_nights: data.roomNights ?? data.room_nights ?? null,
    // pass-through fields
    fiscal_year: data.fiscal_year,
    scope: data.scope,
    category: data.category,
    subcategory: data.subcategory ?? '',
    date: data.date,
    consumption: data.consumption ?? 0,
    source: data.source ?? '',
    loop: data.loop ?? null,
    generation: data.generation ?? null,
  };
}
