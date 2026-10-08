const root = '/workspace/AIHOT';
const node = '/usr/local/bin/node';
const logs = '/workspace/AIHOT-setup/logs';
module.exports = {
  apps: [
    { name: 'myhot-api', cwd: root, script: 'apps/api/src/main.ts' },
    { name: 'myhot-worker', cwd: root, script: 'apps/worker/src/main.ts', kill_timeout: 210000 },
    { name: 'myhot-web', cwd: root + '/apps/web', script: 'server.ts', node_args: '--env-file=../../.env' },
  ].map(app => ({
    interpreter: node,
    node_args: '--env-file=.env',
    env: { NODE_ENV: 'production', LLM_API_KEY: process.env.DEEPSEEK_API_KEY || '' },
    autorestart: true,
    restart_delay: 3000,
    out_file: logs + '/' + app.name + '.out.log',
    error_file: logs + '/' + app.name + '.error.log',
    ...app,
  })),
};
