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

function sendSarData(email, name, os, signupTime){
  const data = {
    from: 'Railmate <data@mail.railmate.net>',
    to: email,
    subject: 'Your subject access request (SAR)',
    text: `Hey here's the data that we store about you. Your email address : ${email}, name : ${name}, OS of your phone : ${os} & the date you signup : ${signupTime}
    \n We got this data from the form on our website that you or someone else submitted.
    \n We use this data to help us build a better product. We share your data with mailgun which is who we use to send emails. We store this data until you tell is not to. We 
    came to this descion by think about how long the data will be useful for us to have to best help you. 
    \n If any of this data is wrong please let us know and we can change it for you. Or if you'd like us to stop using your data we will as soon as possible once you let us know.
    You can complain to the Information Commissioner's Office if you think something we are doing is wrong. 
    `
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.error(error);
    }
  });
}

module.exports = {
  sendEmail,
  sendSarData
}
