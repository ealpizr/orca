import { NextResponse } from "next/server";
import { loginSchema } from "~/schemas";
import { parseParams } from "~/src/utils";

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

  const edusLoginParams = {
    identificadorUsuario: id,
    clave: Buffer.from(password).toString("base64"),
    nombreMovil: "android",
    codigoSistema: "SCWB",
  };

  const edusLoginResponse = await fetch(
    "https://edus.ccss.sa.cr/ccssmovilmiseservicios/iniciarsesion",
    {
      method: "POST",
      headers: {
        Authorization: await aissfaTokenResponse.text(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: parseParams(edusLoginParams),
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

  const userData = await edusLoginResponse.json();

  const personalDataResponse = await fetch(
    `https://edus.ccss.sa.cr/ccssmoviladscripcion/datosPersonales?tipoIdentificacion=0&numIdentificacion=${id}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (personalDataResponse.status !== 200) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: "Could not fetch personal data from EDUS",
      },
      { status: 500 }
    );
  }

  const personalData = await personalDataResponse.json();

  return NextResponse.json({
    status: 200,
    message: "OK",
    data: {
      id: userData.numeroIdentificacion,
      user: userData.codigoUsuario,
      fullName: `${userData.nombre} ${userData.primerApellido} ${userData.segundoApellido}`,
      healthCenterCode: personalData.centroSaludAtencion,
    },
  });
}
