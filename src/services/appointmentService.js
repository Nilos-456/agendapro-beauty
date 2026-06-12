const { Appointment } = require('../models');

class AppointmentService {
  // O Service assume a responsabilidade de interagir diretamente com o Model
  static async createBulkAppointments(appointmentsData) {
    return await Appointment.bulkCreate(appointmentsData);
  }
}

module.exports = AppointmentService;
