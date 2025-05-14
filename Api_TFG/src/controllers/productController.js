const Product = require("../models/Product");

/**
 * Crea un nuevo producto
 */
exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    // Comprobamos si se ha subido la imagen
    if (!req.file) {
      return res.status(400).json({ msg: "La imagen es obligatoria" });
    }

    // Ruta de la imagen subida
    const imagen = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    if (!nombre || !descripcion || !precio || !stock) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const nuevoProducto = new Product({ nombre, descripcion, precio, stock, imagen });
    await nuevoProducto.save();
    res.status(201).json({ msg: "Producto creado con éxito", producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};


/**
 * Obtiene todos los productos
 */
exports.getAllProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Obtiene un producto por su ID
 */
exports.getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Actualiza un producto
 */
exports.updateProduct = async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoActualizado) return res.status(404).json({ msg: "Producto no encontrado" });
    res.json({ msg: "Producto actualizado", producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Elimina un producto
 */
exports.deleteProduct = async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
