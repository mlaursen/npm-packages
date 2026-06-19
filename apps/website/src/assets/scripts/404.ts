const home = document.querySelector<HTMLAnchorElement>("#home-link");

if (home) {
  const [match = "/"] =
    globalThis.location.pathname.match(/(\/packages\/(wc))/) ?? [];

  home.href = match;
}
