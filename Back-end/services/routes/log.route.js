import { Router } from "express";
import Author from "../models/authors.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../middlewares/auth.js";
import { newAuthorMail } from "../mail/newAuthorMail.js";


// Creiamo un nuovo Router 
const logRoute = Router();


logRoute.post("/login", async (req, res, next) => {
    try {
        // trovare il user
        let foundUser = await Author.findOne({
            
            userName: req.body.userName,
        });

        if (foundUser) {
            // controllare la password
            const isPasswordMatching = await bcrypt.compare(
                req.body.password,
                foundUser.password
            );

            if (isPasswordMatching) {
                const token = await generateJWT({ _id: foundUser._id });
                res.send({ user: foundUser, token: token });
            } else {
                res.status(400).send("Password sbagliata");
            }

        } else {
            res.status(404).send(req.body.userName + "user non trovato");
        }

    } catch (err) {
        console.log(err);
        next(err);
    }
});


// Richiesta POST new user
logRoute.post("/register", async (req, res) => {
    try {
        // creare l'autore
        let author = await Author.create({
            ...req.body,
            password: await bcrypt.hash(req.body.password, 10),
        });
        // mandare la risposta
        res.send(author);

        //mail di conferma:
        newAuthorMail();
    } catch (err) {
        console.error(err)
    }
})


export default logRoute;