const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN, host: 'api.eu.mailgun.net' });
const fs = require('fs');

function sendEmail(email) {
  fs.readFile('./data/mail.html', 'utf8', (err, contents) => {

    const data = {
      from: 'Railmate <hello@mail.railmate.net>',
      to: email,
      subject: 'Hello',
      html: contents,
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.error(error);
      }
    });
  });
}

module.exports = sendEmail;
