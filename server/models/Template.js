const mongoose = require('mongoose')

const FieldSchema = new mongoose.Schema({}, { strict: false })
const PageSchema = new mongoose.Schema({}, { strict: false })

const TemplateSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled template' },
  pages: { type: [PageSchema], default: [] },
  fields: { type: [FieldSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

TemplateSchema.pre('save', function(next){
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Template', TemplateSchema)