// apps/backend/src/services/comment.service.ts

import mongoose, { Types } from 'mongoose';
import Comment from '../models/Comment.model';
import CommentLike from '../models/CommentLike.model';
import Topic from '../models/Topic.model';

const AUTHOR_FIELDS = 'username fullName';

export const getCommentsByTopic = async (topicId: string, currentUserId?: string) => {
  if (!mongoose.isValidObjectId(topicId)) {
    const error = new Error('Invalid topic ID') as any;
    error.status = 400;
    throw error;
  }
  
  const topicExists = await Topic.exists({ _id: topicId });
  if (!topicExists) {
    const error = new Error('Topic not found') as any;
    error.status = 404;
    throw error;
  }

  const allComments = await Comment.find({ topic: topicId })
    .populate('author', AUTHOR_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  // FLATTEN replies under top-level (reply-to-reply → same level)
  const topLevelMap: Record<string, any> = {};
  const topLevel: any[] = [];

  allComments.forEach(comment => {
    let topLevelId = String(comment._id);
    
    // Find TOP-LEVEL ancestor for flattening
    let current = comment;
    while (current.parentComment) {
      const parentId = String(current.parentComment);
      const parentComment = allComments.find(c => String(c._id) === parentId);
      if (!parentComment) break;
      topLevelId = parentId;
      current = parentComment;
    }

    if (!topLevelMap[topLevelId]) {
      topLevelMap[topLevelId] = {
        ...comment,
        replies: []
      };
      topLevel.push(topLevelMap[topLevelId]);
    } else if (String(comment._id) !== topLevelId) {
      topLevelMap[topLevelId].replies.push(comment);
    }
  });

  // Instagram UI: first 2 replies + "View more"
  topLevel.forEach(comment => {
    comment.replies = comment.replies.slice(0, 2);
    comment.totalRepliesCount = allComments.filter(c => 
      String(c.parentComment) === String(comment._id)
    ).length;
    comment.hasMoreReplies = comment.replies.length < comment.totalRepliesCount;
  });

  // Add isLikedByCurrentUser for optimistic likes
  if (currentUserId) {
    const commentIds = allComments.map((c: any) => c._id);
    const userLikes = await CommentLike.find({
      comment: { $in: commentIds },
      user: currentUserId
    }).lean();

    const likedSet = new Set(userLikes.map((l: any) => String(l.comment)));
    allComments.forEach((c: any) => {
      const commentObj = topLevelMap[String(c._id)] || c;
      commentObj.isLikedByCurrentUser = likedSet.has(String(c._id));
    });
  }

  return topLevel;
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

export const createReply = async (parentCommentId: string, content: string, userId: string) => {
  if (!Types.ObjectId.isValid(parentCommentId)) {
    const error = new Error('Invalid comment ID') as any;
    error.status = 400;
    throw error;
  }

  const parent = await Comment.findById(parentCommentId).select('topic').lean();
  if (!parent) {
    const error = new Error('Comment not found') as any;
    error.status = 404;
    throw error;
  }

  //Any comment can have replies (reply-to-reply OK)
  return Comment.create({
    content,
    topic: parent.topic,     // copy from parent
    author: userId,
    parentComment: parentCommentId,
    likesCount: 0,
  });
};

export const likeComment = async (commentId: string, userId: string) => {
  if (!Types.ObjectId.isValid(commentId)) {
    const error = new Error('Invalid comment ID') as any;
    error.status = 400;
    throw error;
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found') as any;
    error.status = 404;
    throw error;
  }

  const existing = await CommentLike.findOne({ comment: comment._id, user: userId });
  if (existing) {
    return { justCreated: false, comment };
  }

  await CommentLike.create({ comment: comment._id, user: userId });
  comment.likesCount += 1;
  await comment.save();

  return { justCreated: true, comment };
};

export const unlikeComment = async (commentId: string, userId: string) => {
  if (!Types.ObjectId.isValid(commentId)) {
    const error = new Error('Invalid comment ID') as any;
    error.status = 400;
    throw error;
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found') as any;
    error.status = 404;
    throw error;
  }

  const deleted = await CommentLike.findOneAndDelete({ comment: comment._id, user: userId });
  if (deleted && comment.likesCount > 0) {
    comment.likesCount -= 1;
    await comment.save();
  }

  return comment;
};