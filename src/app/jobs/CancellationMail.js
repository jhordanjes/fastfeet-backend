import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.Deliveryman.name} <${order.Deliveryman.email}>`,
      subject: 'Encomenda Cancelada',
      template: 'cancellation',
      context: {
        product: order.product,
        recipient: order.Recipient.name,
        deliveryman: order.Deliveryman.name,
      },
    });
  }
}

export default new CancellationMail();
