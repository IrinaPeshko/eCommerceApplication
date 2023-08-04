import { foo } from "./foo";

describe("Jest Tests", () => {
  test("Verify tests work", () => {
    expect(foo()).toBeTruthy();
  });
});
