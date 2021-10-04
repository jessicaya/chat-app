const { rawListeners } = require("../app");

const users = [];
const addUser = ({ id, username, room }) => {
  const user = username.trim().toLowerCase();
  const r = room.trim().toLowerCase();
  if (!user || !r) {
    return { error: "username and room are required" };
  }

  const existingUser = users.find((u) => u.username === user && u.room === r);
  if (existingUser) {
    return { error: "username already joined" };
  }
  const newUser = { id, username: user, room: r };
  users.push(newUser);
  return { user: newUser };
};

const removeUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((u) => u.id === id);
};

const getUserInRoom = (room) => {
  return users.filter((u) => u.room === room);
};

module.exports = {
  getUser,
  addUser,
  removeUser,
  getUserInRoom,
};

// addUser({ id: 1, username: "jes", room: "r1" });
// const r2 = addUser({ id: 2, username: "suzy", room: "r1" });
// console.log(r2);
// const { error, user } = r2;
// if (error) {
//   console.log("error" + error);
// }
// addUser({ id: 3, username: "mark", room: "r1" });
// addUser({ id: 4, username: "jenny", room: "r2" });

// console.log(users);
// console.log(getUserInRoom("r1"));
// const jen = getUser(4);
// console.log(jen);
// const result = removeUser(3);
// console.log("removed user: " + result);
// console.log(users);
// console.log(getUserInRoom("r2"));
