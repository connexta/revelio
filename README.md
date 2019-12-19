# revelio

[![Build Status](https://travis-ci.org/connexta/revelio.svg?branch=master)](https://travis-ci.org/connexta/revelio)

Revelio is a sandbox for migrating
[Intrigue](https://github.com/codice/ddf/tree/master/ui/packages/catalog-ui-search)
features off of Backbone and Marionette towards GraphQL and React.

## Why are we doing this?

There are several reasons for this that will be covered in the
architecture section but the gist of it is that we have hit limitations,
both in terms of complexity and performance, and need to make these
changes so we can continue growing our software. Our goals are to
component-ize Intrigue to make it easier to build other similar
application and reduce the overall complexity budget required to develop
new features.

## How are we doing this?

The intention is to keep revelio as as separate project from
[DDF](https://github.com/codice/ddf) (as that is inline with the current
efforts to split apart the system) and gradually port over features into
revelio. In time, when components start to stabilize, we will port them to
[atlas](https://github.com/connexta/atlas) or dedicated spaces for more
specialized components, such as
[geospatialdraw](https://github.com/connexta/geospatialdraw).

## Getting Started

Revelio should be run alongside an instance of [DDF](https://github.com/codice/ddf).
Changes made on DDF (creating/deleting workspaces, result forms, etc.) will
then be reflected in Revelio.

    mvn clean install
    copy over the jar generated in the targets directory over to the deploy folder of your ddf distribution
    yarn install
    yarn start

### Production

To run the production JavaScript code, do:

    yarn build:prod

And then to start the node process, do:

    yarn start:prod

### Docker

Docker containers can be found
[here](https://hub.docker.com/repository/docker/cnxta/revelio) and can be
run with the following command:

    docker run --rm -it -p 4000:4000 -e DDF_LOCATION=<ddf-url> cnxta/revelio:<version>

**NOTE**: the docker container needs network access to DDF for this to
work.

## Architecture

To get a deeper look into the system, take a look at the
[architecture](./docs/architecture.md) docs.
