module.exports =  (context, body, inputDocument) => {
    context.log('Webhook was triggered body should contain the order, inputDocument is the customer!');
    context.log (`here we have ${JSON.stringify(inputDocument)}`)
    
    // Check if we got first/last properties
    if('custId' in body) {
        context.res = {
            body: { custId: body.custId, orderDoc: body, customerDoc: inputDocument}
        };
    }
    else {
        context.res = {
            status: 400,
            body: { error: 'Please pass the order document in the body containing the custId field'}
        };
    }

    context.done();
}
