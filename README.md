# Playwright E2E Testing

Testing IDV with PW (API / UI)

- testing with global-setup determinated differently in Local and CI

- sharding = containers (browser allocation)

- workers = each browser used

- fullyParallel should be off due to Cognito OIDC + Keycloack IDP cookies issues

## 🚀 Setup

```bash
# Install
yarn

# Test execution for shards (1-3)
yarn test --shard=1

# Open PW UI
yarn ui

# Generate Allure Report
yarn open:allure