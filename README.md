# backend assignment

## tech stack
- node.js (version 18)
- javascript (didn't choose typescript because didn't want to spend time setting up, in prod version I'd have choosen typescript)
- sqllite (it's a simple cli so I wanted to use something lightweight)
- sequalize (orm to make things maintainable)
- node fetch (because fetch api in node is not so stable)
- node-html-parser (to parse html coming from downloaded pages)
- yargs (to parse input args)

## Folder structure
- models -> contain the model to store metadata.
- services -> contain the services used by fetch CLI (file, parsing and db service).
- fetchCli -> this is the driver to basically run the cli.

## How to run

#### Note
 I've created a `fetch` command but if you want to run it like `./fetch` then you can also do `./index.js` instead of `./fetch` or just use the command fetch. I hope that's okay. 

### Using docker
- build the image \
`docker build . -t rohanhacker/autify`
- run the container \
`docker run -it -d rohanhacker/autify`
- get container id \
`docker ps`
- go inside container \
`docker exec -it {container id} /bin/bash`
- use command fetch url to fetch a url or pass multiple urls
for example: \
`fetch https://google.com http://rohan.com`
- use flag --metadata to get metadata of an url for example" \
`fetch --metadata http://rohan.com`

### Without docker
- npm install
- npm link
- use command fetch url to fetch a url or pass multiple urls
for example: \
`fetch https://google.com http://rohan.com`
- use flag --metadata to get metadata of an url for example" \
`fetch --metadata http://rohan.com`

## Video Demo

https://user-images.githubusercontent.com/9512969/217803754-03bb31c7-d862-4e04-bf33-cce36b556eb1.mov

