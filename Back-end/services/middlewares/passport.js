import GoogleStrategy from "passport-google-oauth20";
import "dotenv/config";
import Author from "../models/authors.model.js";
import { generateJWT } from "./auth.js";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";




const options = {
    // credenziali google
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    // callback da eseguire quando un'utente effettua l'autenticazione al endpoint
    callbackURL: process.env.G_CB
};

const googleStrategy = new GoogleStrategy(
    options,
    //la funzione che va chiamata in fase di autenticazione
    async (_accessToken, _refreshToken, profile, passportNext) => {
        try {
            const { email, given_name, family_name, sub, picture } = profile._json;

            // verificare se l'utente è gia esiste nella DB
            const author = await Author.findOne({ email });

            if (author) {
                const accToken = await createAccessToken({
                    _id: author._id
                });

                passportNext(null, { accToken });
            } else {
                // crea un nuovo utente
                const authorId = new Types.ObjectId();
                const authorPassword = await bcrypt.hash(sub, 10);

                const newAuthor = new Author({
                    name: given_name,
                    lastName: family_name,
                    userName: email,
                    password: authorPassword,
                    email: email,
                    avatar: picture,
                    _id: authorId,
                    googleId: sub
                });

                await newAuthor.save();

                const accToken = await generateJWT({
                    _id: newAuthor._id
                });

                passportNext(null, { accToken });
            };

        } catch (err) {
            console.log(err);
        }
    }
);

export default googleStrategy