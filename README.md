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

    yarn start

## Architecture

To get a deeper look into the system, take a look at the
[architecture](./docs/architecture.md) docs.
