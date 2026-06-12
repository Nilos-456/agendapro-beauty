const { Appointment } = require('../../models'); 

class AppointmentService {
  static async createBulkAppointments(appointmentsData) {
    // Garantindo que a variável appointmentsData está escrita perfeitamente sem espaços ocultos
    return await Appointment.bulkCreate(appointmentsData);
  }
}

module.exports = AppointmentService;

