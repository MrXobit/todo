const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },                  
    description: { type: String, default: '' },                
    status: { 
        type: String, 
        enum: ['pending', 'in progress', 'completed'],         
        default: 'pending'                                  
    },
    createdAt: { type: Date, default: Date.now },                
    updatedAt: { type: Date, default: Date.now },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }                  
})

module.exports = mongoose.model('Task', TaskSchema)
