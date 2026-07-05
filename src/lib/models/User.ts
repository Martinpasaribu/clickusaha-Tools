import mongoose, { Schema, Document } from 'mongoose';
import type { UserSchema } from '@/types/schema'; // Sesuaikan path ke file types Anda

export interface IUser extends Omit<UserSchema, '_id'>, Document {}

export const UserSchema02: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { 
      type: String, 
      required: true, 
      enum: ['TUKANG', 'ADMIN', 'OWNER', 'SUPERVISOR'],
      default: 'TUKANG' 
    },
  },
  {
    // Hanya mengaktifkan pembuatan otomatis properti createdAt
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Parameter ketiga 'users' mengunci target nama collection di MongoDB
// const User = mongoose.models.User || mongoose.model<IUser>('users', UserSchema, 'users');

// export default User;