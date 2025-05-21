const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Crea una nueva orden
 */
exports.createOrder = async (req, res) => {
  try {
    const { productos, total, direccion_envio, metodo_pago, notas } = req.body;

    for (const item of productos) {
      const product = await Product.findById(item.product_id);
      if (!product || product.stock < item.cantidad) {
        return res.status(400).json({ msg: `Stock insuficiente para el producto ${item.product_id}` });
      }
    }

    const newOrder = new Order({
      user_id: req.user.id,
      productos,
      total,
      direccion_envio,
      metodo_pago,
      notas,
      historial_estados: [{ estado: "pendiente" }]
    });

    await newOrder.save();

    for (const item of productos) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.cantidad },
      });
    }

    res.status(201).json({ msg: "Orden creada con éxito", order: newOrder });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la orden", error });
  }
};


/**
 * Obtiene todas las órdenes (admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "nombre email")
      .populate("productos.product_id", "nombre precio");
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
    const orders = await Order.find({ user_id: req.user.id })
      .populate("productos.product_id", "nombre precio imagen")
      .sort({ createdAt: -1 }); // Ordenar por fecha descendente
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tus órdenes", error });
  }
};

/**
 * Actualiza el estado de una orden (admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const { orderId } = req.params;

    if (!["pendiente", "pagado", "enviado", "completado", "cancelado", "rechazado", "reembolsado"].includes(estado)) {
      return res.status(400).json({ msg: "Estado no válido" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { estado }, $push: { historial_estados: { estado } } },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ msg: "Orden no encontrada" });

    res.json({ msg: "Orden actualizada con éxito", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la orden", error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order || order.estado !== "pendiente") {
      return res.status(400).json({ msg: "La orden no puede ser cancelada" });
    }

    order.estado = "cancelado";
    order.historial_estados.push({ estado: "cancelado" });

    await order.save();
    res.json({ msg: "Orden cancelada con éxito", order });
  } catch (error) {
    res.status(500).json({ msg: "Error al cancelar la orden", error });
  }
};
