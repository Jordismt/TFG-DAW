const Order = require("../models/Order");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    // 📦 Total de pedidos
    const totalOrders = await Order.countDocuments();
    
    // 📅 Total de citas
    const totalAppointments = await Appointment.countDocuments();

    // 👥 Total de usuarios
    const totalUsers = await User.countDocuments();

    // 💰 Ingresos totales
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    // 📅 Pedidos por mes
    const ordersPerMonth = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalOrders,
      totalAppointments,
      totalUsers,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      ordersPerMonth,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ msg: "Error al obtener estadísticas", error });
  }
};

exports.buscarUsuarioConCitas = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ msg: "Debe proporcionar un nombre para buscar" });
    }

    // Buscar usuarios por nombre (parcial, sin distinción de mayúsculas/minúsculas)
    const usuarios = await User.find({
      nombre: { $regex: nombre, $options: "i" }
    }).select("-password");

    if (!usuarios.length) {
      return res.status(404).json({ msg: "No se encontraron usuarios" });
    }

    // Traer las citas de esos usuarios
    const resultados = await Promise.all(
      usuarios.map(async (usuario) => {
        const citas = await Appointment.find({ usuario_id: usuario._id })
          .populate("service_id", "nombre precio")
          .sort({ fecha: 1 });

        return {
          usuario,
          citas
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error("Error al buscar usuarios con citas:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
