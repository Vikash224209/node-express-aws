'use strict';
// In-memory store – swap for Mongoose / pg / DynamoDB as needed
let items = [];
let idSeq = 1;

exports.list = (_req, res) => {
  res.json({ data: items });
};

exports.create = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const item = { id: idSeq++, name, createdAt: new Date().toISOString() };
  items.push(item);
  res.status(201).json({ data: item });
};

exports.getById = (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json({ data: item });
};

