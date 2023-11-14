import mongoose, { Document, Schema } from 'mongoose';

export interface IIMAGE extends Document {
  imageName: string;
  caption: string;
  created: Date;
  imageUrl?: string
}

const ImageSchema = new Schema<IIMAGE>({
  imageName: String,
  caption: String,
  created: { type: Date, default: Date.now },
});

export const ImageModel = mongoose.model<IIMAGE>('Note', ImageSchema);
