import type { NextApiRequest, NextApiResponse } from "next";
import parse from "node-html-parser";
import { parseParams } from "../../utils";

const book = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cookies, date, eventId, viewState } = req.body;

  if (!cookies) {
    return res.status(400).json({ error: "cookies are required" });
  }

  if (!date) {
    return res.status(400).json({ erorr: "date is required" });
  }

  if (!eventId) {
    return res.status(400).json({ erorr: "eventId is required" });
  }

  if (!viewState) {
    return res.status(400).json({ erorr: "viewState is required" });
  }

  const confirmationEvent = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/comun/Inicio.xhtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: parseParams({
        "javax.faces.partial.ajax": "true",
        "javax.faces.partial.execute": "@all",
        [`${eventId}`]: eventId,
        formSIAC: "formSIAC",
        "javax.faces.ViewState": viewState,
      }),
    }
  );

  const confirmationViewState =
    parse(await confirmationEvent.text())
      .getElementById("javax.faces.ViewState")
      .innerText.replace("<![CDATA[", "")
      .replace("]]>", "") || "";

  // ACTUAL CONFIRMATION
  // THIS CODE HASNT BEEN TESTED AND MIGHT NOT WORK
  const response = await fetch(
    "https://edus.ccss.sa.cr/CitasWebPF/faces/xhtml/comun/Inicio.xhtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: parseParams({
        "javax.faces.partial.ajax": "true",
        "javax.faces.partial.execute": "@all",
        "formSIAC:j_idt230": "formSIAC:j_idt230",
        formSIAC: "formSIAC",
        "javax.faces.ViewState": confirmationViewState,
      }),
    }
  );

  if (response.status !== 200) {
    console.error(response.status);
    console.error((await response.text()).toString());
    return res.status(500).json({ message: "something went wrong" });
  }

  res.status(200).json({ message: "appointment booked successfully" });
};

export default book;
