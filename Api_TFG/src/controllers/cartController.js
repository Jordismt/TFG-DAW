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
    const { direccion_envio, metodo_pago, productos } = req.body;

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

    if (!productos || productos.length === 0) {
      return res.status(400).json({ msg: "No se especificaron productos para la compra." });
    }

    // Obtener carrito completo para poder actualizarlo luego
    const cart = await Cart.findOne({ user_id: userId }).populate("items.product_id");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    // Validar que los productos enviados estén en el carrito y validar stock
    for (const prod of productos) {
      const itemEnCarrito = cart.items.find(item => item.product_id._id.toString() === prod.product_id);
      if (!itemEnCarrito) {
        return res.status(400).json({ msg: `El producto ${prod.product_id} no está en el carrito.` });
      }
      if (prod.cantidad > itemEnCarrito.product_id.stock) {
        return res.status(400).json({ msg: `Stock insuficiente para el producto ${itemEnCarrito.product_id.nombre}` });
      }
    }

    // Calcular total solo de productos seleccionados
    const total = productos.reduce((sum, prod) => {
      const prodCarrito = cart.items.find(item => item.product_id._id.toString() === prod.product_id);
      return sum + prodCarrito.product_id.precio * prod.cantidad;
    }, 0);

    // Crear la orden solo con los productos seleccionados
    const newOrder = new Order({
      user_id: userId,
      productos: productos.map(p => ({
        product_id: p.product_id,
        cantidad: p.cantidad
      })),
      total,
      direccion_envio,
      metodo_pago,
      historial_estados: [{ estado: "pendiente" }]
    });

    await newOrder.save();

    // Actualizar stock solo para productos comprados
    for (const prod of productos) {
      await Product.findByIdAndUpdate(prod.product_id, { $inc: { stock: -prod.cantidad } });
    }

    // Eliminar del carrito solo los productos comprados
    cart.items = cart.items.filter(item => !productos.some(p => p.product_id === item.product_id._id.toString()));

    // Recalcular total del carrito restante
    cart.total = cart.items.reduce((sum, item) => sum + item.product_id.precio * item.cantidad, 0);

    await cart.save();

    res.status(201).json({ msg: "Orden creada con éxito", order: newOrder, carrito: cart });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ msg: "Error al finalizar la compra", error });
  }
};
