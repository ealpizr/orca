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

  // TODO: move to server
  static bookAppointment(
    userId: number,
    serviceSpecialtyCode: number,
    date: string,
    appointment: Appointment,
    token: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = new URL("https://edus.ccss.sa.cr/ccssmovilcitas");
        url.searchParams.set("tipoIdentificacion", "0");
        url.searchParams.set("numIdentificacion", userId.toString());
        url.searchParams.set(
          "codServicioEspecialidad",
          serviceSpecialtyCode.toString()
        );
        url.searchParams.set("fechaSeleccionada", date);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            tokenAccesoAPI: token,
          },
          body: JSON.stringify(appointment),
        });

        if (response.status !== 200) {
          throw new Error();
        }

        resolve();
      } catch (e) {
        console.error(e);
        reject(new Error("Could not register appointment"));
      }
    });
  }
}
