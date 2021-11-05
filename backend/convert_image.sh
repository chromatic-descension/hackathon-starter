#!/bin/bash
# $1 = content path
# $2 = style path
# $3 = output path
# $4 = scale in pixels (biggest dimension)
source ~/anaconda3/etc/profile.d/conda.sh;
conda activate art;
style_transfer --web --port 8081 \
    --end-scale $4 \
    $1 $2 -o "$3";