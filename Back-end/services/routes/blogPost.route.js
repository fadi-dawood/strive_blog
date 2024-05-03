import blogPost from "../models/blogPost.model.js";
import { Router } from "express";
import cloudinaryMiddleware from "../middlewares/postImg.js";
import { newPostMail } from "../mail/newPostMail.js";
import { Types } from 'mongoose';



// creare una rotta:
const blogPostRouter = Router();

// get all posts 
//! togliere dalla lista i post del logged user
blogPostRouter.get("/", async (req, res) => {
    try {
        // mandiamo una risposta con tutta la lista degli attori
        const Posts = await blogPost.find();
        res.send(Posts);
    } catch (err) {
        console.error(err);
        res.send(err);
    };
});

// get specific post
//^ OK
blogPostRouter.get("/:id", async (req, res) => {
    try {
        // prendere il post dalla database
        const post = await blogPost.findById(req.params.id);

        // post non trovato
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // modificare la lista del commenti (aggiungendo la proprietà "isCommentOfLoggedUser" per dare la possibilita al user loggato di modificare il commento se è suo)
        const commentList = post.comments.map(comment => {
            return {
                ...comment.toObject(), // Converti il commento in un oggetto per evitare problemi di mutabilità
                isCommentOfLoggedUser: (comment.user_id.toString() === req.user._id.toString())
            };
        });

        // aggiornare il post con la lista dei commenti aggiornata
        const postToSend = {
            ...post.toObject(), // Converti il post in un oggetto per evitare problemi di mutabilità
            comments: commentList
        }

        res.send(postToSend);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})


// add new post
//^ OK
blogPostRouter.post("/", async (req, res, next) => {
    try {

        // preparare l'oggetto del post da salvare nella database
        const post = await blogPost.create({
            ...req.body,
            cover: req.file.path,
            author: {
                author_id: req.user._id,
                name: req.user.name,
                avatar: req.user.avatar || "",
            }
        });

        res.send(post);
        // mail di conferma
        newPostMail();

    } catch (err) {
        console.error(err);
        next();

    }
})

// modify post
//! Da fare
blogPostRouter.put("/:id", async (req, res) => {
    try {
        const post = await blogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.send(post);
    } catch (err) {
        console.error(err);
    }
})

// delete post
//! Da fare
blogPostRouter.delete("/:id", async (req, res) => {
    try {
        let post = req.params.id;
        if (post) {
            await blogPost.findByIdAndDelete(post);
            res.send("post deleted");
        } else {
            res.send("Invali ID");
        }
    } catch (err) {
        console.error(err);
    }
})


// Patch PostImg:
//! Da fare
blogPostRouter.patch("/:id/cover", cloudinaryMiddleware, async (req, res) => {
    try {
        let updatedPost = await blogPost.findByIdAndUpdate(req.params.id,
            { cover: req.file.path },
            { new: true }
        );
        res.send(updatedPost);
    } catch (err) {
        console.log(err);
        next(err);
    }
})


// Get all comments of a blog
//! Non serve più
blogPostRouter.get("/:id/comments", async (req, res, next) => {
    try {
        const post = await blogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Blog post not found");
        };

        const commentList = post.comments.map(comment => {
            return {
                ...comment,
                isCommentOfLoggedUser: comment.user_id === req.user._id
            };
        });

        res.send(commentList);
    } catch (err) {
        console.log(err);
        next(err);
    }
});


// Get a specific comment of a blog
//! Non serve più
blogPostRouter.get("/:id/comments/:commentId", async (req, res, next) => {
    try {
        const post = await blogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Blog post not found");
        };

        const commentList = post.comments;
        const comment = commentList.filter((object) => object._id == req.params.commentId);

        res.send(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
});


// add comment to specific post
//^ OK
blogPostRouter.post("/:id", async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await blogPost.findById(postId);
        if (!post) {
            return res.status(404).send("Blog post not found");
        };

        const commentId = new Types.ObjectId();


        post.comments.push({
            _id: commentId,
            user_id: req.user._id,
            user: req.user.userName,
            comment_content: req.body.comment_content
        });

        await post.save();

        res.send(post);
    } catch (err) {
        console.log(err);
        next(err);
    }
});


// Modify a comment:
//^ OK
blogPostRouter.put("/:id/comment/:commentId", async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { comment_content } = req.body;

        const post = await blogPost.findById(postId);
        if (!post) {
            return res.status(404).send("Blog post not found");
        };

        const commentList = post.comments;
        const commentIndex = commentList.findIndex((object) => object._id.toString() === req.params.commentId);
        const comment = commentList[commentIndex];

        comment.user = req.user.userName;
        comment.comment_content = comment_content;

        await post.save();

        res.send(comment);

    } catch (err) {
        console.log(err);
        next(err);
    }
});



// Delete a comment
//^ OK
blogPostRouter.delete("/:id/comment/:commentId", async (req, res, next) => {
    try {
        const post = await blogPost.findById(req.params.id);

        console.log(post);
        if (!post) {
            return res.status(404).send("Blog post not found");
        };

        const commentList = post.comments;
        const commentIndex = commentList.findIndex((object) => object._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).send("Comment not found");
        }


        commentList.splice(commentIndex, 1);
        await post.save();

        res.status(201).send("comment deleted correctly");
    } catch (err) {
        console.log(err);
        next(err);
    }
})


export default blogPostRouter;