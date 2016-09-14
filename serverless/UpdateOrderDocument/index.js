module.exports = function (context, body, inputOrder) {
    context.log(`Webhook triggered, node version ${process.versions.node}, dirname ${__dirname}`)

    // Check if we got first/last properties
    if('orderId' in body && 'status' in context.req.query) {
        context.bindings.outputOrder = inputOrder;
        context.bindings.outputOrder.status = context.req.query.status
        context.res = context.bindings.outputOrder;
    }
    else {
        context.res = {
            status: 400,
            body: { error: 'Please pass orderId in the input body, and status on url query parameter'}
        };
    }

    context.done();
}
