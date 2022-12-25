# image-processing-api

# Image Processing API

This is an API program that transforms full-sized images into thumbnail images.

The entire application is developed with the following languages/frameworks:
  - Typescript
  - NodeJs
  - Express
  - Jasmine

## Install dependencies 

    npm install

## Run prettier

    npm run prettier

## Run eslint

    npm run lint

## Transpile TypeScript to JavaScript

    npm run build

## Start the express server

    npm run start

## Run tests with Jasmine

    npm run jasmine

## Transpile and run the tests

    npm run test

# REST API

The REST API to the example app is described below.

## Get the name and path of all full-sized images located in the images directory

### Request

`GET /api`

    http://localhost:3000/api

### Response

    [{"image":"encenadaport.jpg","imagePath":"images/full/encenadaport.jpg"},{"image":"fjord.jpg","imagePath":"images/full/fjord.jpg"},{"image":"icelandwaterfall.jpg","imagePath":"images/full/icelandwaterfall.jpg"},{"image":"palmtunnel.jpg","imagePath":"images/full/palmtunnel.jpg"},{"image":"santamonica.jpg","imagePath":"images/full/santamonica.jpg"}]


## Get a thumbnail image specifying query string for the desired width and height

### Request

`GET /api/:imageName/?width&height`

    localhost:3000/api/fjord/?width=200&height=200

### Response

    <img src="http://localhost:3000/api/fjord/?width=200&amp;height=200" alt="http://localhost:3000/api/fjord/?width=200&amp;height=200" class="shrinkToFit" width="196" height="196">

## Get a thumbnail image without specifying query string for the desired width and height

### Request

`GET /api/:imageName`

    Resize parameters not specified, please try again.

### Response

    <img src="http://localhost:3000/api/fjord/?width=200&amp;height=200" alt="http://localhost:3000/api/fjord/?width=200&amp;height=200" class="shrinkToFit" width="196" height="196">

## Get a non-existent Image

### Request

`GET /api/:imageName/?width&height`

    localhost:3000/api/sammy/?width=200&height=200

### Response

    No image matched your search. Please try again.
