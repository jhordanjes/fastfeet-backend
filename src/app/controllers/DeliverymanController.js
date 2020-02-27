import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, name } = req.body;
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Courier already exists' });
      }
    }

    deliveryman.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    await deliverymanExists.destroy();
    return res.status(200).json({ success: true });
  }
}

export default new DeliverymanController();
