# Basic website screenshot webservice

## Usage example
Start the web-service in the CMD:
```
node C:\Users\Administrator\Desktop\imageservice\test.js
```

Open your browser and connect to the service with all parameters:
```
https://[[SERVICE-IP]]:5512/?url=http://thewebsite.ch/&width=1500&height=1500&secret=123456&zoom=0.1
```

You should get the folowing output:
![Open the URL in a browser](preview.jpg)


## Installation

* Install node.js 
* Install Chrome

## TODO list
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item