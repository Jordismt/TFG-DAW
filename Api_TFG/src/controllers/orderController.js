const Order = require("../models/Order");

/**
 * Crea una nueva orden
 */
exports.createOrder = async (req, res) => {
  try {
    const { productos, total } = req.body;

    const newOrder = new Order({
      user_id: req.user.id,
      productos,
      total
    });

    await newOrder.save();
    res.status(201).json({ msg: "Orden creada", order: newOrder });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la orden", error });
  }
};

/**
 * Obtiene todas las órdenes (admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user_id", "nombre email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las órdenes", error });
  }
};

/**
 * Obtiene las órdenes del usuario autenticado
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tus órdenes", error });
  }
};
