import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("The Token was not available")
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json("Invalid Token")
            } else {
                if (decoded.role === "admin") {
                    next()
                }
                else {
                    return res.json("Not admin")
                }
            }
           
        })
    }
}

export default verifyUser