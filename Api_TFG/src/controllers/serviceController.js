const Service = require("../models/Service");

/**
 * Crea un nuevo servicio (admin)
 */
exports.createService = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracion } = req.body;

    // Si se sube una imagen, multer manejará la carga y la imagen estará disponible en req.file
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;  // La URL de la imagen guardada

    const newService = new Service({
      nombre,
      descripcion,
      precio,
      duracion,
      imagen  // Guardamos la URL de la imagen
    });

    await newService.save();

    res.status(201).json({ msg: "Servicio creado", service: newService });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear el servicio", error });
  }
};

/**
 * Obtiene todos los servicios
 */
exports.getAllServices = async (req, res) => {
  try {
    const servicios = await Service.find();
    const serviciosConImagen = servicios.map(service => ({
      ...service.toObject(),
      imagen: service.imagen ? `http://localhost:5000${service.imagen}` : null, // Añadir la URL completa
    }));
    res.json(serviciosConImagen);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los servicios", error });
  }
};


/**
 * Elimina un servicio (admin)
 */
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el servicio", error });
  }
};

/**
 * Actualiza un servicio (admin)
 */
exports.updateService = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracion } = req.body;
    
    // Si se sube una nueva imagen, actualizamos la URL de la imagen
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Buscar el servicio por su ID y actualizar
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id, 
      { nombre, descripcion, precio, duracion, imagen: imagen || undefined },  // Si no hay imagen, no la actualizamos
      { new: true }  // Retornar el servicio actualizado
    );

    if (!updatedService) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    res.status(200).json({ msg: "Servicio actualizado", service: updatedService });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el servicio", error });
  }
};
/**
 * Obtiene un servicio por su ID
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    const serviceWithImage = {
      ...service.toObject(),
      imagen: service.imagen ? `http://localhost:5000${service.imagen}` : null, // Añadir la URL completa
    };

    res.json(serviceWithImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el servicio", error: error.message });
  }
};

