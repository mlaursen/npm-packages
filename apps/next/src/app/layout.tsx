import { RootHtml } from "@react-md/core/RootHtml";
import { MATERIAL_CONFIG } from "@react-md/core/icon/materialConfig";
import { cnb } from "cnbuilder";
import type { Metadata } from "next";
import { Roboto_Flex, Source_Code_Pro } from "next/font/google";
import { type ReactElement, type ReactNode } from "react";

import { RootLayout } from "@/components/RootLayout";
import { RootProviders } from "@/components/RootProviders";
import { SYMBOL_NAMES } from "@/rmdConfig";

import "./layout.scss";

export const metadata: Metadata = {
  title: "mlaursen next.js",
};

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--roboto",
});
const sourceCodePro = Source_Code_Pro({
  variable: "--source-code-pro",
  display: "swap",
});

function getMaterialSymbolsUrl(): string {
  const variant =
    MATERIAL_CONFIG.family.charAt(0).toUpperCase() +
    MATERIAL_CONFIG.family.substring(1);
  const { fill, grade, weight, opticalSize } = MATERIAL_CONFIG;
  const specs = `:opsz,wght,FILL,GRAD@${opticalSize},${weight},${fill},${grade}`;
  const baseUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+${variant}${specs}`;

  return `${baseUrl}&icon_names=${SYMBOL_NAMES.join(",")}&display=block`;
}

const SYMBOLS_URL = getMaterialSymbolsUrl();

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): ReactElement {
  return (
    <RootHtml
      className={cnb(roboto.variable, sourceCodePro.variable)}
      beforeBodyChildren={
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link rel="stylesheet" href={SYMBOLS_URL} />
        </head>
      }
    >
      <RootProviders>
        <RootLayout>{children}</RootLayout>
      </RootProviders>
    </RootHtml>
  );
}
