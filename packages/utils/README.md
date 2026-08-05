# @mlaursen/utils

A package of utils I generally find myself using in projects.

## Installation

```sh
npm install @mlaursen/utils
```

<!-- examples-start -->

## alphaNumericSort

### Simple Example

```ts
const items = ["World", "Hello"];

const sorted = alphaNumericSort(items);
// sorted == ["Hello", "World"]
```

### Simple Example

```ts
interface Item {
  nameField: string;
}

const items: Item[] = [{ nameField: "World" }, { nameField: "Hello" }];

const sorted = alphaNumericSort(items, {
  extractor: (item) => item.nameField,
});
// sorted == [{ nameField: "Hello" }, { nameField: "World" }]
```

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
