import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class CancelDeliveryController {
  async delete(req, res) {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          attributes: ['email', 'name'],
        },
      ],
    });
    if (!order) {
      return res.status(401).json({ error: 'Order invalid' });
    }

    order.canceled_at = new Date();
    await order.save();
    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }
}

export default new CancelDeliveryController();
