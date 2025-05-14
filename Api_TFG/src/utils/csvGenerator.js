const fs = require("fs");
const { Parser } = require("json2csv");
const Appointment = require("../models/Appointment");

/**
 * Genera y descarga un archivo CSV con las citas del día
 */
exports.exportAppointmentsToCSV = async (req, res) => {
  try {
    // Obtener citas del día actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    const citas = await Appointment.find({ fecha: { $gte: hoy, $lt: mañana } }).populate("user_id", "nombre email");

    if (citas.length === 0) {
      return res.status(404).json({ msg: "No hay citas para exportar hoy" });
    }

    // Convertir a formato CSV
    const fields = ["user_id.nombre", "user_id.email", "fecha", "servicio", "estado"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(citas);

    // Guardar el archivo
    const filePath = `./citas_${hoy.toISOString().split("T")[0]}.csv`;
    fs.writeFileSync(filePath, csv);

    // Enviar archivo al cliente
    res.download(filePath, () => {
      fs.unlinkSync(filePath); // Borrar archivo después de enviarlo
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al exportar citas", error });
  }
};
