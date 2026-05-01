// firefox doesn't support exit animations at this time with @starting-style
// if (this._popover) {
//   this._popover
//     .animate(
//       [
//         {
//           opacity: 1,
//           transform: "translate(0, 0)",
//         },
//         {
//           opacity: 0,
//           transform: "translate(0, -8px)",
//         },
//       ],
//       { duration: 200 },
//     )
//     .finished.then(() => this._popover?.hidePopover());
// }
// override showPopover(initiator: PopoverInitiator = "force"): void {
//   const popover = this._popover;
//   if (!popover) {
//     return;
//   }
//
//   if (initiator === "force") {
//     this.#initiator = initiator;
//     this.#clearTimeout();
//     popover.showPopover();
//     return;
//   }
//
//   if (
//     this.#initiator ||
//     (this.disableFocus && initiator === "focus") ||
//     (this.disableHover && initiator === "hover")
//   ) {
//     return;
//   }
//
//   let delay = this.showDelay ?? 0;
//   if (initiator === "focus" && typeof this.focusDelay === "number") {
//     delay = this.focusDelay;
//   } else if (initiator === "hover" && typeof this.hoverDelay === "number") {
//     delay = this.hoverDelay;
//   }
//
//   delay = Math.max(0, delay);
//
//   this.#clearTimeout();
//   this.#timeout = globalThis.setTimeout(() => {
//     popover.showPopover();
//   }, delay);
// }
// override hidePopover(initiator: PopoverInitiator = "force"): void {
//   const popover = this._popover;
//   if (!popover) {
//     return;
//   }
//
//   if (initiator === "force") {
//     this.#initiator = null;
//     this.#clearTimeout();
//     popover.hidePopover();
//     return;
//   }
//
//   console.log("this.#initiator:", this.#initiator);
//   console.log("initiator:", initiator);
//   if (this.#initiator !== initiator) {
//     return;
//   }
//
//   this.#clearTimeout();
//   this.#timeout = globalThis.setTimeout(
//     () => {
//       popover.hidePopover();
//     },
//     Math.max(this.hideDelay ?? 0),
//   );
// }
