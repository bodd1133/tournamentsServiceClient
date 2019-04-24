#! /usr/bin/env bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$SCRIPT_DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $SCRIPT_DIR/..

COMMON_SCRIPTS_DIR="node_modules/@seneca/service-framework/common-scripts"
FRAMEWORK_INSTALLED_DIR=$(while [ $PWD != "/" ]; do test -e ${COMMON_SCRIPTS_DIR} && { pwd; break; }; cd .. ; done)

if [[ "$FRAMEWORK_INSTALLED_DIR" == "" ]]; then
    echo "$COMMON_SCRIPTS_DIR not found."
    exit 1
fi

export SERVICE_DIR="$(pwd)"
export SCRIPTS_DIR="$FRAMEWORK_INSTALLED_DIR/$COMMON_SCRIPTS_DIR"