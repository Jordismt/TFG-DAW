const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
/**
 * Obtiene el carrito del usuario autenticado
 */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id }).populate("items.product_id");
    res.json(cart || { items: [], total: 0 });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el carrito", error });
  }
};

/**
 * Agrega un producto al carrito
 */
exports.addToCart = async (req, res) => {
  try {
    const { product_id, cantidad } = req.body;

    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ user_id: req.user.id });

    // Si no existe, crear uno nuevo
    if (!cart) {
      cart = new Cart({ user_id: req.user.id, items: [], total: 0 });
    }

    // Buscar el producto para obtener su precio
    const producto = await Product.findById(product_id);

    const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);

    if (itemIndex > -1) {
      // Si ya existe el producto en el carrito, se actualiza la cantidad
      cart.items[itemIndex].cantidad += cantidad;
    } else {
      // Si no existe, se agrega al carrito
      cart.items.push({ product_id, cantidad });
    }

    // 🔥 **Nuevo cálculo del total** (precio * cantidad para cada producto)
    cart.total = cart.items.reduce((sum, item) => {
      const precioProducto = item.product_id.precio || producto.precio;
      return sum + (precioProducto * item.cantidad);
    }, 0);

    await cart.save();
    res.json({ msg: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar al carrito", error });
  }
};

/**
 * Vacía el carrito
 */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user_id: req.user.id });
    res.json({ msg: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al vaciar el carrito", error });
  }
};
exports.finalizarCompra = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id }).populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    // Validar stock
    for (const item of cart.items) {
      if (item.cantidad > item.product_id.stock) {
        return res.status(400).json({
          msg: `No hay suficiente stock de ${item.product_id.nombre}. Stock disponible: ${item.product_id.stock}`,
        });
      }
    }

    // Si hay stock suficiente, actualizamos los productos
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product_id._id, {
        $inc: { stock: -item.cantidad }
      });
    }

    // Vaciar el carrito
    await Cart.findOneAndDelete({ user_id: req.user.id });

    res.json({ msg: "Compra finalizada con éxito." });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ msg: "Error al finalizar la compra", error });
  }
};

exports.finalizarCompra = async (req, res) => {
  try {
    const userId = req.user.id;
    const { direccion_envio, metodo_pago } = req.body;

    if (
      !direccion_envio ||
      !direccion_envio.calle ||
      !direccion_envio.ciudad ||
      !direccion_envio.codigo_postal ||
      !direccion_envio.pais ||
      !metodo_pago
    ) {
      return res.status(400).json({ msg: "Faltan datos completos de envío o método de pago." });
    }
    

    const cart = await Cart.findOne({ user_id: userId }).populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    // Validación de stock
    for (const item of cart.items) {
      if (item.cantidad > item.product_id.stock) {
        return res.status(400).json({ msg: `Stock insuficiente para el producto ${item.product_id.nombre}` });
      }
    }

    const total = cart.items.reduce((sum, item) => sum + item.product_id.precio * item.cantidad, 0);

    const newOrder = new Order({
      user_id: userId,
      productos: cart.items.map(item => ({
        product_id: item.product_id._id,
        cantidad: item.cantidad
      })),
      total,
      direccion_envio,
      metodo_pago,
      historial_estados: [{ estado: "pendiente" }]
    });

    await newOrder.save();

    // Actualiza stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product_id._id, {
        $inc: { stock: -item.cantidad }
      });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ msg: "Orden creada con éxito", order: newOrder });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ msg: "Error al finalizar la compra", error });
  }
};
