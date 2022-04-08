/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

 const https = require('https')

// #### CHANGE-ME #####
const SENDGRID_API_KEY = "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"
const MY_NAME = "Enrico"
const MY_EMAIL = "2212731@my.ipleiria.pt"
// #### CHANGE-ME #####
 
 exports.app = (req, res) => {
 
     res.set('Access-Control-Allow-Origin', '*');
 
     if (req.method === 'OPTIONS') {
         // Send response to OPTIONS requests
         res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
         res.set('Access-Control-Allow-Headers', 'Content-Type');
         res.set('Access-Control-Max-Age', '3600');
         res.status(204).send('');
     } else {
 
         console.log('JavaScript HTTP trigger function processed a request.');
         let body = req.body
         if(typeof body != "object"){
             body = JSON.parse(body)
         } 
 
         const data = buildJSONData(body)
         const options = buildOptions(data)
 
         sendEmail(data,options).then(response=>{
             console.log(response)
             res.status(200).send(JSON.stringify(response))
         }).catch(error=>{
             console.log(error)
             res.status(200).send(JSON.stringify(error))
         })
     }
   };
 
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