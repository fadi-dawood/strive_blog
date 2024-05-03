import { Router } from "express";
import Author from "../models/authors.model.js";
import cloudinaryMiddleware from "../middlewares/avatar.js"
import { newAuthorMail } from "../mail/newAuthorMail.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../middlewares/auth.js";

// Creiamo un nuovo Router 
const authorRoute = Router();

// Richiesta GET generica
//! non serve
authorRoute.get("/", async (req, res) => {
    try {
        // mandiamo una risposta con tutta la lista degli attori
        const authors = await Author.find();
        res.send(authors);
    } catch (err) {
        console.error(err);
    }
});

// Richiesta GET di un'attore specifico
//! per fare una pagina profilo
authorRoute.get("/:id", async (req, res) => {
    try {
        // cercare l'autore richiesto
        let author = await Author.findById(req.params.id);
        // mandare la risposta
        if (author) {
            res.send(author);
        } else {
            res.status(404).send("Author not found");
        }
    } catch (err) {
        console.error(err);
    }
});

// Richiesta PUT
//! modofocare profilo
authorRoute.put("/:id", async (req, res) => {
    try {
        // eseguire la modifica
        let author = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        // mandare la risposta
        if (author) {
            res.send(author);
        } else {
            res.status(404).send("Author not found");
        }
    } catch (err) {
        console.error(err);
    }
})

// Richiesta DELETE
//! da fare
authorRoute.delete("/:id", async (req, res) => {
    try {
        // controllare se l'id è valido
        let author = await Author.findByIdAndUpdate(req.params.id);
        if (author) {

            // cancellare l'oggetto se l'id è valido
            await Author.deleteOne({
                _id: req.params.id
            })
            res.send("object deleted");
        } else {
            // se l'id non è valido
            res.status(404).send("Author not found");
        }
    } catch (err) {
        console.error(err)
    }
})

// Patch IMG:
//! da fare
authorRoute.patch("/:id/avatar", cloudinaryMiddleware, async (req, res) => {
    try {
        let updatedUser = await Author.findByIdAndUpdate(req.params.id,
            { avatar: req.file.path },
            { new: true }
        );
        console.log(updatedUser);
        res.send(updatedUser);
    } catch (err) {
        console.log(err);
        next(err);
    }
})

// Export
export default authorRoute;