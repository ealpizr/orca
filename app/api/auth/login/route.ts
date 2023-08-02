import { NextResponse } from "next/server";
import { loginSchema } from "~/schemas";
import type { UserData } from "~/types";
import { EDUSCrypto, InvalidCredentialsError, parseParams } from "~/utils";

export async function POST(request: Request) {
  try {
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

    const token = EDUSCrypto.generateToken();
    const aissfaToken = await fetchAissfaToken();
    const { id, password } = schemaValidation.data;

    await login(id, password, aissfaToken);
    const associatedIds = [id, ...(await fetchAssociatedUsers(id, token))];

    const userData = await Promise.all(
      associatedIds.map(async (id) => await fetchUserData(id, token))
    );

    return NextResponse.json({
      status: 200,
      message: "OK",
      data: userData,
    });
  } catch (e) {
    console.error(e);

    if (e instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Something wrong happened" },
      { status: 500 }
    );
  }
}

async function fetchAissfaToken() {
  const aissfaTokenResponse = await fetch(
    "https://aissfa.ccss.sa.cr/gestortoken/token?codigoSistema=APP-EDUS",
    {
      headers: {
        Authorization: "Basic YXBwLWVkdXM6YXBiM2R1c3VzM3I5OA==",
      },
    }
  );

  if (aissfaTokenResponse.status !== 200) {
    throw new Error("Could not fetch AISSFA token");
  }

  const token = await aissfaTokenResponse.text();

  return token;
}

async function login(id: number, password: string, token: string) {
  const edusLoginResponse = await fetch(
    "https://edus.ccss.sa.cr/ccssmovilmiseservicios/iniciarsesion",
    {
      method: "POST",
      headers: {
        Authorization: token,
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
    throw new Error("Could not log in to EDUS");
  }

  if (edusLoginResponse.status !== 200) {
    throw new InvalidCredentialsError();
  }
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
    codigoUsuario,
    centroSaludAtencion,
  } = await response.json();

  return {
    user: codigoUsuario,
    identification: numeroIdentificacion,
    fullName:
      `${nomPaciente} ${nomPacienteApellido1} ${nomPacienteApellido2}`.toUpperCase(),
    healthCenterCode: centroSaludAtencion,
  };
}
