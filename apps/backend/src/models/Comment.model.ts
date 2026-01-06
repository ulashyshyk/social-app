import mongoose, { Schema, Types } from 'mongoose';

export interface IComment {
    _id: Types.ObjectId;
    content: string;
    topic: Types.ObjectId;
    author: Types.ObjectId;
    parentComment?: Types.ObjectId | null;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
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
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        likesCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
)

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;