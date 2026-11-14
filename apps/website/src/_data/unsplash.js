const UNSPLASH_SRC = "/assets/images/unsplash";
const UNSPLASH_LICENSE = "https://unsplash.com/license";

/**
 * @param {{ name: string; alt: string; author: string; handle: string; source: string; }} options
 */
function create({ name, alt, author, handle, source }) {
  return {
    src: `${UNSPLASH_SRC}/${name}`,
    alt,

    author,
    sourceUrl: `https://unsplash.com/photos/${source}`,
    authorUrl: `https://unsplash.com/@${handle}`,
    license: UNSPLASH_LICENSE,
  };
}

export const coffeeCup = create({
  name: "coffee-cup.jpg",
  alt: "A cup of coffee on a saucer",
  author: "Dani",
  handle: "frokz",
  source: "cup-of-coffee-on-saucer-ZLqxSzvVr7I",
});

export const laptop = create({
  name: "laptop.jpg",
  alt: "A turned off MacBook Pro beside white ceramic mug filled with coffee",
  author: "Lauren Mancke",
  handle: "laurenmancke",
  source:
    "turned-off-macbook-pro-beside-white-ceramic-mug-filled-with-coffee-aOC7TSLb1o8",
});

export const sunset = create({
  name: "sunset.jpg",
  alt: "A sunset over a dark mountain range",
  author: "Jonathan Borba",
  handle: "jonathanborba",
  source: "low-sun-over-dark-mountain-range-3eC5n6gHwe8",
});

export const trainStation = create({
  name: "trainStation.jpg",
  alt: "A train station with sunlight streaming from the end",

  author: "Charles Forerunner",
  source: "photo-of-train-station-gapYVvUg1M8",
  handle: "charles_forerunner",
});

export const lake = create({
  name: "lake.jpg",
  alt: "A lake reflecting mountains and pine trees",
  author: "Dilon Roberts",
  source: "lake-reflecting-mountains-and-pine-trees-tKtDcwWI-sY",
  handle: "dilonroberts",
});
