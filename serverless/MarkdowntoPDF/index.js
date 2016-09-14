var markdownpdf = require("markdown-pdf");

module.exports =  (context, body) => {
    context.log(`Webhook triggered, node version ${process.versions.node}, dirname ${__dirname}`)

    // Check if we got first/last properties
    if(body && 'markdown' in body) {
        context.log('got markdown, running markdownpdf')
        markdownpdf().from.string(body.markdown).to.buffer(function (err, pdfbuff) {
            if (err) {
                context = {status: 400, body: { error: `Markdown to DFP error: ${err}`}}
            } else {
                context.log(`Created err:${err}`)
                context.res = pdfbuff;
            }
            context.done();
        })
    } else {
        context.res = {
            status: 400,
            body: { error: 'No markdown in the input body'}
        };
        context.done();
    }
}
    
