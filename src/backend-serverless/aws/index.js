const https = require('https')

// #### CHANGE-ME #####
const SENDGRID_API_KEY = "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"
const MY_NAME = "Enrico"
const MY_EMAIL = "2212731@my.ipleiria.pt"
// #### CHANGE-ME #####

exports.handler = async (event) => {

    let data = event
    if (typeof data != "object") {
        data = JSON.parse(data)
    }
    if (!data) {
        return "No data provided!"
    }

    data = buildJSONData(data)
    return sendEmail(data, buildOptions(data))
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
                return resolve({ message: "Request successful", reply: body })
            });
        });
        req.on('error', (error) => {
            return resolve({ message: "Request error", reason: error })
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