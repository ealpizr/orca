import type { NextApiRequest, NextApiResponse } from "next";

const captcha = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch("https://edus.ccss.sa.cr/CitasWebPF/captcha");

    const captchaBlob = await response.blob();
    const captchaBuffer = Buffer.from(await captchaBlob.arrayBuffer());
    const captchaBase64 = `data:${
      captchaBlob.type
    };base64, ${captchaBuffer.toString("base64")}`;

    const cookies = (response.headers.get("set-cookie") || "")
      .split(",")
      .map((c) => c.split(";")[0] || "")
      .join("; ");

    res.status(200).json({ captcha: captchaBase64, cookies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
};

export default captcha;
