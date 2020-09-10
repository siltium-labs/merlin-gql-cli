import { AuthenticationError } from "apollo-server";
import { it } from "mocha";
import { expect } from "chai";
import { kebabCase } from "./new";

describe("New Command", () => {
  it("should should snake case the spaces in the app name", () => {
    expect(kebabCase("testApp")).to.equal("test-app");
  });

  it("should should snake case the uppercase characters in the app name", () => {
    expect(kebabCase("test app")).to.equal("test-app");
  });
});
