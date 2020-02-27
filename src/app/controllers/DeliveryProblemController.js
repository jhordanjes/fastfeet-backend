import DeliveryProblem from '../models/Delivery_problem';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();
    return res.json(problems);
  }
}

export default new DeliveryProblemController();
