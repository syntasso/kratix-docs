FROM "alpine"

RUN apk update && apk add --no-cache yq kubectl

COPY scripts/* /usr/local/bin/
ADD resources resources

RUN chmod +x /usr/local/bin/*

# Fix for when running workshop on Windows machine
RUN apk update && apk add --no-cache dos2unix file
RUN for f in /usr/local/bin/*; do \
    file --mime-encoding "$f" | grep -q "binary" || dos2unix "$f"; \
done

ENTRYPOINT []
