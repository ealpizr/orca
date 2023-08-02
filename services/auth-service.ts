import { z } from "zod";
import { loginSchema } from "~/schemas";
import { UserData } from "~/types";

export default class AuthService {
  static async login(data: z.infer<typeof loginSchema>): Promise<UserData[]> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      throw new Error("Credenciales inválidas");
    }

    if (response.status !== 200) {
      throw new Error("Error al procesar la solicitud");
    }

    const body: { data: UserData[] } = await response.json();

    return body.data;
  }
}
