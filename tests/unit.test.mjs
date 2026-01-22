import { validateName, validateEmail } from "../src/public/lib";

describe("validateName", () => {
  it("valid: >= 3 letters", () => {
    expect(validateName("Joe")).toMatchObject({
      valid: true,
    });
  });

  it("not valid: < 3 letters", () => {
    expect(validateName("ab")).toMatchObject({
      valid: false,
    });
  });

  it("not valid: undefined", () => {
    expect(validateName()).toMatchObject({
      valid: false,
    });
  });
});

describe("validateEmail", () => {
  it("valid: passes regex test", () => {
    expect(validateEmail("a@b.com")).toMatchObject({
      valid: true,
    });
  });

  it("not valid: doesn't pass regex test", () => {
    expect(validateEmail("a(at)b(dot)com")).toMatchObject({
      valid: false,
    });
  });

  it("not valid: undefined", () => {
    expect(validateEmail()).toMatchObject({
      valid: false,
    });
  });
});
