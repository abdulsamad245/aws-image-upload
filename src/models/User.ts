import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  password: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  _id: { type: String, default: uuidv4 },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);

