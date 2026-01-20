import { validateName, validateEmail } from "../src/public/lib";

test("validateName: >= 3 letters", () => {
  expect(validateName("Joe")).toMatchObject({
    valid: true,
  });
});

test("validateName: < 3 letters", () => {
  expect(validateName("ab")).toMatchObject({
    valid: false,
  });
});

test("validateEmail: valid", () => {
  expect(validateEmail("a@b.com")).toMatchObject({
    valid: true,
  });
});

test("validateEmail: invalid", () => {
  expect(validateEmail("a(at)b(dot)com")).toMatchObject({
    valid: false,
  });
});
