import type { NextApiRequest, NextApiResponse } from "next";

const services = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, healthCenterCode } = req.body;

  if (!token) {
    return res.status(400).json({ error: "edus api token is required" });
  }

  if (!healthCenterCode) {
    return res.status(400).json({ error: "health center code is required" });
  }

  const servicesResponse = await fetch(
    `https://edus.ccss.sa.cr/ccssmovilcitas/servicios?centroSaludAtencion=${healthCenterCode}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (servicesResponse.status === 403) {
    return res.status(400).json({ error: "invalid token" });
  }

  if (servicesResponse.status === 404) {
    return res.status(400).json({ error: "invalid health center code" });
  }

  if (servicesResponse.status !== 200) {
    return res.status(500).json({ error: "something bad happened" });
  }

  const body: {
    servicios: { codeServicio: number; dscServicio: string }[];
  } = await servicesResponse.json();

  res.status(200).json(
    body.servicios.map((s) => {
      return {
        code: s.codeServicio,
        description: s.dscServicio,
      };
    })
  );
};

export default services;
