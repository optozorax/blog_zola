#!/bin/bash

for i in `fd ".mp4"`;
do
    ~/my/zola_opto/scripts/encode.sh ./$i 26
done
