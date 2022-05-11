const mongoose = require('mongoose')

const { Schema } = mongoose

const IdsSchema = new Schema({

    dteId: { type: String },
    
    wmsId: { type: String },

    creditNoteErpId: { type: String },
    
    erpId: { type: String },
    
    incrementalOrderId: { type: String },

    prefix: { type: String },

    rel: { type: String },

})

module.exports = mongoose.model('Ids', IdsSchema)