async function createUser(data) {
  const res = await fetch(`http://app:3000/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

async function getAllUsers() {
  const res = await fetch("http://app:3000/users");
  return await res.json();
}

async function getUser(email) {
  const res = await fetch(`http://app:3000/users?email=${email}`);
  const rows = await res.json();
  return rows[0];
}

async function deleteUser(data) {
  const res = await fetch(`http://app:3000/users?email=${data.email}`, {
    method: "DELETE",
  });

  return await res.json();
}

module.exports = { createUser, deleteUser, getUser, getAllUsers };
