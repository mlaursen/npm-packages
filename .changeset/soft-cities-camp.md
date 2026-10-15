---
"@mlaursen/node-utils": patch
"@mlaursen/release-script": patch
---

Stopped using dotenv and created a small loadConfigFile wrapper for the process.loadConfigFile. No longer trust that package after the v1000 release of dotenv-expand and requiring hiding the ads.
