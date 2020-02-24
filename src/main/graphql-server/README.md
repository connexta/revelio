# GraphQL Tools

## Capture

To enable capturing examples request/response from the GraphQL endpoint,
do:

    GRAPHQL_CAPTURE=1 yarn start

To fetch the examples, use the
[captures](http://localhost:8080/graphql/captures) endpoint. For example:

    curl http://localhost:8080/graphql/captures

## Replay

To replay captures, use the [replay-captures.js](./replay-captures.js)
script. For example:

    curl http://localhost:8080/graphql/captures | ./replay-captures.js

or

    curl http://localhost:8080/graphql/captures > captures.json # do this once
    cat captures.json | ./replay-captures.js # do this as you iterate on code

It will output if any of the responses differ from the previously captured
responses.

## Chaos Mode

Chaos mode enables a 10% random failure for use in development.

To enable chaos mode, do:

    CHAOS_MODE=1 yarn start