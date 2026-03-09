import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  generatedImageDataUrl: { type: String },
  generatedImageMimeType: { type: String },
  generatedImageModel: { type: String },
  attachments: [{
    name: String,
    size: Number,
    kind: { type: String, enum: ['image', 'document'] },
    previewDataUrl: String,
  }],
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pageType: { type: String, enum: ['dashboard', 'ghg-report'], required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

chatSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
