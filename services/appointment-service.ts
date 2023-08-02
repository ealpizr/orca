import { Appointment } from "~/types";

export default class AppointmentService {
  static getAvailableAppointments(
    id: number,
    serviceCode: number,
    specialtyCode: number,
    serviceSpecialtyCode: number,
    date: string
  ): Promise<Appointment[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/appointments?id=${id}&serviceCode=${serviceCode}&specialtyCode=${specialtyCode}&serviceSpecialtyCode=${serviceSpecialtyCode}&date=${date}`
        );

        if (response.status !== 200) {
          throw new Error();
        }

        const body: Appointment[] = await response.json();

        resolve(body);
      } catch (e) {
        console.error(e);
        reject(new Error("Error al obtener cupos"));
      }
    });
  }

  static bookAppointment(
    id: number,
    user: string,
    serviceSpecialtyCode: number,
    date: string,
    appointment: Appointment
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            user,
            serviceSpecialtyCode,
            date,
            appointment,
          }),
        });

        if (response.status !== 200) {
          throw new Error();
        }

        resolve();
      } catch (e) {
        reject(new Error("Error al registrar la cita"));
      }
    });
  }
}
