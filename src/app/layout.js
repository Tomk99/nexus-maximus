import StyledComponentsRegistry from "@/lib/registry";
import { BackButton } from "@/components/BackButton"; // Importáljuk az új komponenst
import "./globals.css";

export const metadata = {
  title: "Nexus Maximus",
  description: "Személyes menedzsment alkalmazás",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>
        <StyledComponentsRegistry>
          <BackButton /> {/* Itt hívjuk meg a gombot */}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}