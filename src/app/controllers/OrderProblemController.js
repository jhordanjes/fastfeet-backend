import DeliveryProblem from '../models/Delivery_problem';
import Order from '../models/Order';

class OrderProbleController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: { order_id: req.params.order_id },
    });
    return res.json(problems);
  }

  async store(req, res) {
    const order = await Order.findByPk(req.params.order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order not exists' });
    }

    req.body.order_id = req.params.order_id;
    const problem = await DeliveryProblem.create(req.body);
    return res.json(problem);
  }
}

export default new OrderProbleController();
