#!/usr/bin/env bash
set -euo pipefail
export PM2_HOME=/workspace/AIHOT-setup/runtime/pm2
pm2=/workspace/AIHOT-setup/runtime/process-manager/node_modules/.bin/pm2
case "${1:-status}" in
  start)
    sudo pg_ctlcluster 17 main status >/dev/null 2>&1 || sudo pg_ctlcluster 17 main start
    "$pm2" start /workspace/AIHOT-setup/ecosystem.config.cjs
    ;;
  restart) "$pm2" restart /workspace/AIHOT-setup/ecosystem.config.cjs --update-env ;;
  stop) "$pm2" stop myhot-api myhot-worker myhot-web ;;
  status) "$pm2" status ;;
  logs) "$pm2" logs --lines 30 ;;
  *) echo '用法：bash /workspace/AIHOT-setup/manage.sh start|restart|stop|status|logs'; exit 2 ;;
esac
