#!/bin/bash

cd $(dirname $0)
npm run build
time=$(date +"%Y/%m/%d %H:%M")
str="console.log('[moelyrics.min.js] build time: ${time}')"
sed -i "1i\\${str}" dist/moelyrics.min.js
