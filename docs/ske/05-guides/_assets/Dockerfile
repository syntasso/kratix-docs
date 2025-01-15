FROM ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1

COPY basic-definition /usr/bin/basic-definition
COPY complete-definition /usr/bin/complete-definition
COPY check-redis /usr/bin/check-redis

RUN chmod +x /usr/bin/basic-definition
RUN chmod +x /usr/bin/complete-definition
RUN chmod +x /usr/bin/check-redis

CMD [ "sh", "-c", "pipeline.sh" ]
ENTRYPOINT []