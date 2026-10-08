#!/usr/bin/env bash
# 追加一条带北京时间的监工日志
echo "- $(date +%H:%M) $*" >> /workspace/AIHOT-监工日志.md
