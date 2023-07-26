import type { NextApiRequest, NextApiResponse } from "next";
import { parseParams } from "../../../utils";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, password, token } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is required" });
  }
  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  const tokenResponse = await fetch(
    "https://aissfa.ccss.sa.cr/gestortoken/token?codigoSistema=APP-EDUS",
    {
      headers: {
        Authorization: "Basic YXBwLWVkdXM6YXBiM2R1c3VzM3I5OA==",
      },
    }
  );

  if (tokenResponse.status !== 200) {
    return res.status(500).json({ message: "something bad happened" });
  }

  const loginParams = {
    identificadorUsuario: id,
    clave: Buffer.from(password).toString("base64"),
    nombreMovil: "android",
    codigoSistema: "SCWB",
  };

  const loginResponse = await fetch(
    "https://edus.ccss.sa.cr/ccssmovilmiseservicios/iniciarsesion",
    {
      method: "POST",
      headers: {
        Authorization: await tokenResponse.text(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: parseParams(loginParams),
    }
  );

  if (loginResponse.status === 500) {
    return res.status(500).json({ message: "something bad happened" });
  }

  if (loginResponse.status !== 200) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const login = await loginResponse.json();

  const personalDataResponse = await fetch(
    `https://edus.ccss.sa.cr/ccssmoviladscripcion/datosPersonales?tipoIdentificacion=0&numIdentificacion=${id}`,
    {
      headers: {
        tokenAccesoAPI: token,
      },
    }
  );

  if (personalDataResponse.status === 403) {
    return res.status(400).json({ error: "invalid token" });
  }

  if (personalDataResponse.status !== 200) {
    return res.status(500).json({ error: "something bad happened" });
  }

  const personalData = await personalDataResponse.json();

  res.status(200).json({
    id: login.numeroIdentificacion,
    user: login.codigoUsuario,
    fullName: `${login.nombre} ${login.primerApellido} ${login.segundoApellido}`,
    healthCenterCode: personalData.centroSaludAtencion,
  });
};

export default login;
