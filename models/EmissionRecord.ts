import mongoose from 'mongoose';

const emissionRecordSchema = new mongoose.Schema({
  fiscal_year: { type: String, required: true, index: true },
  scope: { type: Number, required: true, enum: [1, 2, 3] },
  category: { type: String, required: true },
  subcategory: { type: String, default: "" },
  
  // Common fields
  date: { type: String, required: true },
  entryPeriod: { type: String, required: true },
  siteName: { type: String, required: true },
  unitOfMeasure: { type: String, required: true },
  consumption: { type: Number, default: 0 },
  source: { type: String, default: "" },
  emissionFactor: { type: Number, default: 0 },
  
  // Optional fields based on type
  nameOfCountry: { type: String },
  heatSource: { type: String },
  fuelType: { type: String },
  commuteType: { type: String },
  vehicleType: { type: String },
  foodType: { type: String },
  typeOfGoods: { type: String },
  loop: { type: String },
  generation: { type: Number },
  flightType: { type: String },
  passengerClass: { type: String },
  transportMode: { type: String },
  hotelCountry: { type: String },
  roomNights: { type: Number }
}, { timestamps: true });

emissionRecordSchema.index({ fiscal_year: 1, scope: 1, category: 1 });

export const EmissionRecord = mongoose.models.EmissionRecord || mongoose.model('EmissionRecord', emissionRecordSchema);
