import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
    otp: number;
    email: string;
    isUsed: boolean;
    expiredAt: Date;
}

const OtpSchema: Schema = new Schema({
    otp: {
        type: Number,
        required: true,
        validate: {
            validator: function (v: number) {
                return /^\d{6}$/.test(String(v));
            },
            message: (props) => `${props.value} is not a valid OTP! OTP must be a 6-digit number.`,
        },
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiredAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
}, { timestamps: true });

OtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model<IOtp>('Otp', OtpSchema);

export default OtpModel;