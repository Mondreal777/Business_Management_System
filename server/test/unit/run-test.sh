#!/bin/bash

cd /mnt/c/Development/foresight/online-pos/pos-api


# echo "$ JUICE_CONFIG=${TARGET}/opt/Development/Projects/reborn/reborn-api-config/config/config.json"
        # JUICE_CONFIG="file:::${TARGET}/opt/Development/Projects/reborn/reborn-api-config/config/config.json"

# Run the test
for test in ${*} ; do
    echo Running test ${test}...

    npx ava --verbose test/unit/${test}
done