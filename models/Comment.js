/**
**  Comment Model & Schema
*/
const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    replay: [
        {
            body: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            creatAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
}, {
    timestamps: true
})

const Comment = model('Comment', commentSchema)
module.exports = Comment