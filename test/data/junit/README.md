# JUnit test data generation

## Maven / Gradle

```java
class JavaJUnitSuite1Tests {
  @Test void case11() { assertTrue(true); }
  @Test void case12() { assertTrue(true); }
  @Test void case13() { assertTrue(true); }
  @Test void case14() { throw new RuntimeException("error"); }
  @Test void case15() { assertTrue(false); }
  @Test @Disabled("skipped") void case16() { /* skip */ }
}

class JavaJUnitSuite2Tests {
  @Test void case21() { assertTrue(true); }
  @Test void case22() { assertTrue(false); }
  @Test @Disabled("skipped") void case23() { /* skip */ }
}
```

## Node.js / Mocha

- **Node.js**: `node --test --test-reporter=junit --test-reporter-destination=report.xml tests.js`
- **Mocha**: `mocha --reporter mocha-junit-reporter tests.js`

```js
describe("JUnit test suite 1", () => {
  it("Case 1.1", () => { assert(true); });
  it("Case 1.2", () => { assert(true); });
  describe("Nested suite 1.3", () => {
    it("Case 1.3.1", () => { assert(true); });
    it("Case 1.3.2", () => { assert(true); });
    it("Case 1.3.3", () => { assert(true); });
    it("Case 1.3.4", () => { assert(false); });
    it("Case 1.3.5", () => { assert(false); });
    it.skip("Case 1.3.6", () => { /* skip */ });
  });
  it("Case 1.4", () => { assert(true); });
  it("Case 1.5", () => { assert(false); });
  it("Case 1.6", () => { assert(false); });
  it.skip("Case 1.7", () => { /* skip */ });
});

describe("JUnit test suite 2", () => {
  it("Case 2.1", () => { assert(true); });
  it("Case 2.2", () => { assert(false); });
  it.skip("Case 2.3", () => { /* skip */ });
});
```
