require('dotenv').config()

const config = require('config')

const settings = config.get("settings")

const express = require('express')
const bodyParser = require('body-parser')
const CORS = require('cors')

const sgMail = require('@sendgrid/mail');
const { request, response } = require('express')

try {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json({ limit: '10mb' }))
    app.use(CORS())

    // ROUTES
    app.get('/', (request, response, next) => {
        response.json({ name: settings.name, version: settings.version })
        return next();
    })

    app.post('/message', (request, response, next) => {
        const data = request.body
        const key = process.env.SENDGRID_API_KEY //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
        sgMail.setApiKey(key)
        const msg = {
            to: [settings.email],
            cc: [],
            from: settings.email,
            subject: `Email from ${data.name} - ${data.email}`,
            text: data.message
        }
        sgMail.send(msg)
            .then(result => {

                response.status(200).json({ msg: 'message sent', status: 'OK' })
                return next()
            })
            .catch(error => {
                console.error(error)
                if (error.response &&
                    error.response.body &&
                    error.response.body.errors) {
                    error.response.body.errors.map(console.log)
                }
                response.status(400).json({ msg: 'error sending message', status: 'NOT OK' })
                return next()
            })


    })

    app.listen(settings.port, () => {
        let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'default'
        console.info('Running in %s environment', env)
        if (!process.env.SENDGRID_API_KEY) console.error("[ERROR] Can't find SendGrid's API Key")
        console.info('Server is up and running at: http://%s:%d ', settings.hostname, settings.port)
    })

} catch (error) {
    const stack = error.stack
    console.error("[ERROR] Could not create server: " + error)
    console.error(stack)
}
