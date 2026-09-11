#!/bin/bash
# Generate high-resolution Prasha Infotech brand logo PNG with ImageMagick
# 720x220 transparent background with metallic gold emblem and text

convert -size 720x220 xc:none \
  -stroke '#E5C065' -strokewidth 5 -fill none -draw "circle 110,110 110,18" \
  -stroke '#B58A18' -strokewidth 4 -fill none -draw "circle 110,110 110,28" \
  -stroke none -fill '#FAF0C8' -draw "path 'M 72,82 L 87,82 L 87,156 L 72,156 Z'" \
  -fill '#E5C065' -draw "path 'M 87,82 L 126,82 Q 152,82 152,108 Q 152,134 126,134 L 87,134 Z'" \
  -fill none -stroke '#171817' -strokewidth 12 -draw "path 'M 99,94 L 122,94 Q 138,94 138,108 Q 138,122 122,122 L 99,122 Z'" \
  -fill '#E5C065' -stroke none -draw "path 'M 112,82 Q 100,50 116,28 Q 128,48 122,62 Q 136,46 142,56 Q 146,68 136,82 Z'" \
  -font Helvetica-Bold -pointsize 62 -fill '#E5C065' -draw "text 236,104 'PRASHA'" \
  -font Helvetica-Bold -pointsize 54 -fill '#B58A18' -draw "text 238,166 'INFOTECH'" \
  /app/applet/public/logo.png

ls -lh /app/applet/public/logo.png
