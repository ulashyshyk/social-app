import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 160,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "",
        },
        // topics: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Topic",
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;