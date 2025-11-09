import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { 
  createBid, 
  getBidsByProduct, 
  getMyBids 
} from '../controllers/bids.controller.js';

const router = Router();

// Crear una nueva puja
router.post('/bids', authRequired, createBid);

// Obtener pujas de un producto específico
router.get('/bids/product/:productId', getBidsByProduct);

// Obtener mis pujas 
router.get('/my-bids', authRequired, getMyBids);

export default router;