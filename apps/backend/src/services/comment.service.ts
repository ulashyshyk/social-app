// apps/backend/src/services/comment.service.ts

import mongoose from 'mongoose';
import Comment from '../models/Comment.model';
import Topic from '../models/Topic.model';

const AUTHOR_FIELDS = 'username fullName';

// Get all comments for a topic
export const getCommentsByTopic = async (topicId: string) => {
  if (!mongoose.isValidObjectId(topicId)) {
    throw new Error('Invalid topic ID');
  }

  // topic var mı?
  const topicExists = await Topic.exists({ _id: topicId });
  if (!topicExists) {
    throw new Error('Topic not found');
  }

  const comments = await Comment.find({ topic: topicId })
    .populate('author', AUTHOR_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  return comments;
};

export const createComment = async (topicId: string, content: string, userId: string) => {
  if (!mongoose.isValidObjectId(topicId)) {
    throw new Error('Invalid topic ID');
  }

  const topicExists = await Topic.exists({ _id: topicId });
  if (!topicExists) {
    throw new Error('Topic not found');
  }

  const comment = await Comment.create({
    content,
    topic: topicId,
    author: userId,
  });

  // commentsCount +1
  await Topic.updateOne({ _id: topicId }, { $inc: { commentsCount: 1 } });

  await comment.populate('author', AUTHOR_FIELDS);
  return comment;
};

// Update comment (only by author)
export const updateComment = async (commentId: string, content: string, userId: string) => {
  if (!mongoose.isValidObjectId(commentId)) {
    throw new Error('Invalid comment ID');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== userId) {
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content;
  await comment.save();

  await comment.populate('author', AUTHOR_FIELDS);
  return comment;
};

// Delete comment (only by author)
export const deleteComment = async (commentId: string, userId: string) => {
  if (!mongoose.isValidObjectId(commentId)) {
    throw new Error('Invalid comment ID');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== userId) {
    throw new Error('Not authorized to delete this comment');
  }

  const topicId = comment.topic.toString();

  await comment.deleteOne();

  // commentsCount -1
  await Topic.updateOne({ _id: topicId, commentsCount: { $gt: 0 } }, { $inc: { commentsCount: -1 } });
};
