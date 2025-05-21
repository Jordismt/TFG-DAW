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
