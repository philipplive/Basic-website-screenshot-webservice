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

Its also posible to create interesting overviews from a height website:
![Open the URL in a browser](preview-long.jpg)


## Installation
* Install node.js 
* Install Chrome

## Todo list
- [ ] Parametervalidator Class
- [ ] Errorhandling for none-reachable/http-statuscode/etc.