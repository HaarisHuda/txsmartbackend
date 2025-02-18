exports.productPurchasedEmail=(productName,name)=>{
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Order Confirmation</title>
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
                <div class="message">Order Confirmation</div>
                <div class="body">
                    <p>Dear ${name},</p>
                    <p>You have successfully purchased the product
                        <span class="highlight">${productName},</span>. We are excited to have you as a buyer.
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