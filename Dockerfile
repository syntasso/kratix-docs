FROM pierrezemb/gostatic
COPY ./build/ /srv/http
CMD [ "-enable-logging", "-fallback", "index.html" ]

