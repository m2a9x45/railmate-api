const express = require('express');

const router = express.Router();
const fetch = require('node-fetch');
// const sgMail = require('@sendgrid/mail');
const joi = require('@hapi/joi');

require('dotenv').config();

const User = require('../db/models/UserModel.js');
const metricsRoute = require('../routes/metrics.js');
const MailGun = require('../adaptors/mail');


const schema = joi.object({
  name: joi.string()
    .regex(/^[a-zA-Z]*$/)
    .min(2)
    .max(30)
    .required(),

  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ac', 'uk', 'co'] } })
    .required(),
});

const sarSchema = joi.object({
  email: joi.string()
  .email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ac', 'uk', 'co']}}) 
})

function notifySlack(user) {
  const body = {
    text: 'Someone new has registered interest in the app',
    attachments: [
      {
        fields: [
          {
            title: 'Email',
            value: `${user.email}`,
            short: true,
          },
          {
            title: 'Name',
            value: `${user.name}`,
            short: true,
          },
          {
            title: 'OS',
            value: `${user.os}`,
            short: true,
          },
        ],
        color: '#F35A00',
      },
    ],

  };

  fetch(process.env.SLACK_URL, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

router.get('/interest/download/:os/:id', (req, res) => {
  metricsRoute.counter.inc({ route: '/interest/download', type: 'get' });
  const { os } = req.params;
  const { id } = req.params;

  // console.log(os, id);

  if (os === 'null' || id === 'null') {
    res.redirect('http://railmate.net/');
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
          const file = './files/railmate.apk';
          // console.log('downloading...');
          res.download(file);
        } else {
          res.redirect('http://railmate.net/ios/');
        }
      } else {
        res.redirect('http://railmate.net/');
      }
    });
  }
});

router.get('/download', (req, res) => {
  metricsRoute.counter.inc({ route: '/download', type: 'get' });
  const file = './files/railmate.apk';
  res.download(file);
});

router.post('/interest', (req, res) => {
  metricsRoute.counter.inc({ route: '/interest', type: 'post' });
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
                notifySlack(createdUser);
                MailGun.sendEmail(email);
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

router.post('/sar', (req, res) => {
  metricsRoute.counter.inc({ route: '/sar', type: 'post' });
  const { email } = req.body;
  // console.log(email);

  try {
    const value = sarSchema.validate({ email });
    // console.log('value', value);

    if (!value.error) {
      User.findOne({
        where: {
          email: email,
        }
      }).then(user => {
        console.log(user);

        if (user != null) {

          const email = user.dataValues.email;
          const name = user.dataValues.name;
          const os = user.dataValues.os;
          const signupTime = user.dataValues.createdAt;

          // console.log(email,name,os,signupTime);
          
          MailGun.sendSarData(email, name, os, signupTime)

          res.json({
            message: 'Your data\'s on it\'s way 📧',
            error: false,
          });
        } else {
          res.json({
            message: 'It doesn\'t look like we store any of your data 🔐',
            error: true,
          });
        }
      });

    } else {
      res.json({
        message: 'It looks like you might have not enter an vaild email ',
        error: true,
      });
    }


  } catch (error) {
    res.json({
      message: 'Something went wrong please try again',
      error: true,
    });
  }
});

module.exports = router;
