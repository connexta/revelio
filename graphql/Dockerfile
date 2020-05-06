FROM node:alpine

RUN adduser -S revelio
RUN mkdir -p /revelio
RUN chown revelio /revelio

USER revelio

# Root path for file contents within the container
WORKDIR /revelio

COPY --chown=revelio:root package.json .
COPY --chown=revelio:root yarn.lock .
RUN yarn install

COPY --chown=revelio:root . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]