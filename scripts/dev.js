const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

const server = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  cwd: path.join(root, 'server'),
  stdio: 'inherit',
  shell: false,
});

const client = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  cwd: path.join(root, 'client'),
  stdio: 'inherit',
  shell: false,
});

const shutdown = (code = 0) => {
  if (!server.killed) server.kill();
  if (!client.killed) client.kill();
  process.exit(code);
};

server.on('exit', code => shutdown(code || 0));
client.on('exit', code => shutdown(code || 0));

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
