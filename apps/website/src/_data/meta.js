export const url = process.env.URL || "http://localhost:8000";

export const domain = new URL(url).hostname;

export const title = "Mikkel Laursen";
export const siteName = "Mikkel Laursen Portfolio";
export const siteType = "Person"; // schema
export const description = "A placeholder portfolio website for Mikkel Laursen";

export const colorScheme = "light dark";

export const locale = "en_EN";
export const lang = "en";

export const author = {
  name: "Mikkel Laursen",
  email: "mlaursen03@gmail.com",
  url: "https://mlaursen.com",
};

export const og = {
  alt: "",
  image: "/assets/images/template/og_default.png",
};

export const fonts = {
  // set to true to use google fonts instead of locally hosted
  google: false,
};

export const symbols = false;
