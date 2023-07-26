import "~/styles/main.css";

import type { ComponentWithChildren } from "~/types";
import { Providers } from "./providers";

export default function RootLayout({ children }: ComponentWithChildren) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
