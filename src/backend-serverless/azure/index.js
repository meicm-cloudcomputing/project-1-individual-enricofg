const https = require('https');

// #### CHANGE-ME #####
const SENDGRID_API_KEY = ""
const MY_NAME = ""
const MY_EMAIL = ""
// #### CHANGE-ME #####

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let data = req.body
    if (typeof data != "object") {
        data = JSON.parse(data)
    }
    if (!data) {
        context.res = { status: 400, body: "No data!" }
        return
    }

    data = buildJSONData(data)
    await sendEmail(data, buildOptions(data)).then((response) => {
        context.log(response)
        context.res =  buildResponse(200, response)
    }).catch(error => {
        context.log(error)
        context.res = buildResponse(400, error)
    })
}

const sendEmail = (data, options) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (body) {
                    const data = JSON.parse(body)
                    if (data.errors) {
                        return resolve({message: "Request error", errors: data.errors})
                    }
                }
                return resolve({message: "Request successful", reply: body})
            });
        });
        req.on('error', (error) => {
            return resolve({message: "Request error", reason: error })
        });
        req.write(data);
        req.end();
    })
}

const buildJSONData = (jsonElements) => {
    const message = {
        personalizations: [
            {
                to: [
                    {
                        email: MY_EMAIL,
                        name: MY_NAME
                    }
                ],
                subject: `[MEI-CM] Email from ${jsonElements.name} - ${jsonElements.email}`
            }
        ],
        from: {
            email: MY_EMAIL,
            name: MY_EMAIL
        },
        replyTo: {
            email: jsonElements.email,
            name: jsonElements.name
        },
        content: [
            {
                type: 'text/plain',
                value: jsonElements.message
            }
        ]

    }
    return JSON.stringify(message)
}
const buildOptions = (data) => {
    return {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Authorization': `Bearer ${SENDGRID_API_KEY}`
        }
    }
}

const buildResponse = (statusCode, content) => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(content)
    }
}