import { AuthenticationError } from "apollo-server";
import { IGqlContext } from "./../context";
import { it } from "mocha";
import { expect } from "chai";
import { mustBeAuthenticated, mustHaveRole } from "./security.decorators";

const mockAdminRole = "administrator";

const mockEmptyContext: IGqlContext = {};
const mockUserContext: IGqlContext = {
  user: {
    id: 1,
    username: "admin",
    role: mockAdminRole,
  },
};

describe("Security", () => {
  it("should throw an error if user not in context", () => {
    expect(() => mustBeAuthenticated(mockEmptyContext)).to.throw();
  });

  it("should throw an error if user isn't administrator ", () => {
    expect(() => mustHaveRole(mockEmptyContext, mockAdminRole)).to.throw();
  });

  it("should not throw because user is in context", () => {
    expect(() => mustBeAuthenticated(mockUserContext)).to.not.throw();
  });

  it("should not throw because user is administrator", () => {
    expect(() => mustHaveRole(mockUserContext, mockAdminRole)).to.not.throw();
  });
});
