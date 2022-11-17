import type { NextApiRequest, NextApiResponse } from "next";
import parse from "node-html-parser";
import { parseParams } from "../../utils";

const appointments = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cookies, date } = req.body;

  if (!cookies) {
    return res.status(400).json({ error: "cookies are required" });
  }

  if (!date) {
    return res.status(400).json({ erorr: "date is required" });
  }

  const viewStateResponse = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/comun/Inicio.xhtml",
    {
      method: "GET",
      headers: {
        Cookie: cookies,
      },
    }
  );
  const homeViewState =
    parse(await viewStateResponse.text())
      .getElementById("javax.faces.ViewState")
      .getAttribute("value") || "";

  const addAppointmentViewState = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/comun/Inicio.xhtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: parseParams({
        "javax.faces.partial.ajax": "true",
        "javax.faces.source": "formSIAC:btnMenuAdd",
        "javax.faces.partial.execute": "@all",
        "formSIAC:btnMenuAdd": "formSIAC:btnMenuAdd",
        formSIAC: "formSIAC",
        "formSIAC:menuEstados_input": "1",
        "formSIAC:tablaCitas_rppDD": "10",
        "formSIAC:listaEstudiosLabcore_rppDD": ["10", "10"],
        "formSIAC:tablaFamiliares_rppDD": "10",
        "formSIAC:menuServicios_input": "-1",
        "formSIAC:menuEspecialidades_input": "-1",
        "formSIAC:cuposDisponibles_rppDD": "10",
        "formSIAC:menuEstadosFam_input": "1",
        "formSIAC:tablaCitasFam_reflowDD": "0_0",
        "formSIAC:tablaCitasFam_rppDD": "10",
        "javax.faces.ViewState": homeViewState,
      }),
    }
  );

  const viewState =
    parse(await addAppointmentViewState.text())
      .getElementById("javax.faces.ViewState")
      .innerText.replace("<![CDATA[", "")
      .replace("]]>", "") || "";

  const appointmentsParams = {
    "javax.faces.partial.ajax": "true",
    "javax.faces.source": "formSIAC:fecElegida",
    "javax.faces.behavior.event": "dateSelect",
    formSIAC: "formSIAC",
    "formSIAC:menuServicios_input": "1",
    "formSIAC:menuEspecialidades_input": "1033",
    "formSIAC:fecElegida_input": date,
    "javax.faces.ViewState": viewState,
  };

  const response = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/comun/Inicio.xhtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: parseParams(appointmentsParams),
    }
  );

  const root = parse(await response.text());

  const viewstate =
    root
      .getElementById("javax.faces.ViewState")
      .innerText.replace("<![CDATA[", "")
      .replace("]]>", "") || "";

  const appointments = root
    .querySelectorAll("table > tbody > tr")
    .map((row) => {
      const cols = row.querySelectorAll("td");
      if (cols[0]?.innerText.includes("No se encontraron cupos disponibles.")) {
        return;
      }
      return {
        date: cols[0]?.innerText,
        time: cols[1]?.innerText,
        appointmentId: cols[2]?.innerText,
        facility: cols[3]?.innerText,
        doctor: cols[4]?.innerText,
        eventId: cols[5]?.querySelector("button")?.getAttribute("id"),
      };
    });

  if (appointments[0] === undefined) {
    return res.status(404).json({ appointments: [] });
  }

  res.status(200).json({ viewstate, appointments });
};

export default appointments;
