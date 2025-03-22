# Playwright E2E Testing

<p align="left">
 <a href="https://curly-spork-6ky5gr3.pages.github.io"><img src="https://img.shields.io/badge/E2E_Tests_Report-Allure-blue" alt="E2E Report Link"></a>
</p>

Testing IDV with PW (API / UI)

- ```fullyParallel``` should be ```false``` due to Cognito OIDC + Keycloack IDP cookie session / login page SPA + multiple browsers usage issues.

## 🚀 Setup

```bash
# Yarn 4.x
corepack enable

# Install
yarn

# Test execution for shards (1-3)
yarn test --shard=1

# Open PW UI
yarn ui

# Generate Allure Report
yarn open:allure
