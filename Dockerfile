FROM node:alpine

RUN adduser -S revelio
USER revelio

# Root path for file contents within the container
WORKDIR '/home/revelio'

# Entry point (express server)
COPY target/server/bundle.middleware.js .

# Static bundle chunks
COPY target/webapp/* ./target/webapp/

# Start server and create log
CMD exec node bundle.middleware.js > revelio.log 2>&1
