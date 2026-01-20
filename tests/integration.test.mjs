import {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
} from "../src/public/api";

const ts = Date.now();
const testUser = {
  name: `user${ts}`,
  email: `user${ts}@email.com`,
};

const usersToDelete = [];

describe("Users API", () => {
  beforeEach(async () => {
    await createUser(testUser);
  });

  afterEach(async () => {
    await deleteUser(testUser);

    for (const user of usersToDelete) {
      await deleteUser(user);
    }
  });

  it("should create a user", async () => {
    const testUser2 = {
      name: "tu2" + testUser.name,
      email: "tu2" + testUser.email,
    };

    const createResult = await createUser(testUser2);
    expect(createResult.name).toBe(testUser2.name);
    expect(createResult.email).toBe(testUser2.email);

    usersToDelete.push(createResult);
  });

  it("should delete testUser", async () => {
    const deleteResult = await deleteUser(testUser);
    expect(deleteResult.name).toBe(testUser.name);
    expect(deleteResult.email).toBe(testUser.email);
  });

  it("should get testUser", async () => {
    const getResult = await getUser(testUser.email);
    expect(getResult.name).toBe(testUser.name);
    expect(getResult.email).toBe(testUser.email);
  });

  it("should get all users", async () => {
    const usersToTest = {
      [testUser.email]: testUser,
    };

    for (let i = 0; i < 5; i++) {
      const u = {
        name: "u" + i + testUser.name,
        email: "u" + i + testUser.email,
      };

      usersToTest[u.email] = u;

      usersToDelete.push(await createUser(u));
    }

    const getAllResult = await getAllUsers();
    let numFoundTestUsers = 0;

    for (let user of getAllResult) {
      const tu = usersToTest[user.email];

      if (tu) {
        if (tu.name === user.name && tu.email === user.email) {
          numFoundTestUsers++;
        }
      }
    }

    expect(numFoundTestUsers).toBe(Object.keys(usersToTest).length);
  });
});
