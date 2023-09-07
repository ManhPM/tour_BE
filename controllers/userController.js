import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

//Create new User
export const createUser = async (req, res) => {
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();

        res.status(200).json({ success: true, message: 'Thêm mới thành công', data: savedUser });
    } catch (error) {
        res.status(500).json({ success: true, message: error.message });
    }
};

//Update User
export const updateUser = async (req, res) => {
    const id = req.user.id;
    try {
        await User.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true },
        );

        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    const id = req.user.id;
    const { oldPassword, newPassword, repeatPassword } = req.body;
    try {
        const user = await User.findById(id);
        const isAuth = bcrypt.compareSync(oldPassword, user.password);
        if (isAuth) {
            if (newPassword == repeatPassword) {
                if (newPassword == oldPassword) {
                    res.status(400).json({
                        success: true,
                        message: 'Mật khẩu cũ và mật khẩu mới phải khác nhau',
                    });
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(newPassword, salt);
                    await User.findByIdAndUpdate(
                        id,
                        {
                            password: hashPassword,
                        },
                        { new: true },
                    );
                    res.status(200).json({
                        success: true,
                        message: 'Đổi mật khẩu thành công',
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Mật khẩu lặp lại không khớp',
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Sai mật khẩu',
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const accessForgotPassword = async (req, res) => {
    const { newPassword, repeatPassword, email, username } = req.body;
    try {
        if (newPassword == repeatPassword) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(newPassword, salt);
            await User.findOneAndUpdate(
                {
                    username,
                    email,
                },
                {
                    $set: { password: hashPassword },
                },
                { new: true },
            );
            res.status(200).json({
                success: true,
                message: 'Lấy lại mật khẩu thành công',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Mật khẩu lặp lại không khớp',
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verify = async (req, res) => {
    const { username, email, verifyID } = req.body;
    try {
        const user = await User.findOne({
            username,
            email,
            verifyID,
        });
        if (user) {
            res.status(200).json({
                success: true,
                message: `Mã xác minh chính xác, tiến hành nhập mật khẩu mới`,
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Mã xác minh không chính xác`,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({
            username,
            email,
        });
        if (user) {
            const verifyID = (Math.random() + 1).toString(36).substring(2);
            await User.findOneAndUpdate(
                {
                    username,
                    email,
                },
                {
                    $set: { verifyID: verifyID },
                },
                { new: true },
            );
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'n19dccn107@student.ptithcm.edu.vn', // generated ethereal user
                    pass: 'dzwedtbaoqsmrkob', // generated ethereal password
                },
            });
            // send mail with defined transport object
            await transporter.sendMail({
                from: 'HOLIDATE SECURITY', // sender address
                to: `${email}`, // list of receivers
                subject: 'HOLIDATE SECURITY', // Subject line
                text: 'HOLIDATE SECURITY', // plain text body
                html: `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <link href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700" rel="stylesheet">
                
                    <!-- CSS Reset : BEGIN -->
                    <style>
                
                        html,
                body {
                    margin: 0 auto !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    background: #f1f1f1;
                }
                
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
                
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
                
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
                
                img {
                    -ms-interpolation-mode:bicubic;
                }
                
                a {
                    text-decoration: none;
                }
                
                *[x-apple-data-detectors],  /* iOS */
                .unstyle-auto-detected-links *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
                .im {
                    color: inherit !important;
                }
                img.g-img + div {
                    display: none !important;
                }
                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                    u ~ div .email-container {
                        min-width: 320px !important;
                    }
                }
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    u ~ div .email-container {
                        min-width: 375px !important;
                    }
                }
                @media only screen and (min-device-width: 414px) {
                    u ~ div .email-container {
                        min-width: 414px !important;
                    }
                }
                    </style>
                    <style>
                .primary{
                    background: #448ef6;
                }
                .bg_white{
                    background: #ffffff;
                }
                .bg_light{
                    background: #fafafa;
                }
                .bg_black{
                    background: #000000;
                }
                .bg_dark{
                    background: rgba(0,0,0,.8);
                }
                .email-section{
                    padding:2.5em;
                }
                .btn{
                    padding: 5px 15px;
                    display: inline-block;
                }
                .btn.btn-primary{
                    border-radius: 30px;
                    background: #448ef6;
                    color: #ffffff;
                }
                .btn.btn-white{
                    border-radius: 30px;
                    background: #ffffff;
                    color: #000000;
                }
                .btn.btn-white-outline{
                    border-radius: 30px;
                    background: transparent;
                    border: 1px solid #fff;
                    color: #fff;
                }
                
                h1,h2,h3,h4,h5,h6{
                    font-family: 'Work Sans', sans-serif;
                    color: #000000;
                    margin-top: 0;
                    font-weight: 400;
                }
                
                body{
                    font-family: 'Work Sans', sans-serif;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 1.8;
                    color: rgba(0,0,0,.4);
                }
                
                a{
                    color: #448ef6;
                }
                
                .logo h1{
                    margin: 0;
                }
                .logo h1 a{
                    color: #000000;
                    font-size: 20px;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-family: 'Poppins', sans-serif;
                }
                
                .navigation{
                    padding: 0;
                }
                .navigation li{
                    list-style: none;
                    display: inline-block;;
                    margin-left: 5px;
                    font-size: 13px;
                    font-weight: 500;
                }
                .navigation li a{
                    color: rgba(0,0,0,.4);
                }
                .hero{
                    position: relative;
                    z-index: 0;
                }
                
                .hero .overlay{
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    content: '';
                    width: 100%;
                    background: #000000;
                    z-index: -1;
                    opacity: .3;
                }
                
                .hero .text{
                    color: rgba(255,255,255,.9);
                }
                .hero .text h2{
                    color: #fff;
                    font-size: 50px;
                    margin-bottom: 0;
                    font-weight: 300;
                    line-height: 1;
                }
                .hero .text h2 span{
                    font-weight: 600;
                    color: #448ef6;
                }
                
                .heading-section h2{
                    color: #000000;
                    font-size: 28px;
                    margin-top: 0;
                    line-height: 1.4;
                    font-weight: 400;
                }
                .heading-section .subheading{
                    margin-bottom: 20px !important;
                    display: inline-block;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(0,0,0,.4);
                    position: relative;
                }
                .heading-section .subheading::after{
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -10px;
                    content: '';
                    width: 100%;
                    height: 2px;
                    background: #448ef6;
                    margin: 0 auto;
                }
                
                .heading-section-white{
                    color: rgba(255,255,255,.8);
                }
                .heading-section-white h2{
                    color: #ffffff;
                }
                .heading-section-white .subheading{
                    margin-bottom: 0;
                    display: inline-block;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255,255,255,.4);
                }
                .text-services .meta{
                    text-transform: uppercase;
                    font-size: 14px;
                    margin-bottom: 0;
                }
                .footer{
                    color: rgba(255,255,255,.5);
                
                }
                .footer .heading{
                    color: #ffffff;
                    font-size: 20px;
                }
                .footer ul{
                    margin: 0;
                    padding: 0;
                }
                .footer ul li{
                    list-style: none;
                    margin-bottom: 10px;
                }
                .footer ul li a{
                    color: rgba(255,255,255,1);
                }
                @media screen and (max-width: 500px) {
                }
                    </style>
                </head>
                
                <body width="100%" style="margin: 0; padding: 0 !important; background-color: #222222;">
                    <center style="width: 100%; background-color: #f1f1f1;">
                    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                    </div>
                    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                        <!-- BEGIN BODY -->
                      <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                          <tr>
                          <td valign="top" class="bg_white" style="padding: 1em 2.5em;">
                              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                              </table>
                          </td>
                          </tr><!-- end tr -->
                          <tr>
                          <td valign="middle" class="hero bg_white" style="background-image: url(https://res.cloudinary.com/dpgjnngzt/image/upload/v1693155759/cc8qb9rmjoxgsl2wx7fe_r9nmrg.webp); background-size: cover; height: 400px;">
                              <div class="overlay"></div>
                            <table>
                                <tr>
                                    <td>
                                        <div class="text" style="padding: 0 4em; text-align: center;">
                                            <h2>Holidate Security</h2>
                                            <p style="font-size: 20px;">Traveling is not just about exploring new places, but also about discovering oneself and embracing the beauty of diversity that exists in our world.</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                          </td>
                          </tr><!-- end tr -->
                          <tr>
                            <td class="bg_white email-section">
                                <div class="heading-section" style="text-align: center; padding: 0 30px;">
                                  <h2>Your verification code<br>${verifyID}</h2>
                                  <p style="font-size: 20px;">Thank you for using our service.</p>
                                </div>
                          </td>
                        </tr><!-- end: tr -->
                      <!-- 1 Column Text + Button : END -->
                      </table>
                      <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                          <tr>
                          <td valign="middle" class="bg_black footer email-section">
                            <table>
                                <tr>
                                <td valign="top" width="33.333%" style="padding-top: 20px;">
                                  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                    <tr>
                                      <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                                          <h3 class="heading">Contact Info</h3>
                                          <ul>
                                            <li><span class="text">Address: 123 Nguyen Van A Street,
                                            Ward 4, District 3,
                                            Ho Chi Minh City,
                                            Vietnam</span></li>
                                            <li><span class="text">Phone: +84 392 392 210</span></a></li>
                                            <li><span class="text">Email: holidatesupport@gmail.com</span></a></li>
                                                  </ul>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr><!-- end: tr -->
                        <tr>
                            <td valign="middle" class="bg_black footer email-section">
                                <table>
                                <tr>
                                <td valign="top" width="100%">
                                  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                    <tr>
                                      <td style="text-align: left; padding-right: 10px;">
                                          <p>&copy; 2023 Holidate. All Rights Reserved</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            </td>
                        </tr>
                      </table>
                    </div>
                  </center>
                </body>
                </html>
            `, // htm, // html body
            });
            res.status(200).json({
                success: true,
                message: `Mã xác minh đã được gửi về email đăng ký, vui lòng kiểm tra hòm thư`,
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Thông tin không chính xác`,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const activeUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.isActive) {
            res.status(400).json({ success: false, message: 'Tài khoản của bạn đã được kích hoạt' });
        } else {
            const activeID = (Math.random() + 1).toString(36).substring(2);
            await User.findOneAndUpdate(
                {
                    username: user.username,
                    email: user.email,
                },
                {
                    $set: { activeID: activeID },
                },
                { new: true },
            );
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'n19dccn107@student.ptithcm.edu.vn', // generated ethereal user
                    pass: 'dzwedtbaoqsmrkob', // generated ethereal password
                },
            });
            // send mail with defined transport object
            await transporter.sendMail({
                from: 'HOLIDATE SECURITY', // sender address
                to: `${user.email}`, // list of receivers
                subject: 'HOLIDATE SECURITY', // Subject line
                text: 'HOLIDATE SECURITY', // plain text body
                html: `<!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
                <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                <link href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700" rel="stylesheet">
            
                <!-- CSS Reset : BEGIN -->
                <style>
            
                    html,
            body {
                margin: 0 auto !important;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
                background: #f1f1f1;
            }
            
            * {
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            
            div[style*="margin: 16px 0"] {
                margin: 0 !important;
            }
            
            table {
                border-spacing: 0 !important;
                border-collapse: collapse !important;
                table-layout: fixed !important;
                margin: 0 auto !important;
            }
            
            img {
                -ms-interpolation-mode:bicubic;
            }
            
            a {
                text-decoration: none;
            }
            
            *[x-apple-data-detectors],  /* iOS */
            .unstyle-auto-detected-links *,
            .aBn {
                border-bottom: 0 !important;
                cursor: default !important;
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            .a6S {
                display: none !important;
                opacity: 0.01 !important;
            }
            .im {
                color: inherit !important;
            }
            img.g-img + div {
                display: none !important;
            }
            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                u ~ div .email-container {
                    min-width: 320px !important;
                }
            }
            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                u ~ div .email-container {
                    min-width: 375px !important;
                }
            }
            @media only screen and (min-device-width: 414px) {
                u ~ div .email-container {
                    min-width: 414px !important;
                }
            }
                </style>
                <style>
            .primary{
                background: #448ef6;
            }
            .bg_white{
                background: #ffffff;
            }
            .bg_light{
                background: #fafafa;
            }
            .bg_black{
                background: #000000;
            }
            .bg_dark{
                background: rgba(0,0,0,.8);
            }
            .email-section{
                padding:2.5em;
            }
            .btn{
                padding: 5px 15px;
                display: inline-block;
            }
            .btn.btn-primary{
                border-radius: 30px;
                background: #448ef6;
                color: #ffffff;
            }
            .btn.btn-white{
                border-radius: 30px;
                background: #ffffff;
                color: #000000;
            }
            .btn.btn-white-outline{
                border-radius: 30px;
                background: transparent;
                border: 1px solid #fff;
                color: #fff;
            }
            
            h1,h2,h3,h4,h5,h6{
                font-family: 'Work Sans', sans-serif;
                color: #000000;
                margin-top: 0;
                font-weight: 400;
            }
            
            body{
                font-family: 'Work Sans', sans-serif;
                font-weight: 400;
                font-size: 15px;
                line-height: 1.8;
                color: rgba(0,0,0,.4);
            }
            
            a{
                color: #448ef6;
            }
            
            .logo h1{
                margin: 0;
            }
            .logo h1 a{
                color: #000000;
                font-size: 20px;
                font-weight: 700;
                text-transform: uppercase;
                font-family: 'Poppins', sans-serif;
            }
            
            .navigation{
                padding: 0;
            }
            .navigation li{
                list-style: none;
                display: inline-block;;
                margin-left: 5px;
                font-size: 13px;
                font-weight: 500;
            }
            .navigation li a{
                color: rgba(0,0,0,.4);
            }
            .hero{
                position: relative;
                z-index: 0;
            }
            
            .hero .overlay{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                content: '';
                width: 100%;
                background: #000000;
                z-index: -1;
                opacity: .3;
            }
            
            .hero .text{
                color: rgba(255,255,255,.9);
            }
            .hero .text h2{
                color: #fff;
                font-size: 50px;
                margin-bottom: 0;
                font-weight: 300;
                line-height: 1;
            }
            .hero .text h2 span{
                font-weight: 600;
                color: #448ef6;
            }
            
            .heading-section h2{
                color: #000000;
                font-size: 28px;
                margin-top: 0;
                line-height: 1.4;
                font-weight: 400;
            }
            .heading-section .subheading{
                margin-bottom: 20px !important;
                display: inline-block;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: rgba(0,0,0,.4);
                position: relative;
            }
            .heading-section .subheading::after{
                position: absolute;
                left: 0;
                right: 0;
                bottom: -10px;
                content: '';
                width: 100%;
                height: 2px;
                background: #448ef6;
                margin: 0 auto;
            }
            
            .heading-section-white{
                color: rgba(255,255,255,.8);
            }
            .heading-section-white h2{
                color: #ffffff;
            }
            .heading-section-white .subheading{
                margin-bottom: 0;
                display: inline-block;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: rgba(255,255,255,.4);
            }
            .text-services .meta{
                text-transform: uppercase;
                font-size: 14px;
                margin-bottom: 0;
            }
            .footer{
                color: rgba(255,255,255,.5);
            
            }
            .footer .heading{
                color: #ffffff;
                font-size: 20px;
            }
            .footer ul{
                margin: 0;
                padding: 0;
            }
            .footer ul li{
                list-style: none;
                margin-bottom: 10px;
            }
            .footer ul li a{
                color: rgba(255,255,255,1);
            }
            @media screen and (max-width: 500px) {
            }
                </style>
            </head>
            
            <body width="100%" style="margin: 0; padding: 0 !important; background-color: #222222;">
                <center style="width: 100%; background-color: #f1f1f1;">
                <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                </div>
                <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                    <!-- BEGIN BODY -->
                  <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                      <tr>
                      <td valign="top" class="bg_white" style="padding: 1em 2.5em;">
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                          </table>
                      </td>
                      </tr><!-- end tr -->
                      <tr>
                      <td valign="middle" class="hero bg_white" style="background-image: url(https://res.cloudinary.com/dpgjnngzt/image/upload/v1693155759/cc8qb9rmjoxgsl2wx7fe_r9nmrg.webp); background-size: cover; height: 400px;">
                          <div class="overlay"></div>
                        <table>
                            <tr>
                                <td>
                                    <div class="text" style="padding: 0 4em; text-align: center;">
                                        <h2>Holidate Security</h2>
                                        <p style="font-size: 20px;">Traveling is not just about exploring new places, but also about discovering oneself and embracing the beauty of diversity that exists in our world.</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                      </td>
                      </tr><!-- end tr -->
                      <tr>
                        <td class="bg_white email-section">
                            <div class="heading-section" style="text-align: center; padding: 0 30px;">
                              <h2>Your activation code<br>${activeID}</h2>
                              <p style="font-size: 20px;">Thank you for using our service.</p>
                            </div>
                      </td>
                    </tr><!-- end: tr -->
                  <!-- 1 Column Text + Button : END -->
                  </table>
                  <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                      <tr>
                      <td valign="middle" class="bg_black footer email-section">
                        <table>
                            <tr>
                            <td valign="top" width="33.333%" style="padding-top: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                                      <h3 class="heading">Contact Info</h3>
                                      <ul>
                                        <li><span class="text">Address: 123 Nguyen Van A Street,
                                        Ward 4, District 3,
                                        Ho Chi Minh City,
                                        Vietnam</span></li>
                                        <li><span class="text">Phone: +84 392 392 210</span></a></li>
                                        <li><span class="text">Email: holidatesupport@gmail.com</span></a></li>
                                              </ul>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr><!-- end: tr -->
                    <tr>
                        <td valign="middle" class="bg_black footer email-section">
                            <table>
                            <tr>
                            <td valign="top" width="100%">
                              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="text-align: left; padding-right: 10px;">
                                      <p>&copy; 2023 Holidate. All Rights Reserved</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        </td>
                    </tr>
                  </table>
                </div>
              </center>
            </body>
            </html>
            `, // htm, // html body
            });
            res.status(200).json({
                success: true,
                message: `Mã kích hoạt đã được gửi về email đăng ký, vui lòng kiểm tra hòm thư`,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyActiveUser = async (req, res) => {
    const { activeID } = req.body;
    try {
        const user = await User.findOne({
            _id: req.user.id,
            activeID,
        });
        if (user) {
            await User.findOneAndUpdate(
                {
                    _id: req.user.id,
                },
                {
                    $set: { activeID: 0, isActive: true },
                },
                { new: true },
            );
            res.status(200).json({
                success: true,
                message: `Kích hoạt tài khoản thành công`,
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Mã kích hoạt không chính xác`,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Xoá thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Get single User
export const getDetailUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
