import { NextResponse } from "next/server";
import { EDUSCrypto } from "~/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const healthCenterCode = searchParams.get("healthCenterCode");
  const serviceCode = searchParams.get("serviceCode");

  if (healthCenterCode === null) {
    return NextResponse.json(
      { message: "healthCenterCode is required" },
      { status: 400 }
    );
  }

  if (serviceCode === null) {
    return NextResponse.json(
      { message: "serviceCode is required" },
      { status: 400 }
    );
  }

  const token = EDUSCrypto.generateToken();
  const response = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/especialidades?centroSaludAtencion=${healthCenterCode}&servicio=${serviceCode}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (response.status === 404) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (response.status !== 200) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  const body: {
    especialidades: {
      codeServicioEspecialidad: number;
      codeEspecialidad: number;
      dscEspecialidad: string;
    }[];
  } = await response.json();

  return NextResponse.json(
    body.especialidades.map((s) => {
      return {
        code: s.codeEspecialidad,
        specialtyServiceCode: s.codeServicioEspecialidad,
        description: s.dscEspecialidad.trim(),
      };
    })
  );
}
