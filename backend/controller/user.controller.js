import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(401).json({ errors: "Already user exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword
        })
        await newUser.save();
        return res.status(201).json({ message: "User signup succeed" })
    }
    catch (err) {
        console.log('signup error', err)
        return res.status(500).json({ errors: "Error in signUp" })
    }

}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        const isCorrrectPassword = await bcrypt.compare(password, user.password);

        if (!user || !isCorrrectPassword) {
            return res.status(403).json({ errors: "Invalid creditial" })
        }

        //jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
            expiresIn: '2d'
        })

        const cookieOption = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        }

        res.cookie("jwt", token, cookieOption)

        return res.status(201).json({ message: "User login successful", user, token })
    }
    catch (err) {
        console.log('login error', err)
        return res.status(500).json({ errors: "Error in login" })
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie('jwt')
        res.status(200).json({ message: "Logout Successus" })
    } catch (err) {
        console.log('Logout error', err)
        return res.status(500).json({ errors: "Error in Logout" })
    }
}