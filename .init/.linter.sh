#!/bin/bash
cd /home/kavia/workspace/code-generation/vendor-parameter-mapper-845-855/vendor_parameter_mapping_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

