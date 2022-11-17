import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "node-html-parser";
import { parseParams } from "../../utils";
const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, password, captcha, cookies } = req.body;
  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is required" });
  }
  if (!captcha) {
    return res.status(400).json({ error: "captcha is required" });
  }
  if (!cookies) {
    return res.status(400).json({ error: "cookies are required" });
  }

  const viewStateResponse = await fetch(
    "https://edus.ccss.sa.cr/eduscitasweb/CitasWebPF/faces/xhtml/seguridad/Login.xhtml",
    {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Cookie: cookies,
      },
    }
  );
  const viewState =
    parse(await viewStateResponse.text())
      .getElementById("javax.faces.ViewState")
      .getAttribute("value") || "";

  console.log(viewState);

  const loginParams = {
    "javax.faces.partial.ajax": "true",
    "formInicioSesion:ejecutarPaso1": "formInicioSesion:ejecutarPaso1",
    formInicioSesion: "formInicioSesion",
    "formInicioSesion:tipIdentificacion_input": "0",
    "formInicioSesion:usuario": id,
    "formInicioSesion:clave": password,
    "formInicioSesion:captchaDigitado": captcha,
    "javax.faces.ViewState": viewState,
    "javax.faces.partial.execute": "@all",
  };

  const response = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/seguridad/Login.xhtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: parseParams(loginParams),
    }
  );

  const root = parse(await response.text());
  console.log(root.toString());
  const loginSuccessful = root.querySelector("partial-response > redirect");
  if (!loginSuccessful) {
    return res.status(400).json({
      error: "invalid credentials or captcha",
    });
  }

  res.status(200).json({ message: "logged in successfully" });
};

export default login;
