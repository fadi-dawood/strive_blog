import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import authorRoute from './services/routes/author.route.js';
import blogPostRouter from "./services/routes/blogPost.route.js";
import { authMiddleware } from "./services/middlewares/auth.js";
import logRoute from "./services/routes/log.route.js";
import cors from "cors";
import passport from "passport";
import googleStrategy from "./services/middlewares/passport.js";

// caricare le variabili da .env
config();

// creare un'applicazione express chiamata app (creazione server)
const app = express();

// Abilita CORS per tutte le origini
app.use(cors());

// Abilita CORS solo per un set specifico di origini
app.use(cors({
    origin: true
}));

// usare googlestrategy
passport.use("google", googleStrategy)

// comunicazioni in json
app.use(express.json());

// Importa routes:
// http/localhost:3000/login
app.use("/log", logRoute);
// http/localhost:3000/authors
app.use("/authors", authMiddleware, authorRoute);
// http/localhost:3000/blogPost
app.use("/blogPost", authMiddleware, blogPostRouter);


// Funzione per inizializzare il server
const inittserver = async () => {
    try {
        // Aspettiamo di connetterci al database
        await mongoose.connect(process.env.dbconnection);

        // Abilita server
        app.listen(process.env.PORT, () => {
            console.log(`Example app listening on port ${process.env.PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
}

// Invochiamo la funzione per inizializzare il server
inittserver();

