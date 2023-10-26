import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Inter } from "next/font/google";
import { ReduxPovider } from "@/redux/provider";
import { AuthMiddleware } from "@/components";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommerce Dashboard",
  description: "LT ecommerce dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <ReduxPovider>
          <AuthMiddleware>{children}</AuthMiddleware>
        </ReduxPovider>
      </body>
    </html>
  );
}
