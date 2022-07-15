const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const adminSchema = mongoose.Schema(
    {
        _id: ObjectId,
        admin_id: {
            type: Number,
            unique: true
        },
        login: {
            username: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            }
        }
    },
    {
        collection: 'admins' 
    }
)

module.exports = mongoose.model('Admin', adminSchema)