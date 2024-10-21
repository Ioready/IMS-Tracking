import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from '../models/peoples/userModel.js';

export const signUp = async (req, res) => {
    try {
        let { userName, email, password } = req.body
        const user = await userModel.findOne({ email: email })  
        console.log('user: ',user);
        if (user) {
            res.status(401).send({ exist: true, message: 'You are already registered' })
        } else {
            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)
            const userData = new userModel({
                userName, email, password
            })
            userData.save()
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in SignUp", success: false, error })
    }
}

export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email })
        console.log('user: ', user);
        if (user) {
            const isMatchPswrd = await bcrypt.compare(password, user.password)
            if (!isMatchPswrd) {
                console.log('no');
                res.status(401).send({ message: "Incorrect Password", incPass: true })
            } else {
                console.log('yes');
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1y'
                })
                console.log('token :', token);
                await userModel.findByIdAndUpdate(user._id,{
                    $set: {
                        status: true
                    }
                })
                res.status(200).send({ message: "Login Successfull", success: true, data: token })
            }
        } else {
            res.status(401).send({ message: "Incorrect Email or Password", incEmail: false })
        }
    } catch (error) {
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.body.userId
        const user = await userModel.findById(id)
        res.status(200).send(user);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching user details", success: false, error });
    }
}
