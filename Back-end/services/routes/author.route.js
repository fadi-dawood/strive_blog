import { Router } from "express";
import Author from "../models/authors.model.js";
import cloudinaryMiddleware from "../middlewares/avatar.js";
import bcrypt from "bcryptjs";


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
//^ok
authorRoute.get("/logged-user", async (req, res) => {
    try {
        // cercare l'autore richiesto
        let author = await Author.findById(req.user._id);

        // mandare la risposta
        if (author) {
            let user = {
                name: author.name,
                lastName: author.lastName,
                avatar: author.avatar || "",
                userName: author.userName,
                email: author.email,
                date_of_birht: author.date_of_birht,
            };
            console.log(user)
            res.send(user);
        } else {
            res.status(404).send("Author not found");
        }
    } catch (err) {
        console.error(err);
    }
});

// Richiesta PUT
//! modifocare profilo
authorRoute.put("/", async (req, res) => {
    
    try {
        // trovare il user
        let foundUser = await Author.findById(req.user._id);
        console.log(foundUser);
        if (foundUser) {

            // controllare la password
            const isPasswordMatching = await bcrypt.compare(
                req.body.password,
                foundUser.password
            );
            console.log(foundUser.password);

            console.log(isPasswordMatching);
            if (isPasswordMatching) {

                // controllare se il nuovo username sia disponibile
                const isUsernameAviable = await Author.findOne({
                    userName: req.body.userName
                });

                if (!isUsernameAviable) {
                    // eseguire la modifica senza modificare la password
                    let newAuthor = req.body
                    delete newAuthor.password
                    let author = await Author.findByIdAndUpdate(foundUser._id, newAuthor, {
                        new: true,
                    });
                    res.send(author);
                } else {
                    res.status(400).send("user name non aviable");
                    
                };
            } else {
                res.status(406).send("non valid password");
                //res.status(400).json({ error: "non valid password" });

            };

        } else {
            res.status(404).send(req.body.userName + "user non trovato");
        };

    } catch (err) {
        console.error(err);
    };
});

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