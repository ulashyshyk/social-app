import { Router } from 'express';
import * as searchController from '../controllers/search.controller';

const router = Router();

router.get('/', searchController.searchAll);
router.get('/topics', searchController.searchTopics);
router.get('/users', searchController.searchUsers);

export default router;
