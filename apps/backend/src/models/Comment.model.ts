import mongoose, { Schema, Types } from 'mongoose';

export interface IComment {
    _id: Types.ObjectId;
    content: string;
    topic: Types.ObjectId;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
         content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
)

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;