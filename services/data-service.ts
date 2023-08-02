import { Service, Specialty } from "~/types";

export default class DataService {
  static getServices(healthCenterCode: number): Promise<Service[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/services?healthCenterCode=${healthCenterCode}`
        );
        if (response.status !== 200) {
          throw new Error();
        }

        const body: Service[] = await response.json();

        resolve(body);
      } catch (e) {
        reject(new Error("Error al obtener servicios"));
      }
    });
  }

  static getSpecialties(
    healthCenterCode: number,
    serviceCode: number
  ): Promise<Specialty[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/specialties?healthCenterCode=${healthCenterCode}&serviceCode=${serviceCode}`
        );

        if (response.status !== 200) {
          throw new Error();
        }

        const body: Specialty[] = await response.json();

        resolve(body);
      } catch (e) {
        reject(new Error("Error al obtener especialidades"));
      }
    });
  }
}
