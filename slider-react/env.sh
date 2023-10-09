#!/usr/bin/env bash

# Run 'source env.sh' to set aliases to current version NodeJS

NODE_INSTALL_PATH="/Users/unixexp/Soft/node/bin/"
export PATH="${NODE_INSTALL_PATH}:$PATH"
alias npm="${NODE_INSTALL_PATH}npm"
alias npx="${NODE_INSTALL_PATH}npx"
