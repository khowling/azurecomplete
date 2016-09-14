const f = require ("./index.js"),
      fs = require ("fs")


let test_context = { 
    log: console.warn, 
    done: (o) => { 
      console.warn (`done ${o}`)
      fs.writeFile('out.pdf', Buffer.from(test_context.res, 'base64'), function (err) {
          if (err) 
              return console.log(err);
          console.log(' > out.pdf');
      });
    }
}

f(test_context, {markdown: "\
# Testing \n\
## 123 \n\
--- \n\
This is intended as a quick reference and showcase. For more complete info, see John Gruber's original spec and the Github-flavored Markdown info page \n\
```javascript \n\
var s = \"JavaScript syntax highlighting\"; \n\
alert(s); \n\
```\n\
| Tables        | Are           | Cool  |\n\
| ------------- |:-------------:| -----:|\n\
| col 3 is      | right-aligned | $1600 |\n\
| col 2 is      | centered      |   $12 |\n\
| zebra stripes | are neat      |    $1 |\n\
"
})

