import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const token = async (req: NextApiRequest, res: NextApiResponse) => {
  const KEY =
    "583992740DF883221175DA7324D445BCC98A551A82138F7529E01B4E71E5390F";
  const IV = Buffer.alloc(16, 0);
  const DATA = "92634A885DE158317A045EE93E3940E02D6ACEB2";

  const date = new Date();
  const simpleDateFormat = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Costa_Rica",
  });
  const formattedDate = simpleDateFormat.format(date);

  const keyHash = crypto
    .createHash("sha256")
    .update(KEY)
    .digest()
    .subarray(0, 16);

  const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, IV);
  let encrypted = cipher.update(`${DATA}${formattedDate}`, "utf8", "base64");
  encrypted += cipher.final("base64");

  res.send(encrypted);
};

export default token;
