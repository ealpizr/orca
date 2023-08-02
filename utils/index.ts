import crypto from "crypto";

export const parseParams = (params: Record<string, unknown>) =>
  Object.keys(params)
    .map((key) => {
      return (
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(String(params[key as keyof typeof params]))
      );
    })
    .join("&");

export class InvalidCredentialsError extends Error {}

export class EDUSCrypto {
  private static readonly _KEY =
    "583992740DF883221175DA7324D445BCC98A551A82138F7529E01B4E71E5390F";
  private static readonly _IV = Buffer.alloc(16, 0);
  private static readonly _DATA = "92634A885DE158317A045EE93E3940E02D6ACEB2";

  static generateToken() {
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
      .update(this._KEY)
      .digest()
      .subarray(0, 16);

    const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, this._IV);
    let token = cipher.update(
      `${this._DATA}${formattedDate}`,
      "utf8",
      "base64"
    );
    token += cipher.final("base64");

    return token;
  }
}
