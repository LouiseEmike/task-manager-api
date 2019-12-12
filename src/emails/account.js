const mailgun = require('mailgun-js')({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});


async function newUserEmail(email, name){
    const data = {
        from :  'Emike Louise <emykay.el@gmail.com>',
        to: email,
        subject : "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
      };
      let status;
      mailgun.messages().send(data, (error, body)=> {
        if(body.id){
            status = true
        }
        status = false
    });
    if(status)return "Email delivered";

    return "Email not sent because "+email+ " is not a registered on Mailgun";
}

async function cancelAccount(email, name){
    const data = {
        to: email,
        from :  'Emike Louise <emykay.el@gmail.com>',
        subject : "App Survey",
        text: `We would appreciate a feedback from you. ${name} kindly let us know why you deleted your account`,
    }
    let status;
    mailgun.messages().send(data, (error, body)=> {
        if(body.id){
            status = true
        }
        status = false
    });
    if(status)return "Email delivered";

    return "Email not sent because "+email+ " is not a registered on Mailgun";
}

module.exports = {
    newUserEmail,
    cancelAccount
}
