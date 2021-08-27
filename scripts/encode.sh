#!/bin/bash

# first argument must be input
# second argument may be quality. for default it is 35, you can provide 22 as nice quality

filename=$(basename -- "$1")
extension="${filename##*.}"
filename="${filename%.*}"
path="${1%/*}"

not_audio="-an"
audio="-c:a aac -strict experimental"

ffmpeg -y -i $1 -c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 3.0 -crf ${2:-35} -preset veryslow -vf "scale=ceil(iw*min(1\,1280/iw)/2)*2:ceil(ow/dar/2)*2" ${audio} -movflags +faststart -threads 0 ${path}/${filename}_web.mp4