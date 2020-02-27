import { startOfDay, endOfDay } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
    });
    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.string(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    const order = await Order.findByPk(req.body.order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order not exists' });
    }

    if (deliveryman.id !== order.deliveryman_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const parsedDate = new Date();

    const ordersDate = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (ordersDate.length > 5) {
      return res.status(401).json({ error: 'Withdrawal limit' });
    }

    await order.update(req.body);

    return res.json(order);
  }
}

export default new DeliveryController();
