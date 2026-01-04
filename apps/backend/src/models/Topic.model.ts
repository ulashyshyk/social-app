import mongoose, { Schema, Types } from 'mongoose';
import { TOPIC_CATEGORIES } from '../../../../packages/shared-types/src/topic.types';
import type { Category } from '../../../../packages/shared-types/src/topic.types';

export interface ITopic {
  _id: Types.ObjectId;
  title: string;
  content: string;
  category: Category;
  images: string[];
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 5,
        message: 'You can upload up to 5 images.',
      },
    },
    category: {
      type: String,
      required: true,
      enum: TOPIC_CATEGORIES,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
export default Topic;
