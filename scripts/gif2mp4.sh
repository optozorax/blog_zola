#!/bin/bash

for i in `fd ".gif"`;
do
    ~/my/zola_opto/scripts/encode.sh $i
done
