---
description: recording rtsp stream with ffmpeg
date: 2020-01-02T12:00:00+0000

meta:
  - name: keywords
    content: ffmpeg rtsp h264 stream

feed:
  enable: true
---

# Recording rtsp stream

### Details

```ffmpeg \
-rtsp_transport tcp \
-i "rtsp://user:pass@192.168.178.123:554/live"  \
-f segment \
-segment_time 10 \
-segment_format mp4 \
-reset_timestamps 1 \
-c copy \
-map 0 \
-strftime 1 \
-an \
camera-%Y%m%d-%H%M%S.mp4
```

### inspiration

https://gist.github.com/mowings/6960b8058daf44be1b4e

<disqus />
