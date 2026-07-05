import mongoose, { Schema, Document } from 'mongoose';
import type { LogHistorySchema } from '@/types/schema';

export interface ILogHistory extends Omit<LogHistorySchema, '_id'>, Document {}

export const LogHistorySchema02: Schema = new Schema<ILogHistory>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'barang', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    code: { type: String, trim: true },
    type: { 
      type: String, 
      required: true, 
      enum: ["CPO", "UIQ", "URQ", "UPR", "UST", "UGL", "DEL", "CSP"] 
    },
    userRole: { 
      type: String, 
      required: true, 
      enum: ['TUKANG', 'ADMIN', 'OWNER', 'SUPERVISOR'] 
    },
    qty: { type: Number },
    changes: {
      before: { type: Schema.Types.Mixed, default: null }, // Menggunakan Mixed karena struktur datanya dinamis (Partial)
      after: { type: Schema.Types.Mixed, default: null }
    },
    description: { type: String, required: true },
    manualLogDate: { type: Date, required: true, default: Date.now }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Hanya butuh createdAt untuk pencatatan log logistik
  }
);

// const LogHistory = mongoose.models.LogHistory || mongoose.model<ILogHistory>('loghistory', LogHistorySchema02, 'log_histories');

// export default LogHistory;