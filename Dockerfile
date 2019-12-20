FROM node:alpine

RUN adduser -S revelio -G root 
USER revelio

# Root path for file contents within the container
WORKDIR '/home/revelio'

# Entry point (express server)
COPY --chown=revelio:root target/server/bundle.middleware.js .

# Static bundle chunks
COPY --chown=revelio:root target/webapp/* ./target/webapp/

# Start server and create log
CMD exec node bundle.middleware.js > revelio.log 2>&1
