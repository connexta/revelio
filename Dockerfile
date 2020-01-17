FROM node:alpine

RUN adduser -S revelio
USER revelio

# Root path for file contents within the container
WORKDIR '/revelio'

# Entry point (express server)
COPY --chown=revelio:root target/server/bundle.middleware.js .

# Static bundle chunks
COPY --chown=revelio:root target/webapp/* ./target/webapp/

CMD ["node", "bundle.middleware.js"]
