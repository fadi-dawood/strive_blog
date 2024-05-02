import { Schema, model } from "mongoose";

const blogPostSchema = new Schema(
    {
        category: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        cover: {
            type: String,
            require: false
        },
        readTime: {
            value: {
                type: Number,
                require: true
            },
            unit: {
                type: String,
                require: true
            }
        },
        author: {
            name: {
                type: String,
                require: false
            },
            avatar: {
                type: String,
                require: false
            }
        },
        content: {
            type: String,
            require: true
        },
        comments: [
            {
                user: {
                    type: String,
                    require: true
                },
                comment_content: {
                    type: String,
                    require: true
                }
            }
        ]

    },
    {
        collection: "blogPosts"
    }
)

export default model("blogPost", blogPostSchema)