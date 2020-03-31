import * as Yup from 'yup';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Queue from '../../lib/Queue';
import DeliveryMail from '../jobs/DeliveryMail';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'cep',
            'complement',
            'city',
            'state',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
	{
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(orders);
  }

  async show(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
    });

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient invalid' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman invalid' });
    }

    const order = await Order.create(req.body);
    await Queue.add(DeliveryMail.key, {
      order,
      deliveryman,
      recipient,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(401).json({ error: 'Order invalid' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const isRecipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!isRecipient) {
      return res.status(401).json({ error: 'Recipient invalid' });
    }

    const isDeliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!isDeliveryman) {
      return res.status(401).json({ error: 'Deliveryman invalid' });
    }

    const { id, product, start_date, end_date } = await order.update(req.body);
    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    await orderExists.destroy();

    return res.json();
  }
}

export default new OrderController();
