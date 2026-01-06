import mongoose , { Schema, Types } from 'mongoose';

export interface ICommentLike {
    _id: Types.ObjectId;
    comment: Types.ObjectId;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentLikeSchema = new Schema<ICommentLike>(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

CommentLikeSchema.index({ comment: 1, user: 1 }, { unique: true });

const CommentLike = mongoose.model<ICommentLike>('CommentLike', CommentLikeSchema);
export default CommentLike;