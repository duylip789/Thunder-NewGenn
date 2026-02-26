#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Cài đặt các thư viện trong package.json
npm install

# 2. Tải trình duyệt Chromium về máy chủ Render
# Đây là bước quan trọng nhất để Bot có "mắt"
echo "...Installing Chromium"
npx puppeteer install
