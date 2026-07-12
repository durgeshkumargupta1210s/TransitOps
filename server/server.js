require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transitops';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Integrate Socket.IO for realtime features
    const { Server } = require('socket.io');
    const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });
    // attach io to app for route handlers
    app.set('io', io);

    const jwt = require('jsonwebtoken');
    const User = require('./models/user');
    const presence = require('./utils/presence');

    io.on('connection', socket => {
      console.log('socket connected', socket.id);

      socket.on('authenticate', async (token) => {
        try {
          if (!token) return;
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          const user = await User.findById(decoded.id).select('-password');
          if (!user) return;
          presence.add(socket.id, { id: user._id, name: user.name, email: user.email, role: user.role });
          io.emit('presence:update', presence.getOnline());
        } catch (e) {
          console.warn('socket authenticate failed', e.message || e);
        }
      });

      socket.on('logout', () => {
        presence.remove(socket.id);
        io.emit('presence:update', presence.getOnline());
      });

      socket.on('disconnect', () => {
        presence.remove(socket.id);
        io.emit('presence:update', presence.getOnline());
        console.log('socket disconnected', socket.id);
      });
    });

    // license reminder - simple interval
    const reminder = require('./services/licenseReminder');
    setInterval(() => { reminder.checkExpiries().catch(console.error); }, 1000*60*60*24);
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
