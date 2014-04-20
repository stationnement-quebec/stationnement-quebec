stationnement-quebec
====================

## Dependencies

Dependencies can be installed with `npm install`, assuming you have node installed.

togeojson also needs to be installed as a command line utility (`npm install -g togeojson`). Also because we use togeojson as a command line utility, the server is only compatible with Linux or Mac right now.

For tests, mocha is also required : `npm install -g mocha`.

## Server

Server can be started with

`node server.js`

## Deployement

Deployement can be done with `cap deploy`, done in the project directory. Capistrano 2 is required.

You should also have SSH access to the server.

## Test

`mocha test/*.js`
