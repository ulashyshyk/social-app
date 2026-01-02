import mongoose from 'mongoose';
import User from '../models/User.model';
import type { AuthenticatedUser, PublicUserProfile, UpdateProfileRequest } from '../../../../packages/shared-types/src/user.types'

const ME_FIELDS = "_id username email fullName bio profilePicture createdAt updatedAt";
const PUBLIC_FIELDS = "_id username fullName bio profilePicture createdAt";

function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

async function getMe(userId: string): Promise<AuthenticatedUser> {
    if (!isValidObjectId(userId)) throw new Error('Invalid userId');

    const user = await User.findById(userId).select(ME_FIELDS).lean();
    if (!user) throw new Error('User not found');

    return user as AuthenticatedUser;
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
    ).select(ME_FIELDS).lean();

    if (!updatedUser) throw new Error('User not found');

    return updatedUser as AuthenticatedUser;
}

async function getUserById(id: string): Promise<PublicUserProfile> {
    if (!isValidObjectId(id)) throw new Error('Invalid user id');

    const user = await User.findById(id).select(PUBLIC_FIELDS).lean();
    if (!user) throw new Error('User not found');

    return user as PublicUserProfile;
}

export { getMe, updateMe, getUserById };