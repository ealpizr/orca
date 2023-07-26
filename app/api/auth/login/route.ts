import { NextResponse } from "next/server";
import { loginSchema } from "~/schemas";
import type { UserData } from "~/types";
import { parseParams } from "~/utils";

export async function POST(request: Request) {
  const schemaValidation = loginSchema.safeParse(await request.json());

  if (!schemaValidation.success) {
    return NextResponse.json(
      {
        status: 400,
        message: "Bad request",
        errors: schemaValidation.error.flatten().fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  const { id, password, token } = schemaValidation.data;

  const aissfaTokenResponse = await fetch(
    "https://aissfa.ccss.sa.cr/gestortoken/token?codigoSistema=APP-EDUS",
    {
      headers: {
        Authorization: "Basic YXBwLWVkdXM6YXBiM2R1c3VzM3I5OA==",
      },
    }
  );

  if (aissfaTokenResponse.status !== 200) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: "Could not fetch AISSFA token",
      },
      { status: 500 }
    );
  }

  const edusLoginResponse = await fetch(
    "https://edus.ccss.sa.cr/ccssmovilmiseservicios/iniciarsesion",
    {
      method: "POST",
      headers: {
        Authorization: await aissfaTokenResponse.text(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: parseParams({
        identificadorUsuario: id,
        clave: Buffer.from(password).toString("base64"),
        nombreMovil: "android",
        codigoSistema: "SCWB",
      }),
    }
  );

  if (edusLoginResponse.status === 500) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: "Could not log in to EDUS",
      },
      { status: 500 }
    );
  }

  if (edusLoginResponse.status !== 200) {
    return NextResponse.json(
      {
        status: 401,
        message: "Unauthorized",
        error: "Invalid credentials",
      },
      { status: 401 }
    );
  }

  const associatedIds = [id, ...(await fetchAssociatedUsers(id, token))];

  const userData = await Promise.all(
    associatedIds.map(async (id) => await fetchUserData(id, token))
  );

  return NextResponse.json({
    status: 200,
    message: "OK",
    data: userData,
  });
}

async function fetchAssociatedUsers(
  id: number,
  token: string
): Promise<number[]> {
  const response = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/autorizados?tipoIdentificacion=0&numIdentificacion=${id}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Could not fetch associated users from EDUS");
  }

  const { autorizados }: { autorizados: { identificacion: number }[] } =
    await response.json();

  return autorizados.map((u) => u.identificacion);
}

async function fetchUserData(id: number, token: string): Promise<UserData> {
  const response = await fetch(
    `https://edus.ccss.sa.cr/ccssmoviladscripcion/datosPersonales?tipoIdentificacion=0&numIdentificacion=${id}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Could not fetch personal data from EDUS");
  }

  const {
    numeroIdentificacion,
    nomPaciente,
    nomPacienteApellido1,
    nomPacienteApellido2,
    sexo,
    centroSaludAtencion,
  } = await response.json();

  return {
    userId: numeroIdentificacion,
    fullName:
      `${nomPaciente} ${nomPacienteApellido1} ${nomPacienteApellido2}`.toUpperCase(),
    gender: sexo,
    healthCenterCode: centroSaludAtencion,
  };
}
