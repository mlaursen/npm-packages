# @mlaursen/utils

A package of utils I generally find myself using in projects.

## Installation

```sh
npm install @mlaursen/utils
```

<!-- examples-start -->

## camelCase

### Simple Example

```ts
import { camelCase } from "@mlaursen/utils";

camelCase("hello-world"); // "helloWorld"
```

## kebabCase

### Simple Example

```ts
import { kebabCase } from "@mlaursen/utils";

kebabCase("HelloWorld"); // "hello-world"
```

## pascalCase

### Simple Example

```ts
import { pascalCase } from "@mlaursen/utils";

pascalCase("hello-world"); // "HelloWorld"
```

## titleCase

### Simple Example

```ts
import { titleCase } from "@mlaursen/utils";

titleCase("hello-world"); // "Hello World"
```

## upperFirst

### Simple Example

```ts
import { upperFirst } from "@mlaursen/utils";

upperFirst("hello-world"); // "Hello-world"
```

## wait

### Wait some duration

```ts
import { wait } from "@mlaursen/utils/wait";

console.log("start");
await wait(5000);
console.log("it has been five seconds");
```

<!-- examples-end -->
