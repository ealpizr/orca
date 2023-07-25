import { Appointment } from "~/types";

export default class AppointmentService {
  static getAvailableAppointments(
    token: string,
    id: number,
    serviceCode: number,
    specialtyCode: number,
    serviceSpecialtyCode: number,
    date: string
  ): Promise<Appointment[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            id,
            serviceCode,
            specialtyCode,
            serviceSpecialtyCode,
            date,
          }),
        });

        if (response.status !== 200) {
          throw new Error();
        }

        const body: Appointment[] = await response.json();

        resolve(body);
      } catch (e) {
        console.error(e);
        reject(new Error("Could not fetch available appointments"));
      }
    });
  }
}
