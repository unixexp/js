#!/usr/bin/env bash

# Run 'source env.sh' to set aliases to current version NodeJS

NODE_INSTALL_PATH="/Users/unixexp/Soft/node"
export PATH="${NODE_INSTALL_PATH}:$PATH"
alias node="${NODE_INSTALL_PATH}/bin/node"
alias npm="${NODE_INSTALL_PATH}/bin/npm"
alias npx="${NODE_INSTALL_PATH}/bin/npx"
