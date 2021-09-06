#!/bin/bash

# First argument: input file (may be another video, gif or folder with pictures,
# read ffmpeg docs).
#
# Second argument optional: quality. for default it is 35 (averagely bad 
# quality), you can provide 22 as nice quality.
#
# Third argument optional: can be "mute" to mute or anything else to not to.
#
# Out is file with `_web` postfix and `mp4` format scaled down to 1280 max 
# width or height or not scaled if initial size is smaller
# 
# Command get from https://gist.github.com/jaydenseric/220c785d6289bcfd7366

filename=$(basename -- "$1")
extension="${filename##*.}"
filename="${filename%.*}"
path="${1%/*}"

if [ ${3:-"preserve_audio"} == "mute" ]
then
	audio="-an"
else
	audio="-c:a aac -strict experimental"
fi

ffmpeg -y \
       -i $1 \
       -c:v libx264 \
       -pix_fmt yuv420p \
       -profile:v baseline \
       -level 3.0 \
       -crf ${2:-35} \
       -preset veryslow \
       -vf "scale=ceil(iw*min(1\,1280/iw)/2)*2:ceil(ow/dar/2)*2" \
       ${audio} \
       -movflags +faststart \
       -threads 0 \
       ${path}/${filename}_web.mp4