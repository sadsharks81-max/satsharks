import mongoose, { Document, Schema } from "mongoose";

export interface IVocabularyWord extends Document {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  frequency: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularyWordSchema = new Schema<IVocabularyWord>(
  {
    word: { type: String, required: true, trim: true, lowercase: true, unique: true },
    partOfSpeech: { type: String, required: true, trim: true },
    definition: { type: String, required: true, trim: true },
    example: { type: String, default: "", trim: true },
    synonyms: [{ type: String, trim: true }],
    frequency: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

VocabularyWordSchema.index({ isActive: 1, frequency: -1, word: 1 });

export default mongoose.model<IVocabularyWord>("VocabularyWord", VocabularyWordSchema);
