import type { LitConstructor } from "../types.js";
import type {
  ElementWithInternalsProperties,
  LitElementWithInternals,
} from "./types.js";

export function InternalsMixin<T extends LitConstructor>(
  Base: T,
  formAssociated = true,
): LitElementWithInternals<T> {
  class ElementWithInternals
    extends Base
    implements ElementWithInternalsProperties
  {
    internals = this.attachInternals();
    static formAssociated = formAssociated;

    get form(): HTMLFormElement | null {
      return this.internals.form;
    }
  }

  return ElementWithInternals;
}
