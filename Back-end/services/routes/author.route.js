import { Router } from "express";
import Author from "../models/authors.model.js";
import cloudinaryMiddleware from "../middlewares/avatar.js";
import bcrypt from "bcryptjs";
import blogPost from "../models/blogPost.model.js";


// Creiamo un nuovo Router 
const authorRoute = Router();


// Richiesta GET tutti gli autori

authorRoute.get("/", async (req, res) => {
    try {
        // mandiamo una risposta con tutta la lista degli attori
        const authors = await Author.find();
        res.send(authors);
    } catch (err) {
        console.error(err);
    };
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

// Richiesta PUT (modifica dati profilo)
//^ok
authorRoute.put("/", async (req, res) => {

    try {
        // trovare il user
        let foundUser = await Author.findById(req.user._id);
        if (foundUser) {

            // controllare la password
            const isPasswordMatching = await bcrypt.compare(
                req.body.password,
                foundUser.password
            );

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
//^ok
authorRoute.delete("/", async (req, res) => {
    try {
        // controllare se l'id è valido
        let author = await Author.findByIdAndUpdate(req.user._id);

        if (author) {
            // cancellare l'account se l'id è valido
            await Author.deleteOne({
                _id: req.user._id
            })

            // cancellare tutti i commenti del user
            await blogPost.updateMany(
                { "comments.user_id": req.user._id },
                { $pull: { comments: { user_id: req.user._id } } }
            );

            // cancellare tutti i blogs del user
            await blogPost.deleteMany(
                { "author.author_id": req.user._id }
            );

            res.status(200).send("object deleted");
        } else {
            // se l'id non è valido
            res.status(404).send("Author not found");
        }
    } catch (err) {
        console.error(err)
    }
});

// Patch IMG:
//^ok
authorRoute.patch("/avatar", cloudinaryMiddleware, async (req, res) => {
    try {
        let foundUser = await Author.findById(req.user._id);
        if (foundUser) {
            let updatedUser = await Author.findByIdAndUpdate(req.user._id,
                { avatar: req.file.path },
                { new: true }
            );
            res.send(updatedUser);
        } else {
            res.status(404).send("user not found");
        }
    } catch (err) {
        console.log(err);
        next(err);
    };
});

// Export
export default authorRoute;