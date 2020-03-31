import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';
import OrderProblemController from './app/controllers/OrderProblemController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryController from './app/controllers/DeliveryController';
import SessionController from './app/controllers/SessionController';
import OrderController from './app/controllers/OrderController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put('/deliveryman/:id/deliveries', DeliveryController.update);

routes.post('/delivery/:order_id/problems', OrderProblemController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/problems', DeliveryProblemController.index);

routes.get('/delivery/:id/problems', OrderProblemController.index);

routes.delete('/problem/:id/cancel-delivery', CancelDeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files/:id', FileController.show);

export default routes;
