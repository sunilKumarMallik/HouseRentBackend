
const userToken = require("../models/usertoken");
const sendConfirmEmail = async (email, user_id) => {
    

    let confirm_email_token = randomize('0', 5);
    // let confirm_email_token = crypto.randomBytes(20).toString('hex');
  
    let userToken = new UserToken();
    userToken.email = email;
    userToken.user_id = user_id;
    userToken.confirm_email_token = confirm_email_token; // Generate token
    userToken.confirm_token_expires = Date.now() + 1000 * 60 * 60 * 24 // 24 hours
    // moment().add(1,'days');
    userToken = await userToken.save();
  
    let confirm_email_link = `${process.env.WEB_SITE_URL}` + 'confirm-email?id=' + confirm_email_token + '&email=' + email;
    mailOptions.to = email;
    mailOptions.subject = 'Confirm your FYIFLI account';
    mailOptions.text = `Your Confirmation code is ${confirm_email_token}` + os.EOL;
    mailOptions.text += 'Confirmation Link: ' + confirm_email_link + os.EOL;
  
    const info = await sendMail(mailOptions);
    return info;
  }