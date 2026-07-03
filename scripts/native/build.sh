#!/usr/bin/env bash
# Build the native mini crossword solver kernel (mcw_solver) into this
# directory. Bootstraps a local venv for pybind11 headers — no system
# package installs. Requires a C++17 compiler.
set -euo pipefail
cd "$(dirname "$0")"

VENV=.venv
if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet pybind11
fi

INCLUDES=$("$VENV/bin/python" -m pybind11 --includes)
SUFFIX=$(python3 -c "import sysconfig; print(sysconfig.get_config_var('EXT_SUFFIX'))")
PYTHON_INCLUDE=$(python3 -c "import sysconfig; print(sysconfig.get_paths()['include'])")

# -undefined dynamic_lookup is the macOS way to leave CPython symbols
# unresolved until load; Linux shared objects do that by default.
LDFLAGS=""
if [ "$(uname)" = "Darwin" ]; then
  LDFLAGS="-undefined dynamic_lookup"
fi

# shellcheck disable=SC2086
c++ -O3 -std=c++17 -shared -fPIC $LDFLAGS \
  $INCLUDES -I"$PYTHON_INCLUDE" \
  mcw_solver.cpp -o "mcw_solver$SUFFIX"

echo "built mcw_solver$SUFFIX"
