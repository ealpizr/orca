import { Service, Specialty } from "~/types";

export default class DataService {
  static getServices(
    token: string,
    healthCenterCode: number
  ): Promise<Service[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            healthCenterCode,
          }),
        });

        if (response.status !== 200) {
          throw new Error();
        }

        const body: Service[] = await response.json();

        resolve(body);
      } catch (e) {
        console.error(e);
        reject(new Error("Could not fetch health center services"));
      }
    });
  }

  static getSpecialties(
    token: string,
    healthCenterCode: number,
    serviceCode: number
  ): Promise<Specialty[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/specialties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            healthCenterCode,
            serviceCode,
          }),
        });

        if (response.status !== 200) {
          throw new Error();
        }

        const body: Specialty[] = await response.json();

        resolve(body);
      } catch (e) {
        console.error(e);
        reject(new Error("Could not fetch health center specialties"));
      }
    });
  }
}
