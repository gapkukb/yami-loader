# yami-loader

### A simple library to dynamic import script and css and jsonp

### surpport typescript;

# Install

```
pnpm add yami-loader
// or
yarn add yami-loader
// or
npm install yami-loader
```

# Import

```
import yamiLoader from 'yami-loader';
```

OR

```
import { yamiLoader } from 'yami-loader';
```

# Examples

## For script

```
// options is optional with html link element attributes
yamiLoader
    .loadScript("/demo.js" /** options */)
    .then((el) => {
        // el is HTMLScriptElement
        // do something after loaded at here
    });

```

## For css

```
// options is optional with html script element attributes
yamiLoader
    .loadCss("/demo.css" /** options */)
    .then((el) => {
        // el is HTMLLinkElement
        // do something after loaded at here
    });
```

## For jsonp

```
yamiLoader
    .jsonp("/demo.js", {
        callbackKey: "callback",
        callbackName: "demo",
    })
    .then((data) => {
        console.log(data);
    });

// typescript can spec a generic response type;
// yamiLoader.jsonp<number>("/demo.js",...).then(data=>{})

```

## For any

```
// anyone of html element tag;

yamiLoader
    .load("script", {
        src:"demo.js",
        id:"demo"
    })
    .then((el) => {
        console.log(el);
    });


yamiLoader
    .load("img", {
        src:"demo.png",
        id:"demo"
    })
    .then((el) => {
        console.log(el);
    });

```

## Above all examples base on promise syntax, if you like callbacks, just fllow the below:

    We recommand you use the promise syntax,because it's more clear and easy to use.

```
yamiLoader
    .loadScript("/demo.js",options,{
        onload(el){},
        onerror(reson){},
        oncomplete(el){},
    })

```

## Also if you like use the dispatch event,just below

### Because the event cannot spec element,you should mark the element by attribute, such as className,id

    jsonp method not supoort use the event to get data!!!
    must use the promise syntax or callbacks.

```
// import { LoaderEvent } from "yami-loader"

document.addEventListener(yamiLoaded.LoaderEvent.LOAD /** or LoaderEvent.LOAD */,{detail}=>{
 // detail is a element
 if(detail.id ==="demo"){
    //do something
 }
},false)
yamiLoader
    .loadScript("/demo.js",{id:"demo"},{
        onload(el){},
        onerror(reson){},
        oncomplete(el){},
    })

```

# -----------END--------------
