import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as topicController from '../controllers/topic.controller';
import upload from "../middlewares/upload.middleware";

const router = Router();

// PUBLIC ROUTES
router.get('/', topicController.getAllTopics);
router.get('/:id', topicController.getTopicById);

// PROTECTED ROUTES
router.post("/", authMiddleware, upload.array("images", 5), topicController.createTopic);
router.put("/:id", authMiddleware, upload.array("images", 5), topicController.updateTopic);
router.delete('/:id', authMiddleware, topicController.deleteTopic);
router.post('/:id/like', authMiddleware, topicController.likeTopic);
router.delete('/:id/like', authMiddleware, topicController.unlikeTopic);

export default router;
