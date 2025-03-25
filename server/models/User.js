const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: 'user', enum: ['admin', 'user'] },
    tasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', default: [] } 
})

module.exports = mongoose.model('User', UserSchema)
