const orderModel = require("../models/orderModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");

module.exports = async function getData(req, res) {
  try {
    const { page = 1, limit = 25, filterField, filterValue } = req.query;

    const offset = (page - 1) * limit;

    // Construct the where clause based on the filter parameters
    const whereClause = {};
    if (filterField && filterValue) {
      whereClause[filterField] = filterValue;
    }

    const data = await orderModel.findAll({
      where: whereClause,
      offset: offset,
      limit: limit * 1,
    });

    // Generate a unique ID for the CSV file
    const fileId = uuidv4();
    const csvFilePath = `./uploads/${fileId}.csv`;

    // Extract header from the first instance in the data array
    const header = data.length > 0 ? Object.keys(data[0].get()) : [];

    // Write data to CSV file
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: header.map(column => ({ id: column, title: column })), // Ensure header is in the correct format
    });

    await csvWriter.writeRecords(data.map(instance => instance.get()));

    res.json({
      fileId: fileId,
      message: "Data saved to CSV",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
