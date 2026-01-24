// models/FriendRequest.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true
    }
  },
  {
    timestamps: true 
  }
);

// Compound index for performance on queries
// FriendRequestSchema.index({ recipientId: 1, status: 1 });
// FriendRequestSchema.index({ requesterId: 1, status: 1 });

// Prevent duplicate requests
// FriendRequestSchema.index(
//   { requesterId: 1, recipientId: 1 }, 
//   { unique: true }
// );

// Validation: Can't friend yourself
FriendRequestSchema.pre('save', function(next) {
  if (this.requesterId.equals(this.recipientId)) {
    next(new Error('Cannot send friend request to yourself'));
  }
  next();
});

export const FriendRequest = mongoose.model<IFriendRequest>(
  'FriendRequest', 
  FriendRequestSchema
);
