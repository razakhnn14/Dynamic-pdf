const express = require('express')
const router = express.Router()
const Template = require('../models/Template')

// Create
router.post('/', async (req, res) => {
  try {
    const { title, pages, fields } = req.body
    const tpl = new Template({ title, pages, fields })
    await tpl.save()
    return res.status(201).json({ id: tpl._id, template: tpl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to save template' })
  }
})

// Read by id
router.get('/:id', async (req, res) => {
  try {
    const tpl = await Template.findById(req.params.id)
    if (!tpl) return res.status(404).json({ error: 'Not found' })
    return res.json({ id: tpl._id, template: tpl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch template' })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const { title, pages, fields } = req.body
    const tpl = await Template.findByIdAndUpdate(req.params.id, { title, pages, fields, updatedAt: Date.now() }, { new: true })
    if (!tpl) return res.status(404).json({ error: 'Not found' })
    return res.json({ id: tpl._id, template: tpl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to update template' })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const tpl = await Template.findByIdAndDelete(req.params.id)
    if (!tpl) return res.status(404).json({ error: 'Not found' })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete template' })
  }
})

// List (simple)
router.get('/', async (req, res) => {
  try {
    const list = await Template.find().sort({ updatedAt: -1 }).limit(50)
    return res.json(list.map(t => ({ id: t._id, title: t.title, createdAt: t.createdAt, updatedAt: t.updatedAt })))
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to list templates' })
  }
})

module.exports = router