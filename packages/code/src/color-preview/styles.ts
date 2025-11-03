import { bem } from "@react-md/core/utils/bem";
import { cnb } from "cnbuilder";

const styles = bem("color-preview");

export interface ColorPreviewClassNameOptions {
  className?: string;

  /**
   * @defaultValue `"inline-code"`
   */
  variant?: "inline-code" | "icon";

  shadowed?: boolean;

  /**
   * @defaultValue `variant === "icon"`
   */
  disableTooltip?: boolean;
}

export function colorPreview(options: ColorPreviewClassNameOptions): string {
  const {
    className,
    variant = "inline-code",
    shadowed,
    disableTooltip = variant === "icon",
  } = options;

  return cnb(
    styles({
      icon: variant === "icon",
      shadowed,
      tooltip: !disableTooltip,
    }),
    className
  );
}
