import { ColorPreview } from "@mlaursen/code/color-preview/ColorPreview";
import { HighlightedCodeBlock } from "@mlaursen/code/shiki/HighlightedCodeBlock";
import { Box } from "@react-md/core/box/Box";
import { Link } from "@react-md/core/link/Link";
import { TextContainer } from "@react-md/core/typography/TextContainer";
import { Typography } from "@react-md/core/typography/Typography";
import { type ReactElement } from "react";

import { RootLayout } from "./RootLayout.tsx";

export default function App(): ReactElement {
  return (
    <RootLayout>
      <TextContainer>
        <Typography type="headline-2">ReactMD + Vite Starter</Typography>
        <Typography>
          See{" "}
          <Link href="https://react-md.dev" target="_blank">
            https://react-md.dev
          </Link>{" "}
          and{" "}
          <Link href="https://vite.dev" target="_blank">
            https://vite.dev
          </Link>{" "}
          for more information.
        </Typography>
        <HighlightedCodeBlock
          lang="shell"
          code="npm install --save @mlaursen/code @react-md/core cnbuilder"
        />

        <Box grid>
          <Box stacked>
            Default
            <ColorPreview color="#ffaaff" />
          </Box>
          <Box stacked>
            Default (v2)
            <ColorPreview color="#FFAAFF" v2 />
          </Box>
          <Box stacked>
            Icon
            <ColorPreview color="#55FF33" v2 variant="icon" />
          </Box>
          <Box stacked>
            shadowed
            <ColorPreview color="#55FF33" v2 shadowed />
          </Box>
          <Box stacked>
            disable tooltip
            <ColorPreview color="#55FF33" v2 disableTooltip />
          </Box>
          <Box stacked>
            icon disable tooltip
            <ColorPreview color="#55FF33" v2 variant="icon" disableTooltip />
          </Box>
          <Box stacked>
            icon-bordered disable tooltip
            <ColorPreview
              color="#55FF33"
              v2
              variant="icon"
              shadowed
              disableTooltip
            />
          </Box>
        </Box>
      </TextContainer>
    </RootLayout>
  );
}
