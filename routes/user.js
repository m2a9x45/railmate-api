const express = require('express');

const router = express.Router();
// const fetch = require('node-fetch');
// const sgMail = require('@sendgrid/mail');
const joi = require('@hapi/joi');

require('dotenv').config();

const User = require('../db/models/UserModel.js');


const schema = joi.object({
  name: joi.string()
    .regex(/^[a-zA-Z]*$/)
    .min(2)
    .max(30)
    .required(),

  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ac', 'uk'] } })
    .required(),
});

router.get('/interest/download/:os/:id', (req, res) => {
  const { os } = req.params;
  const { id } = req.params;

  // console.log(os, id);

  if (os === 'null' || id === 'null') {
    res.redirect('http://localhost/dev/railmate/');
  } else {
    User.findAll({
      where: {
        id,
      },
    }).then((user) => {
      // console.log(user);
      // console.log(user.length);

      if (user.length !== 0) {
        if (os === 'android') {
          const file = './files/app-debug-v-1.5.apk';
          // console.log('downloading...');
          res.download(file);
        } else {
          res.redirect('http://localhost/dev/railmate/ios');
        }
      } else {
        res.redirect('http://localhost/dev/railmate/');
      }
    });
  }
});

router.post('/interest', (req, res) => {
  let doesEmailExist = false;

  const { name } = req.body;
  const { email } = req.body;
  const { os } = req.body;

  // console.log(req.body);
  // console.log(name, email, os);

  try {
    const value = schema.validate({ name, email });
    // console.log('value', value);

    if (!value.error) {
      User.findAll()
        .then((user) => {
          // console.log("All users:", JSON.stringify(user));
          for (let i = 0; i < user.length; i++) {
            if (user[i].email === email) {
              doesEmailExist = true;
            }
          }
          if (doesEmailExist !== true) {
            User.create({
              name, email, os, createdAt: new Date(),
            })
              .then((createdUser) => {
                // console.log('user added to db');
                // notifySlack(user);
                // sendEmail(user.email, user.os, user.name);
                res.json(createdUser);
              }).catch(() => {
                // console.log(err);
                res.json({
                  message: 'Something went wrong',
                  error: true,
                });
              });
          } else {
            res.json({
              message: 'It looks like that email is in use',
              error: true,
            });
          }
        })
        .catch(() => {
          // console.log(err);
          res.json({
            message: 'Something went wrong please try again',
            error: true,
          });
        });
    } else {
      res.json({
        message: 'Something went wrong please try again',
        error: true,
      });
    }
  } catch (err) {
    res.json({
      message: 'Something went wrong please try again',
      error: true,
    });
  }
});

// function notifySlack(user) {
//   const body = {
//     text: 'Someone new has registered interest in the app',
//     attachments: [
//       {
//         fields: [
//           {
//             title: 'Email',
//             value: `${user.email}`,
//             short: true,
//           },
//           {
//             title: 'Name',
//             value: `${user.name}`,
//             short: true,
//           },
//           {
//             title: 'OS',
//             value: `${user.os}`,
//             short: true,
//           },
//         ],
//         color: '#F35A00',
//       },
//     ],

//   };

//   fetch(process.env.SLACK_URL, {
//     method: 'post',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// function sendEmail(email, os, name) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: {
//       email: 'Hi@railmate.net',
//       name: 'Railmate',
//     },
//     subject: 'Thanks for letting us know',
//     text: `Hi ${name}, thanks for letting us know you would
//     be intrested in the railmate app for ${os}`,
//     html: `<p>Hi ${name}, thanks for letting us know you
//     would be intrested in the railmate app for ${os}</p>`,
//   };
//   sgMail.send(msg);
// }

module.exports = router;
