import type { NextApiRequest, NextApiResponse } from "next";

const appointments = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, id, serviceCode, specialtyCode, serviceSpecialtyCode, date } =
    req.body;

  if (!token) {
    return res.status(400).json({ error: "cookies is required" });
  }

  if (!id) {
    return res.status(400).json({ error: "cookies is required" });
  }

  if (!serviceCode) {
    return res.status(400).json({ error: "service code is required" });
  }

  if (!specialtyCode) {
    return res.status(400).json({ error: "specialty code is required" });
  }

  if (!serviceSpecialtyCode) {
    return res
      .status(400)
      .json({ error: "service specialty code is required" });
  }

  if (!date) {
    return res.status(400).json({ erorr: "date is required" });
  }

  const appointmentsResponse = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/buscarCuposDisponibles?tipoIdentificacion=0&numIdentificacion=${id}&codServicio=${serviceCode}&codEspecialidad=${specialtyCode}&codServicioEspecialidad=${serviceSpecialtyCode}&fechaSeleccionada=${date}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (appointmentsResponse.status === 403) {
    return res.status(400).json({ error: "invalid edus api token" });
  }

  if (appointmentsResponse.status !== 200) {
    return res.status(500).json({ error: "something bad happened" });
  }

  const appointments = await appointmentsResponse.json();

  res.status(200).json(appointments.cuposDisponibles);
};

export default appointments;
