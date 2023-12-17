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
// class
import YamiLoader from 'yami-loader';
```

OR

```
// instance
import { yamiLoader } from 'yami-loader';
// class
import { YamiLoader } from 'yami-loader';
// custom
const yamiLoader = new YamiLoader({timeout:15*1000});

// timeout default 15s

```

# Examples

## For script

```
// options is optional with html script element attributes
yamiLoader
    .loadScript("/demo.js", options)
    .then((el,opts) => {
        // el is HTMLLinkElement,
        // opts equal to your options,but may will automaticlly inject some properties by the lib.
        // do something after loaded at here
    });

```

## For css

```
// options is optional with html link element attributes
yamiLoader
    .loadCss("/demo.css", options)
    .then((el) => {
        // el is HTMLLinkElement
        // do something after loaded at here
    });
```

## For jsonp

```
yamiLoader
    .loadJson("/demo.js", {
        // tell the server the params name of the callback
        name?: "jsonCallback",
        // tell the server the callback function name
        callee: "demo", // required
        // finally looks like this: http://www.xx.com?jsonCallback=demo,
        // ...etc options
    })
    .then((data,options) => {
        console.log(data);
    });

// typescript can spec a generic response type;
// yamiLoader.jsonp<number>("/demo.js",...).then(data=>{})

```

<font size="14" color="red">!!! note: loadJson's response has data instad of el</font>

## For any

```
// anyone of html element tag;

yamiLoader
    .load("script", {
        src:"???",
        // ...more HTMLScriptElement options
    })
    .then((el,options) => {
        console.log(el,options);
    });


yamiLoader
    .load("img", {
        src:"demo.png",
        id:"demo",
        // ...more HTMLImageElement options
    })
    .then((el,options) => {
        // default the element insert to the head, you can re-insert to the body or other element
        // the orignal element will be automaticlly removed from the head.
        document.body.appendChild(el);
    });

```

## Above all examples base on promise syntax, if you like callbacks, just follow the below:

    We recommand you use the promise syntax,because it's more clear and easy to use.

```
yamiLoader
    .loadScript("/demo.js",options, {
        onload(el,options){},
        onerror(reson,options){},
        oncomplete(options){},
    })

```

<font size="14" color="red">!!! note: loadJson's onload has data instad of el</font>

## Also if you like use the dispatch event,just follow the below

### Because the event cannot spec element,you should mark the element by attribute, such as className,id

<font size="14" color="red">Also the options export a field named 'extra' , you can fill it use to mark the
element.</font>

```
// import { LoaderEvent } from "yami-loader"

document.addEventListener(yamiLoaded.LoaderEvent.LOAD /** or LoaderEvent.LOAD */,{detail:{el,options}}=>{
 // detail is a object as { el:HTMLElement,reason:Error,data: }
 if(el.id ==="demo"){
    // do something
 }
 // or
 if(el.options.extra ==="marked"){
    // do something
 }
},false)
yamiLoader
    .loadScript("/demo.js",{id:"demo", extra:"marked"})


```

<font size="14" color="red">!!! note: loadJson's yamiLoaded.LoaderEvent.LOAD event has data instad of el</font>

# -----------END--------------
