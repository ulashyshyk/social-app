import mongoose from 'mongoose';
import User, { IUser } from '../models/User.model';
import type { AuthenticatedUser, PublicUserProfile, UpdateProfileRequest } from '../../../../packages/shared-types/src/user.types'


const ME_FIELDS = "_id username email fullName bio profilePicture createdAt updatedAt";
const PUBLIC_FIELDS = "_id username fullName bio profilePicture createdAt";


function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}


async function getMe(userId: string): Promise<AuthenticatedUser> {
    if (!isValidObjectId(userId)) throw new Error('Invalid userId');

    const user = await User.findById(userId).select(ME_FIELDS).lean<AuthenticatedUser>();
    if (!user) throw new Error('User not found');

    return user;
}


async function updateMe(userId: string, data: UpdateProfileRequest): Promise<AuthenticatedUser> {
    if (!isValidObjectId(userId)) throw new Error('Invalid userId');

    const update: { fullName?: string; bio?: string; profilePicture?: string } = {};

    if(typeof data.fullName === 'string') update.fullName = data.fullName.trim();
    if(typeof data.bio === 'string') update.bio = data.bio.trim();
    if(typeof data.profilePicture === 'string') update.profilePicture = data.profilePicture.trim();

    if (Object.keys(update).length === 0) {
        throw new Error('No valid fields to update');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, runValidators: true}
    ).select(ME_FIELDS).lean<AuthenticatedUser>();

    if (!updatedUser) throw new Error('User not found');

    return updatedUser;
}


async function getUserById(id: string): Promise<PublicUserProfile> {
    if (!isValidObjectId(id)) throw new Error('Invalid user id');

    const user = await User.findById(id).select(PUBLIC_FIELDS).lean<PublicUserProfile>();
    if (!user) throw new Error('User not found');

    return user;
}

async function getUserByUsername(username: string): Promise<PublicUserProfile | null> {
    if (!username || typeof username !== 'string') {
        throw new Error('Invalid username');
    }

    const user = await User.findOne({ username })
        .select(PUBLIC_FIELDS)
        .lean<Omit<IUser, 'password' | 'email' | 'refreshTokens'>>();
    
    if (!user) return null;

    return {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        topicsCount: 0
    };
}

export { getMe, updateMe, getUserById, getUserByUsername };
