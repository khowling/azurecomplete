module.exports = (context, body, markDowndownTemplate) => {
    context.log(`Webhook triggered, node version ${process.versions.node}, dirname ${__dirname}`)

    if(body && body.orderDoc && body.customerDoc) {
       // try { 
            var customer = body.customerDoc,
                order = body.orderDoc,
                zoomLevel = 15,
                imagerySet = 'Aerial',
                exceterlatlong = customer.address.location.coordinates.join(','),
                mapSize = '800,500', 
                mapLayer = 'OrdnanceSurvey',
                bingkey = 'AixBD-YmKyEPv-U3ie6q3qd10oLI49RuEWfF1IWkEy730XZ2Tqi18v1wLEsmnbtk'
                 
            md = eval ('`'+markDowndownTemplate+'`')  
                
            context.res = {
                body: { markdown: md}
            };
     /*   } catch (e) {
            context.res = {
                status: 400,
                body: { error: `Cannot process template : ${e}`}
            }
        } */
    } else {
        context.res = {
            status: 400,
            body: { error: 'Please pass customer and order json input object'}
        };
    }

    context.done();
}
