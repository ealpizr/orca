import type { NextApiRequest, NextApiResponse } from "next";

const book = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, appointment } = req.body;

  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  if (!appointment) {
    return res.status(400).json({ error: "appointment is required" });
  }

  const bookRequest = await fetch(
    "https://edus.ccss.sa.cr/ccssmovilcitas/registrarCita",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        tokenAccesoAPI: token,
      },
      body: JSON.stringify({ ...appointment }),
    }
  );

  if (bookRequest.status === 403) {
    return res.status(400).json({ error: "invalid token" });
  }

  if (bookRequest.status !== 200) {
    return res.status(500).json({ error: "something went wrong" });
  }

  res.status(200).json({ message: "appointment booked successfully" });
};

export default book;
