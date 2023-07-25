import { z } from "zod";
import { loginSchema } from "~/schemas";
import { APIError, UserData } from "~/types";

export default class AuthService {
  static login(data: z.infer<typeof loginSchema>): Promise<UserData[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (response.status != 200) {
          return reject(new APIError("Credenciales inválidas"));
        }

        const body: { data: UserData[] } = await response.json();

        resolve(body.data);
      } catch (e) {
        reject(new Error("Ha ocurrido un error inesperado"));
      }
    });
  }
}
