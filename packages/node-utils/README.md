# @mlaursen/node-utils

A package of utils I generally find myself using in projects with node.

## Installation

```sh
npm install @mlaursen/node-utils
```

<!-- examples-start -->

## filesize

### Simple Example

```ts
import { filesize } from "@mlaursen/node-utils";
import { readFile } from "node:fs/promises";

const contents = await readFile("README.md", "utf8");
console.log(`README.md is ${filesize(contents)} bytes`);
console.log(
  `README.md is ${filesize(contents, { gzip: true })} bytes when gzipped`
);
```

## log

### Simple Example

```ts
import { disableLogger, enableLogger, log } from "@mlaursen/node-utils";

log("This won't be printed");

enableLogger();
log("This will be printed");

disableLogger();
log("This won't be printed");
```

## logTask

### Simple Example

```ts
import { enableLogger, logTask } from "@mlaursen/node-utils";

enableLogger();

async function someTask(): Promise<void> {
  // implementation
}

await logTask(someTask(), "Starting some task", "Some task complete!");
```

## prettyFilesize

### Simple Example

```ts
import { prettyFilesize } from "@mlaursen/node-utils";
import { readFile } from "node:fs/promises";

const contents = await readFile("README.md", "utf8");
console.log(`README.md is ${prettyFilesize(contents)}`);
console.log(
  `README.md is ${prettyFilesize(contents, { gzip: true })} when gzipped`
);
```

<!-- examples-end -->
