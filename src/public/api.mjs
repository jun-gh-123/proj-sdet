const baseURL = typeof window === "undefined" ? "http://app:3000" : "";

export async function createUser(data) {
  const res = await fetch(`${baseURL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function getAllUsers() {
  const res = await fetch(`${baseURL}/users`);
  return await res.json();
}

export async function getUser(email) {
  const res = await fetch(`${baseURL}/users?email=${email}`);
  const rows = await res.json();
  return rows[0];
}

export async function deleteUser(data) {
  const res = await fetch(`${baseURL}/users/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}
