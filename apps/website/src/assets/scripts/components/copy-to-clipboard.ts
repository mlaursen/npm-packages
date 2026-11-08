// allow all copy-to-clipboard elements find the closest code and copy that
globalThis.addEventListener("clipboard-copy-data", (event) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const pre = event.target.closest("mwc-code-block")?.querySelector("pre");
  event.waitUntil(Promise.resolve(pre?.textContent ?? ""));
});
