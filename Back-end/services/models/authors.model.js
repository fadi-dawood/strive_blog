import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        userName: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },
        
        email: {
            type: String,
            required: true,
        },

        date_of_birht: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        }
    },

    {
        collection: "authors",
    }

)

export default model("Author", authorSchema);