import { Router } from 'express';
import * as searchController from '../controllers/search.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', optionalAuth, searchController.searchAll);
router.get('/topics', optionalAuth, searchController.searchTopics);
router.get('/users', optionalAuth, searchController.searchUsers);

export default router;
