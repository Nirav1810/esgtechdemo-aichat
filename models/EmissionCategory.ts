import mongoose from 'mongoose';

const emissionCategorySchema = new mongoose.Schema({
  fiscal_year: { type: String, required: true, index: true },
  scope: { type: Number, required: true, default: 3 },
  category: { type: String, required: true },
  value: { type: Number, required: true },
  color: { type: String, default: "#6366f1" }
}, { timestamps: true });

emissionCategorySchema.index({ fiscal_year: 1, category: 1 }, { unique: true });

export const EmissionCategory = mongoose.models.EmissionCategory || mongoose.model('EmissionCategory', emissionCategorySchema);
