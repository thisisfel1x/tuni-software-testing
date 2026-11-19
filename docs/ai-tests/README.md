# AI-generated tests for chunk and toNumber

The test files in `test/ai/` were written by an AI, not by the group. We keep them for the comparison with our own tests (`test/chunk.test.js`, `test/toNumber.test.js`) in the final report.

| File | Content |
| --- | --- |
| `chunk.prompt.md`, `toNumber.prompt.md` | The prompt, exactly as it was sent |
| `chunk.response.md`, `toNumber.response.md` | The complete answer, unchanged |
| `../../test/ai/chunk.ai.test.js`, `../../test/ai/toNumber.ai.test.js` | The code block from the answer, copied without any change |

## How the tests were generated

- Model: Claude Opus 5.5 (Anthropic), 2026-11-19. It was started from Claude Code as a new agent with an empty context, one agent per function.
- The agents used no tools (checked in the transcripts). So they did not see the repository, the test plan, our tests or the issues.
- The prompt contains only the source of the file under test (`src/chunk.js` or `src/toNumber.js`), not the source of the functions it imports (`slice`, `toInteger`, `isObject`, `isSymbol`).
- The prompt asks for expected values taken from the JSDoc and the documented purpose, not from the implementation, and says that tests that find a defect must stay red.
- No test and no expected value was changed after generation, including the non-breaking spaces (U+00A0) in AI-TN-57.

## Results

Local run on macOS, Node 25.9.0, commit 4a7b26c:

| File | Tests | Passed | Failed | Failures predicted by the AI |
| --- | --- | --- | --- | --- |
| `chunk.ai.test.js` | 31 | 12 | 19 | 16 |
| `toNumber.ai.test.js` | 59 | 57 | 2 | 2 |

Line, branch and function coverage of `chunk.js` and `toNumber.js` is 100 % with and without the AI tests.

### chunk

- 16 tests fail because of R-05 (#5, `resIndex` is never increased): AI-CH-01 to 07, 14, 15, 23, 24, 25, 26, 28, 30 and 31. The AI found this defect in the source and predicted exactly these tests.
- 3 tests fail only because of R-04 (#4, `slice` does not limit `end`): AI-CH-09, 13 and 18. The AI did not see `slice.js` and expected them to pass.
- AI-CH-18 is a case our own tests do not cover: `chunk(['a', 'b', 'c'], Infinity)` returns `[[]]` instead of `[['a', 'b', 'c']]`. `toInteger(Infinity)` gives `Number.MAX_VALUE`, and `slice` with this end returns an empty array.
- Counting error in the answer: it lists 16 failing and 15 passing test IDs, but writes "17" and "14".

### toNumber

- AI-TN-48: `toNumber(10n)` throws `TypeError: Cannot convert a BigInt value to a number`.
- AI-TN-49: `toNumber(Object.create(null))` throws `TypeError: Cannot convert object to primitive value`.
- Both expected values come from reading `@returns {number}` as "never throws". The JSDoc does not say this directly, and the original lodash `toNumber` behaves the same. Neither input occurs in S1 to S3.
- **Open:** the group still has to decide whether these are defects (new issues) or a wrong oracle of the AI (change the test in a separate commit). Until then they stay red, as the test plan requires.

## Notes for the comparison in the report

- The AI tests do not use test doubles. `chunk` is only tested with the real `slice`, so R-04 and R-05 cannot be told apart. Our CH-12 and CH-13 replace `slice` with testdouble for this.
- The AI wrote more tests than our plan (31 vs. 13 test IDs for chunk, 59 vs. 18 for toNumber). Many of them check the same equivalence class again.
- Cases that are new compared to our tests: for chunk, `size` Infinity and explicit `undefined`, input that is not an array (`42`, `{}`) and 1000 products; for toNumber, BigInt, an object with a `null` prototype, a boxed symbol, `Date`, non-breaking spaces, `'1e309'` and unit text (`'2 kg'`, `'500g'`). Currency text was already covered by TN-08 (`'4.50 €'`).
