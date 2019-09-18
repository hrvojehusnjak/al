# al
Async Labs task API
Compare similarity between given number of random bacon ipsum texts

## Installation
    git clone https://github.com/hrc099/al.git
    npm install

## Build & run
To build

    npm run build

To build and run

    npm run start

## Usage
API base url: http://localhost:5050/api/

To use, send a request to base url with query parameters:

`type` sets the type of bacon ipsum text. Value must be 'all-meat' or 'meat-and-filler'
`paras` (optional) sets the number of requested paragraphs. If provided, must be min 1, and max 8
`sentences` sets the number of requested sentences. Must be min 1, max 20
`texts` sets the number of texts to be compared. Must be an **even** number, min 2, max 8

Example requests:

http://localhost:5050/api/?type=meat-and-filler&sentences=16&texts=2
http://localhost:5050/api/?type=meat-and-filler&paras=8&sentences=20&texts=8