const presence = new Map();

function add(socketId, user) {
  presence.set(socketId, { socketId, ...user, lastSeen: new Date() });
}

function remove(socketId) {
  presence.delete(socketId);
}

function getOnline() {
  return Array.from(presence.values()).map(u => ({ socketId: u.socketId, id: u.id, name: u.name, email: u.email, role: u.role, lastSeen: u.lastSeen }));
}

function findByUserId(userId) {
  return Array.from(presence.values()).find(u => String(u.id) === String(userId));
}

module.exports = { add, remove, getOnline, findByUserId };
