FROM "alpine"

RUN apk update && apk add --no-cache yq ruby

ADD scripts/pipeline.rb /usr/bin/pipeline.rb
ADD resources resources

RUN chmod +x /usr/bin/pipeline.rb

CMD [ "sh", "-c", "pipeline.rb" ]
ENTRYPOINT []
