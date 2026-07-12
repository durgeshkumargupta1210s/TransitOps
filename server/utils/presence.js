const onlineUsers = new Map();

function add(socketId, user) {
  onlineUsers.set(socketId, {
    socketId,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastSeen: new Date(),
  });
}

function remove(socketId) {
  onlineUsers.delete(socketId);
}

function update(socketId) {
  if (onlineUsers.has(socketId)) {
    onlineUsers.get(socketId).lastSeen = new Date();
  }
}

function getOnline() {
  return [...onlineUsers.values()];
}

function findByUserId(userId) {
  return [...onlineUsers.values()].find(
    (user) => String(user.id) === String(userId)
  );
}

function count() {
  return onlineUsers.size;
}

module.exports = {
  add,
  remove,
  update,
  getOnline,
  findByUserId,
  count,
};