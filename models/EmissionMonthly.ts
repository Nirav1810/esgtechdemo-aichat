import mongoose from 'mongoose';

const emissionMonthlySchema = new mongoose.Schema({
  fiscal_year: { type: String, required: true, index: true },
  scope: { type: Number, required: true, enum: [1, 2, 3] },
  month: { type: String, required: true },
  
  // Scope 1 fields
  stationary: { type: Number, default: 0 },
  mobile: { type: Number, default: 0 },
  fugitive: { type: Number, default: 0 },
  
  // Scope 2 fields
  renewable: { type: Number, default: 0 },
  imported: { type: Number, default: 0 },
  electricity: { type: Number, default: 0 }
}, { timestamps: true });

emissionMonthlySchema.index({ fiscal_year: 1, scope: 1, month: 1 }, { unique: true });

export const EmissionMonthly = mongoose.models.EmissionMonthly || mongoose.model('EmissionMonthly', emissionMonthlySchema);
