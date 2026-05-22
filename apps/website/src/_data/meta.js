export const url = process.env.URL || "http://localhost:8000";

export const domain = new URL(url).hostname;
export const title = "@mlaursen/wc: An accessible web component library";
export const description =
  "Accessible web components built to the the foundation for web applications. The default styles are based on material design.";
export const siteType = "Person"; // schema

export const dir = "ltr";
export const locale = "en_EN";
export const lang = "en";

export const author = {
  name: "Mikkel Laursen",
  email: "mlaursen03@gmail.com",
  url: "https://mlaursen.com",
};
// export default {
//   url: "https://mlaursen.com/wc",
//   title: "@mlaursen/wc: An accessible web component library",
//   description:
//     "Accessible web components built to the the foundation for web applications. The default styles are based on material design.",
//
//   dir: "ltr",
//   language: "en",
//
//   author: {
//     name: "Mikkel Laursen",
//     email: "mlaursen03@gmail.com",
//     url: "https://mlaursen.com",
//   },
//   keywords: "accessible,web components,mlaursen,material design",
// };
