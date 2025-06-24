import "@/lib/datepicker-locale";
import StyledComponentsRegistry from "@/lib/registry";
import { BackButton } from "@/components/BackButton";
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
          <BackButton />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}