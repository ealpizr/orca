import type { NextApiRequest, NextApiResponse } from "next";
import { parseParams } from "../../utils";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, password } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is required" });
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

  const body = await loginResponse.json();

  res.status(200).json({
    id: body.numeroIdentificacion,
    user: body.codigoUsuario,
    fullName: `${body.nombre} ${body.primerApellido} ${body.segundoApellido}`,
  });
};

export default login;
