import { TOPIC_CATEGORIES } from '../../../../packages/shared-types/src/topic.types';
import type { Category } from '../../../../packages/shared-types/src/topic.types';
import { deleteFromCloudinary } from './upload.service';
import { getCloudinaryPublicId } from '../config/cloudinary';
import Topic from '../models/Topic.model';
import mongoose from 'mongoose';

export const getAllTopics = async (
  userId?: string,
  category?: string,
  search?: string,
  page: number = 1,
  limit: number = 20
) => {
  const query: any = {};

  if (category) query.category = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const totalTopics = await Topic.countDocuments(query);

  const topics = await Topic.find(query)
    .populate('author', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const topicsWithUserInfo = topics.map((topic) => ({
    ...topic,
    likesCount: topic.likes.length,
    isLikedByUser: userId ? topic.likes.some((id: any) => id.toString() === userId) : false,
  }));

  return {
    topics: topicsWithUserInfo,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalTopics / limit),
      totalTopics,
      limit,
      hasNextPage: page < Math.ceil(totalTopics / limit),
      hasPrevPage: page > 1,
    },
  };
};

export const getTopicsByUserId = async (
  authorId: string,
  requestingUserId?: string,
  page: number = 1,
  limit: number = 20
) => {
  if (!mongoose.isValidObjectId(authorId)) throw new Error('Invalid user ID');

  const query = { author: authorId };
  const skip = (page - 1) * limit;
  const totalTopics = await Topic.countDocuments(query);

  const topics = await Topic.find(query)
    .populate('author', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const topicsWithUserInfo = topics.map((topic) => ({
    ...topic,
    likesCount: topic.likes.length,
    isLikedByUser: requestingUserId 
      ? topic.likes.some((id: any) => id.toString() === requestingUserId) 
      : false,
  }));

  return {
    topics: topicsWithUserInfo,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalTopics / limit),
      totalTopics,
      limit,
      hasNextPage: page < Math.ceil(totalTopics / limit),
      hasPrevPage: page > 1,
    },
  };
};

export const getTopicById = async (topicId: string, userId?: string) => {
  if (!mongoose.isValidObjectId(topicId)) throw new Error('Invalid topic ID');

  const topic = await Topic.findById(topicId)
    .populate('author', 'username fullName profilePicture')
    .lean();

  if (!topic) throw new Error('Topic not found');

  return {
    ...topic,
    likesCount: topic.likes.length,
    isLikedByUser: userId ? topic.likes.some((id: any) => id.toString() === userId) : false,
  };
};

export const createTopic = async (
  topicData: { title: string; content: string; category: Category; images?: string[] },
  userId: string
) => {
  const topic = await Topic.create({
    ...topicData,
    author: userId,
  });

  await topic.populate('author', 'username fullName profilePicture');
  return topic;
};

export const updateTopic = async (
  topicId: string,
  updateData: { title?: string; content?: string; category?: Category; images?: string[] },
  userId: string
) => {
  if (!mongoose.isValidObjectId(topicId)) throw new Error('Invalid topic ID');

  const topic = await Topic.findById(topicId);
  if (!topic) throw new Error('Topic not found');

  if (topic.author.toString() !== userId) {
    throw new Error('Not authorized to update this topic');
  }

  if (updateData.images && Array.isArray(updateData.images)) {
    if (Array.isArray(topic.images) && topic.images.length) {
      await Promise.all(
        topic.images.map(async (url: string) => {
          const publicId = getCloudinaryPublicId(url);
          if (publicId) {
            try {
              await deleteFromCloudinary(publicId);
            } catch {}
          }
        })
      );
    }

    topic.images = updateData.images;
  }

  if (typeof updateData.title === 'string') topic.title = updateData.title;
  if (typeof updateData.content === 'string') topic.content = updateData.content;

  if (
    typeof updateData.category === 'string' &&
    TOPIC_CATEGORIES.includes(updateData.category as Category)
  ) {
    topic.category = updateData.category as Category;
  }

  await topic.save();
  await topic.populate('author', 'username fullName profilePicture');
  return topic;
};

export const deleteTopic = async (topicId: string, userId: string) => {
  if (!mongoose.isValidObjectId(topicId)) throw new Error('Invalid topic ID');

  const topic = await Topic.findById(topicId);
  if (!topic) throw new Error('Topic not found');

  if (topic.author.toString() !== userId) {
    throw new Error('Not authorized to delete this topic');
  }

  if (Array.isArray(topic.images) && topic.images.length) {
    await Promise.all(
      topic.images.map(async (url: string) => {
        const publicId = getCloudinaryPublicId(url);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch {}
        }
      })
    );
  }

  await topic.deleteOne();
};

export const likeTopic = async (topicId: string, userId: string) => {
  if (!mongoose.isValidObjectId(topicId)) throw new Error('Invalid topic ID');

  const topic = await Topic.findById(topicId);
  if (!topic) throw new Error('Topic not found');

  const alreadyLiked = topic.likes.some((id: any) => id.toString() === userId);
  if (alreadyLiked) throw new Error('Topic already liked');

  topic.likes.push(new mongoose.Types.ObjectId(userId));
  await topic.save();

  return { message: 'Topic liked', likesCount: topic.likes.length };
};

export const unlikeTopic = async (topicId: string, userId: string) => {
  if (!mongoose.isValidObjectId(topicId)) throw new Error('Invalid topic ID');

  const topic = await Topic.findById(topicId);
  if (!topic) throw new Error('Topic not found');

  topic.likes = topic.likes.filter((id: any) => id.toString() !== userId);
  await topic.save();

  return { message: 'Topic unliked', likesCount: topic.likes.length };
};
