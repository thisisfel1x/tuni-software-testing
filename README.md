[![CI](https://github.com/thisisfel1x/tuni-software-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/thisisfel1x/tuni-software-testing/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/github/thisisfel1x/tuni-software-testing/badge.svg?branch=main)](https://coveralls.io/github/thisisfel1x/tuni-software-testing?branch=main)

# Testing the utility library of the food e-commerce store

Part 2 of the CI assignment in COMP.SE.200 Software Testing (Tampere University), group 74. The repository implements the tests from our test plan (part 1) for 10 functions of the utility library, runs them in GitHub Actions and reports the coverage to Coveralls.

`src/` is taken unchanged from [otula/COMP.SE.200-2024-2025-1](https://github.com/otula/COMP.SE.200-2024-2025-1) at commit 128f071. `package.json` comes from the same commit, we added the scripts, the test tools and the Node version.

> **The CI is red on purpose.** The tests found 8 defects in the library. Tests that find a defect stay red and are never skipped, so the defects stay visible until they are fixed.

## Running the tests

Requires Node.js 22.12 or later (CI uses Node 24).

```bash
npm ci                  # install the exact versions from package-lock.json
npm test                # run all tests with Mocha
npm run coverage        # run the tests with c8, writes coverage/index.html and coverage/lcov.info
npm run coverage:check  # check the coverage thresholds of the last coverage run
npm run report          # HTML test report with mochawesome, writes mochawesome-report/
```

Tools: Mocha 12 (test runner), Chai 6 (assertions), testdouble 3 (test doubles), c8 (coverage), mochawesome (HTML report).

## Structure

| Path | Content |
| --- | --- |
| `test/<function>.test.js` | Unit tests for each of the 10 functions, designed by the group |
| `test/integration/scenarios.test.js` | Integration tests along the store scenarios S1 (search and paging), S2 (cart) and S3 (producer adds a product), without test doubles |
| `test/ai/` | AI-generated tests for `chunk` and `toNumber`, kept for comparison. Prompts, unchanged answers and results are in [`docs/ai-tests/`](docs/ai-tests/README.md) |
| `test/helpers/storeData.js` | Test data for S1 to S3, built without library functions |
| `test/smoke.test.js` | Checks that the tool chain works |

Every test title starts with the test case ID from the test plan, for example `CH-09 splits 45 products into pages of 20/20/5`. A tag such as `[R-05]` in the title marks a test that fails because of that defect. The comment at the top of each unit and integration test file names the oracle, usually the JSDoc of the function.

## Functions under test and defects

| Function | Unit tests | Test IDs | Defect | Severity, priority |
| --- | --- | --- | --- | --- |
| `divide` | `test/divide.test.js` | DV | [#1](https://github.com/thisisfel1x/tuni-software-testing/issues/1) R-01: returns 1 instead of the quotient | critical, P1 |
| `clamp` | `test/clamp.test.js` | CL | [#2](https://github.com/thisisfel1x/tuni-software-testing/issues/2) R-02: returns the lower bound for almost every input | critical, P1 |
| `filter` | `test/filter.test.js` | FI | [#3](https://github.com/thisisfel1x/tuni-software-testing/issues/3) R-03: returns `[[]]` instead of `[]` when nothing matches | major, P1 |
| `slice` | `test/slice.test.js` | SL | [#4](https://github.com/thisisfel1x/tuni-software-testing/issues/4) R-04: does not limit `end` to the array length | major, P1 |
| `chunk` | `test/chunk.test.js` | CH | [#5](https://github.com/thisisfel1x/tuni-software-testing/issues/5) R-05: writes every chunk to the first position | major, P1 |
| `compact` | `test/compact.test.js` | CP | [#6](https://github.com/thisisfel1x/tuni-software-testing/issues/6) R-06: loses the first truthy value | critical, P1 |
| `toString` | `test/toString.test.js` | TS | [#7](https://github.com/thisisfel1x/tuni-software-testing/issues/7) R-07: returns `"null"` and `"undefined"` instead of `""` | minor, P2 |
| `defaultTo` | `test/defaultTo.test.js` | DT | [#8](https://github.com/thisisfel1x/tuni-software-testing/issues/8) R-08: does not replace `NaN` | major, P2 |
| `toNumber` | `test/toNumber.test.js` | TN | none | |
| `isEmpty` | `test/isEmpty.test.js` | IE | none | |

`chunk` also fails because it uses `slice` (R-04). CH-12 and CH-13 replace `slice` with a test double, which shows that R-05 is a defect in `chunk` itself.

## CI and coverage

The workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push, on pull requests and manually:

1. `npm ci`
2. `npm run coverage`: all tests with coverage
3. `npm run coverage:check`: coverage thresholds
4. `npm run report`: HTML test report
5. Upload of `mochawesome-report/` and `coverage/` as the build artifact `test-reports`
6. Upload of `coverage/lcov.info` to Coveralls

Steps 3 to 6 also run when tests fail, so every run produces a report and a coverage value.

Coverage is measured only for the 10 functions under test, `src/.internal/` is excluded. The thresholds in [`.c8rc.json`](.c8rc.json) apply to each file: 95 % lines and statements, 90 % branches, 100 % functions.

## Defect tracking

Defects are GitHub issues with the title format `[R-nn][function] short description` and the labels `defect`, `severity: …`, `priority: …` and `status: …`.

| Status | Meaning |
| --- | --- |
| `status: new` | Reported by one group member, with the failing test and the CI run |
| `status: confirmed` | Reproduced by the second group member |

The test plan also defines the states Fixed, Verified (the test passes in CI) and Closed, as well as Rejected and Duplicate. No defect has been fixed so far, so these states are not used yet.
