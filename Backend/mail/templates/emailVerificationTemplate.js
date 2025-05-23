const otpTemplate=(otp)=>{
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>OTP Verification Email</title>
            <style>
                body{
                    background-color:#ffffff;
                    font-family:Arial,sans-serif;
                    font-size:16px;
                    line-height:1.4;
                    color:#333333;
                    margin:0;
                    padding:0;
                }
                .container{
                    max-width:600px;
                    margin:0 auto;
                    padding:20px;
                    text-align:center;
                }

                .logo{
                    max-width:200px;
                    margin-bottom:20px;
                }
                .message{
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:20px;
                }
                .body{
                    font-size:16px;
                    margin-bottom:20px;
                }
                .support{
                    color:#999999;
                    font-size:14px;
                    margin-top:20px;
                }
                .highlight{
                    font-weight:bold;
                }
            </style>
        </head>

        <body>
            <div class="container">
                <a href="">
                    <img class="logo" src=""
                    alt=" Logo">
                </a>
                <div class="message">OTP Verification Email</div>
                <div class="body">
                    <p>Dear User,</p>
                    <p>Thank you for registering with us. To complete your registration, please use the following
                    (One-Time Password) to verify your account:
                    </p>
                    <h2 class="highlight">${otp}</h2>
                    <p>
                        This OTP is valid for 5 minutes. If you did not request this verification, please disregard this.
                         Once your account is verified, you will have access to our platform and its features.
                    </p>
                </div>
                <div class="support">
                    If you have any questions or need further assistance,please feel free to reach at
                    <a href="mailto:info@.com">info@.com</a>. We are here to help!
                </div>
            </div>
        </body>
    </html>`;
}

module.exports=otpTemplate;