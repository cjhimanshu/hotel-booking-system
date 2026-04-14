const { spawn } = require('child_process');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const processes = [];
let isShuttingDown = false;

function startProcess(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    console.error(
      `\n${name} exited with code ${code ?? signal}. Stopping the other process.`
    );
    shutdown(code ?? 1);
  });

  child.on('error', (error) => {
    if (isShuttingDown) {
      return;
    }

    console.error(`\nFailed to start ${name}:`, error);
    shutdown(1);
  });

  processes.push(child);
}

function shutdown(exitCode) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

startProcess(
  'server',
  'npm',
  ['run', 'dev', '--prefix', 'server'],
  workspaceRoot
);
startProcess(
  'client',
  'npm',
  ['run', 'dev', '--prefix', 'client'],
  workspaceRoot
);
