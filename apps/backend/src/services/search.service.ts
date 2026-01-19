import Topic from '../models/Topic.model';
import User from '../models/User.model';
import { Types } from 'mongoose';

interface SearchResult {
  topics: any[];
  users: any[];
  hasMore: {
    topics: boolean;
    users: boolean;
  };
}

export const searchAll = async (
  query: string,
  userId: string | undefined,
  page: number = 1,
  limit: number = 10
): Promise<SearchResult> => {
  const skip = (page - 1) * limit;

  // Search topics with text search and relevance scoring
  const topicQuery = query 
    ? { $text: { $search: query } }
    : {};

  const topicProjection = query 
    ? { score: { $meta: 'textScore' } }
    : {};

  const topicSort = query 
    ? { score: { $meta: 'textScore' }, createdAt: -1 }
    : { createdAt: -1 };

  const [topics, topicsCount] = await Promise.all([
    Topic.find(topicQuery, topicProjection)
      .populate('author', 'username fullName profilePicture')
      .sort(topicSort as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Topic.countDocuments(topicQuery)
  ]);

  // Add isLiked field for authenticated users
  const topicsWithLikes = userId 
    ? topics.map(topic => ({
        ...topic,
        isLiked: topic.likes?.some((id: Types.ObjectId) => id.toString() === userId),
        likesCount: topic.likes?.length || 0
      }))
    : topics.map(topic => ({
        ...topic,
        isLiked: false,
        likesCount: topic.likes?.length || 0
      }));

  // Search users with REGEX (partial matching)
  let userQuery: any = {};
  if (query) {
    const regexPattern = new RegExp(query, 'i');
    userQuery = {
      $or: [
        { username: regexPattern },
        { fullName: regexPattern }
      ]
    };
  }
  
  if (userId) {
    userQuery._id = { $ne: userId };
  }

  console.log('🔍 User Query:', JSON.stringify(userQuery, null, 2));
  console.log('🔍 userId:', userId, 'Type:', typeof userId);

  const userProjection = { password: 0, refreshTokens: 0 };
  const userSort = { username: 1 }; // Alphabetical

  const [users, usersCount] = await Promise.all([
    User.find(userQuery, userProjection)
      .sort(userSort as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(userQuery)
  ]);
  console.log('🔍 Found users:', users.map(u => ({ id: u._id?.toString(), username: u.username })));  
  console.log('🔍 SearchAll - Query:', query, '| Topics:', topics.length, '| Users:', users.length);

  return {
    topics: topicsWithLikes,
    users,
    hasMore: {
      topics: topicsCount > skip + limit,
      users: usersCount > skip + limit
    }
  };
};


export const searchTopics = async (
  query: string,
  category: string | undefined,
  userId: string | undefined,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  // Build query with text search and optional category filter
  const searchQuery: any = {};
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category) {
    searchQuery.category = category;
  }

  const projection = query 
    ? { score: { $meta: 'textScore' } }
    : {};

  const sort = query 
    ? { score: { $meta: 'textScore' }, createdAt: -1 }
    : { createdAt: -1 };

  const [topics, total] = await Promise.all([
    Topic.find(searchQuery, projection)
      .populate('author', 'username fullName profilePicture')
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Topic.countDocuments(searchQuery)
  ]);

  const topicsWithLikes = userId 
    ? topics.map(topic => ({
        ...topic,
        isLiked: topic.likes?.some((id: Types.ObjectId) => id.toString() === userId),
        likesCount: topic.likes?.length || 0
      }))
    : topics.map(topic => ({
        ...topic,
        isLiked: false,
        likesCount: topic.likes?.length || 0
      }));

  return {
    topics: topicsWithLikes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: total > skip + limit
    }
  };
};

export const searchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  let searchQuery: any = {};
  
  if (query) {
    const regexPattern = new RegExp(query, 'i');
    searchQuery = {
      username: regexPattern  // Just username for now
    };
  }

  console.log('Search query:', query);
  console.log('Regex pattern:', searchQuery);

  const projection = { password: 0, refreshTokens: 0 };

  const [users, total] = await Promise.all([
    User.find(searchQuery, projection)
      .sort({ username: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(searchQuery)
  ]);

  console.log('Found users:', users.length);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: total > skip + limit
    }
  };
};
