import mongoose from 'mongoose';

const emissionSummarySchema = new mongoose.Schema({
  fiscal_year: { type: String, required: true, unique: true },
  total_emissions: { type: Number, required: true },
  scope_1: {
    value: { type: Number, required: true },
    status: { type: String, default: "Data available" }
  },
  scope_2: {
    value: { type: Number, required: true },
    status: { type: String, default: "Data available" }
  },
  scope_3: {
    value: { type: Number, required: true },
    status: { type: String, default: "Data available" }
  },
  breakdown: {
    scope_1_percentage: { type: Number, required: true },
    scope_2_percentage: { type: Number, required: true },
    scope_3_percentage: { type: Number, required: true }
  },
  top_emitters: [{ type: String }]
}, { timestamps: true });

export const EmissionSummary = mongoose.models.EmissionSummary || mongoose.model('EmissionSummary', emissionSummarySchema);
