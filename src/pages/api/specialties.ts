import { NextApiRequest, NextApiResponse } from "next";
import { Specialty } from "../../types";

const specialties = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, healthCenterCode, serviceCode } = req.body;

  if (!token) {
    return res.status(400).json({ error: "edus api token is required" });
  }

  if (!healthCenterCode) {
    return res.status(400).json({ error: "health center code is required" });
  }

  if (!serviceCode) {
    return res.status(400).json({ error: "service code is required" });
  }

  const specialtiesResponse = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/especialidades?centroSaludAtencion=${healthCenterCode}&servicio=${serviceCode}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (specialtiesResponse.status === 403) {
    return res.status(400).json({ error: "invalid token" });
  }

  if (specialtiesResponse.status === 404) {
    return res.status(400).json({ error: "invalid health center code" });
  }

  if (specialtiesResponse.status !== 200) {
    return res.status(500).json({ error: "something bad happened" });
  }

  const specialties = await specialtiesResponse.json();

  res.status(200).json(
    specialties.especialidades.map((s: Specialty) => {
      return {
        ...s,
        dscEspecialidad: s.dscEspecialidad.trim(),
      };
    })
  );
};

export default specialties;