FROM node:alpine

# Root path for file contents within the container
WORKDIR '/revelio'

# Entry point (express server)
COPY target/server/bundle.middleware.js .

# Static bundle chunks
COPY target/webapp/* ./public/

CMD ["node", "bundle.middleware.js"]
