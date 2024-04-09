import dotenv from 'dotenv'
import User from '../Model/modelSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

dotenv.config()

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ Status: "success", user: newUser });
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
};


export const loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        res.cookie("token", token)
                        res.json("Success")
                    }
                    else {
                        res.json("Invalid Password")
                    }
                })
            }
            else {
                res.json("User not found")
            }
    })
}


export const goldrate = (req, res) => {
    return res.json("Success")
}

export const forgotPassword = (req, res) => {
    const { email } = req.body
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.send({ Status: "User Not Found" }) // Return after sending response
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PW
                }
            });

            var mailOptions = {
                from: process.env.EMAIL_ID,
                to: email,
                subject: 'Reset Your Password',
                text: `https://gold-rate-calculation.netlify.app/resetpassword/${user._id}/${token}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    return res.send({ Status: "Success" }) // Return after sending email
                }
            })
        })
        .catch(err => {
            console.log(err); // Handle any error occurred during the process
            res.status(500).send({ error: "Internal Server Error" });
        });
}


export const resetPassword = (req, res) => {
    const { id, token } = req.params
    const { password } = req.body
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
           return res.json({Status:"Error with token"})
        }
        else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    User.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(u => res.send({ Status: "Success" }))
                    .catch(err=> res.send({Status:err}))
                })
            .catch(err=>res.send({Status: err}))
        }
    })
}