# @mlaursen/wc

Create an accessible application using [web components] using [lit] following
[material design].

## Installation

```sh
npm install @mlaursen/wc
```

```sh
yarn add @mlaursen/wc
```

```sh
pnpm add @mlaursen/wc
```

## Quick Start

> This example is only meant for demonstration and should generally not be used
> in production.

```html
<html>
  <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr/npm/@mlaursen/dist/light-dark.css"
    />
    <script type="importmap">
      {
        "imports": {
          "@mlaursen/wc": "https://esm.run/@mlaursen/wc"
        }
      }
    </script>
    <script type="module" blocking="render">
      import "@mlaursen/wc";
    </script>
  </head>
  <body>
    <mwc-text-container>
      <mwc-typography variant="display" size="medium">
        <h1>Hello, world!</h1>
      </mwc-typography>
      <mwc-typography size="medium">
        <p>
          This text will be centered to be optimized for legibility with a max
          line length since it is in a <code>mwc-text-container</code>.
        </p>
      </mwc-typography>
    </mwc-text-container>
    <mwc-box stacked>
      <mwc-typography>
        <p>
          This is in a flex layout with some default padding and gap. It is
          extremely useful for content layout. This version using
          <code>flex-direction: column</code> while the default is
          <code>flex-direction: row</code>.
        </p>
      </mwc-typography>
      <mwc-button>Click me</mwc-button>
    </mwc-box>
  </body>
</html>
```

[lit]: https://lit.dev/
[web components]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
[material design]: https://material.io/design/
