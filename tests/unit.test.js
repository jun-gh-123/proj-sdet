const { validateName, validateEmail } = require("../src/lib");

test("validateName: >= 3 letters", () => {
  expect(validateName("Joe")).toBe(true);
});

test("validateName: < 3 letters", () => {
  expect(validateName("ab")).toBe(false);
});

test("validateEmail: true", () => {
  expect(validateEmail("a@b.com")).toBe(true);
});

test("validateEmail: false", () => {
  expect(validateEmail("a(at)b(dot)com")).toBe(false);
});
