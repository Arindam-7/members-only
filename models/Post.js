const { model, Schema } = require('mongoose')

const PostSchema = new Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 70 },
    content: { type: String, required: false, maxlength: 500 },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
})

PostSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

PostSchema.virtual('url').get(function () {
    return '/posts/' + this._id
})

const Post = model('Post', PostSchema)

module.exports = Post