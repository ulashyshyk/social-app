import mongoose, { Schema, Types } from 'mongoose';
import {
    NOTIFICATION_TYPES,
    ENTITY_TYPES
} from '../../../../packages/shared-types/src/notification.types';

import type {
    NotificationType,
    EntityType
} from '../../../../packages/shared-types/src/notification.types';

export interface INotification {
    _id: Types.ObjectId;
    recipient: Types.ObjectId;
    actor: Types.ObjectId;
    type: NotificationType;
    entityType: EntityType;
    entityId: Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema(
    {
        recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        },
        actor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        type: {
        type: String,
        required: true,
        enum: NOTIFICATION_TYPES,
        },
        entityType: {
        type: String,
        required: true,
        enum: ENTITY_TYPES,
        },
        entityId: {
        type: Schema.Types.ObjectId,
        required: true,
        },
        isRead: {
        type: Boolean,
        default: false,
        index: true,
        },
    },
    { timestamps: true }
);

NotificationSchema.index({ actor: 1, recipient: 1, entityId: 1, type: 1 }, { unique: true });
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;