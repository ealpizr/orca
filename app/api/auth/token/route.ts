import { NextResponse } from "next/server";
import { EDUSCrypto } from "~/utils";

export function GET() {
  try {
    const token = EDUSCrypto.generateToken();
    return NextResponse.json({ token });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Something wrong happened" },
      { status: 500 }
    );
  }
}
