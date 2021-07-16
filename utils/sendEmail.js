// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

// const sgMail = require('@sendgrid/mail')

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// const sendEmail = (receiver, firstName, lastName, link, subject, content) => {
//     console.log('reciever', receiver);
//     try {
//         const data = {
//             to: 'perillo.robert@gmail.com',
//             from: 'robertest001@gmail.com',
//             subject: 'Move Tailer - Password Reset',
//             text: `Hi ${firstName} ${lastName} \n 
//             Please click on the following link ${link} to reset your password. \n\n 
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//             html: ``,
//         };
//         // return sgMail.send(data)

//         return sgMail.send(data, (error, result) => {
//             if (error) return result.send({message: error.message});
//             return result.send({message: 'A reset email has been sent to ' + receiver + '.'});
//         });
//     } catch (error) {
//         return new Error(error);
//     }
// }

// module.exports = { sendEmail };

