import { Schema, model, Document, Types } from "mongoose";

export interface IImportHistory extends Document {
    importId: string;
    userId: Types.ObjectId;
    status: 'in_progress' | 'processing_final_batch' | 'completed' | 'error';
    year: number;
    company: Types.ObjectId;
    branch: Types.ObjectId;
    total: number;
    created: number;
    updated: number;
    errorCount: number;
    errorDetails?: string;
    startTime: Date;
    endTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ImportHistorySchema = new Schema(
    {
        importId: {
            type: String,
            required: true,
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ['in_progress', 'processing_final_batch', 'completed', 'error'],
            default: 'in_progress'
        },
        year: {
            type: Number,
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
        branch: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
            required: true
        },
        total: {
            type: Number,
            default: 0
        },
        created: {
            type: Number,
            default: 0
        },
        updated: {
            type: Number,
            default: 0
        },
        errorCount: {
            type: Number,
            default: 0
        },
        errorDetails: {
            type: String
        },
        startTime: {
            type: Date,
            default: Date.now
        },
        endTime: {
            type: Date
        }
    },
    { timestamps: true }
);

// Índice compuesto para búsquedas eficientes por usuario y año
ImportHistorySchema.index({ userId: 1, year: 1 });

const ImportHistory = model<IImportHistory>("ImportHistory", ImportHistorySchema);

export default ImportHistory;
