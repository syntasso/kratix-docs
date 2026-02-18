FROM "alpine"

RUN apk update && apk add --no-cache yq kubectl

COPY scripts/* /usr/local/bin/
ADD resources resources

RUN chmod +x /usr/local/bin/*

# Fix for when running workshop on Windows machine
RUN apk update && apk add --no-cache dos2unix
RUN find /usr/local/bin -type f ! -name terraform \
    -exec file {} \; | grep text | cut -d: -f1 | xargs dos2unix

ENTRYPOINT []
