import { NextResponse } from "next/server";
import { z } from "zod";
import { EDUSCrypto } from "~/utils";

const bookValidationSchema = z.object({
  id: z
    .preprocess(
      (x) => parseInt(x as string),
      z.number({ invalid_type_error: "Must be a number" }),
    )
    .refine((x) => x.toString().length === 9, {
      message: "Must be 9 digits long",
    }),
  user: z.string().min(1),
  serviceSpecialtyCode: z.preprocess(
    (x) => parseInt(x as string),
    z.number({ invalid_type_error: "Must be a number" }),
  ),
  date: z.string().min(1),
  appointment: z.object({
    TipoPaciente: z.number(),
    fecCupo: z.string(),
    horaCupo: z.string(),
    codHoraCupo: z.number(),
    conCupo: z.number(),
    codSeccion: z.number(),
    tipHoraCupo: z.number(),
    tipHorario: z.number(),
    tipProfesional: z.number(),
    codProfesional: z.string(),
    codConsultorio: z.number(),
    dscConsultorio: z.string(),
    nomProfesional: z.string(),
  }),
});

const validationSchema = z.object({
  id: z
    .preprocess(
      (x) => parseInt(x as string),
      z.number({ invalid_type_error: "Must be a number" }),
    )
    .refine((x) => x.toString().length === 9, {
      message: "Must be 9 digits long",
    }),
  serviceCode: z.preprocess(
    (x) => parseInt(x as string),
    z.number({ invalid_type_error: "Must be a number" }),
  ),
  specialtyCode: z.preprocess(
    (x) => parseInt(x as string),
    z.number({ invalid_type_error: "Must be a number" }),
  ),
  serviceSpecialtyCode: z.preprocess(
    (x) => parseInt(x as string),
    z.number({ invalid_type_error: "Must be a number" }),
  ),
  date: z.string().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const serviceCode = searchParams.get("serviceCode");
  const specialtyCode = searchParams.get("specialtyCode");
  const serviceSpecialtyCode = searchParams.get("serviceSpecialtyCode");
  const date = searchParams.get("date");

  const validation = validationSchema.safeParse({
    id,
    serviceCode,
    specialtyCode,
    serviceSpecialtyCode,
    date,
  });
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const token = EDUSCrypto.generateToken();
  const response = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/buscarCuposDisponibles?tipoIdentificacion=0&numIdentificacion=${id}&codServicio=${serviceCode}&codEspecialidad=${specialtyCode}&codServicioEspecialidad=${serviceSpecialtyCode}&fechaSeleccionada=${date}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    },
  );

  if (response.status !== 200) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  const body: { cuposDisponibles: object[] } = await response.json();

  return NextResponse.json(body.cuposDisponibles);
}

export async function POST(request: Request) {
  const validation = bookValidationSchema.safeParse(await request.json());

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id, user, serviceSpecialtyCode, date, appointment } = validation.data;

  const token = EDUSCrypto.generateToken();
  const response = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/registrarCita?tipoIdentificacion=0&numIdentificacion=${id}&codigoUsuario=${user}&codServicioEspecialidad=${serviceSpecialtyCode}&date=${date}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        tokenAccesoAPI: token,
      },
      body: JSON.stringify(appointment),
    },
  );

  if (response.status !== 200) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Appointment booked successfully" });
}
