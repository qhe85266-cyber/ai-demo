#!/usr/bin/env bash
# 用法：admin-api.sh METHOD PATH [JSON_BODY]
# 读取 .env 里的 ADMIN_PASSWORD 登录本地后台（不打印密码），cookie 存在 /tmp，权限 600。
set -euo pipefail
API=http://127.0.0.1:3001
JAR=/tmp/aihot-admin.cookies
umask 077
if ! curl -sf -b "$JAR" "$API/api/admin/me" -o /tmp/aihot-me.json 2>/dev/null; then
  pw=$(mktemp); grep -E '^ADMIN_PASSWORD=' /workspace/AIHOT/.env | cut -d= -f2- | tr -d '\n' > "$pw"
  curl -s -c "$JAR" -o /dev/null --data-urlencode "password@$pw" --data-urlencode "return=/admin" "$API/api/auth/password"
  rm -f "$pw"
  curl -sf -b "$JAR" "$API/api/admin/me" -o /tmp/aihot-me.json
fi
csrf=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("/tmp/aihot-me.json","utf8")).csrf)')
m=$1; p=$2; shift 2
if [ $# -gt 0 ]; then
  curl -s -b "$JAR" -X "$m" -H "x-csrf-token: $csrf" -H 'content-type: application/json' --data "$1" "$API$p"
else
  curl -s -b "$JAR" -X "$m" -H "x-csrf-token: $csrf" "$API$p"
fi
