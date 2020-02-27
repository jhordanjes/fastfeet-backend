import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import DeliveryProblem from '../app/models/Delivery_problem';
import Deliveryman from '../app/models/Deliveryman';
import Recipient from '../app/models/Recipient';
import Order from '../app/models/Order';
import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, Recipient, File, Deliveryman, Order, DeliveryProblem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(
        model =>
          model && model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://192.168.99.100:27017/fastfeet',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
