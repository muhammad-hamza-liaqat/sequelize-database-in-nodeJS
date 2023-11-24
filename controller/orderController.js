const Sequelize = require('sequelize');
const orderModel = require("../models/orderModel");

module.exports = async function getOrderData(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const data = await orderModel.findAll({
      where: {
        orderDate: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.send(data);
  } catch (error) {
    console.error('Sequelize query error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// http://localhost:3000/orders/getdata?startDate=2003-01-01&endDate=2003-03-31 => api end point