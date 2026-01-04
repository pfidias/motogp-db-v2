import { model, models, Schema } from 'mongoose';

export type UserType = {
  _id?: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  image?: string | null | undefined;
};

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    role: { type: String, required: true, default: 'basic' },
    image: { type: String },
  },
  {
    collection: 'user',
  },
);

export const User = models.User || model('User', userSchema);
