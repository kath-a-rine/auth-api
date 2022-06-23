'use strict';

const express = require('express');
const authRouter = express.Router();

const { users, dataModules } = require('./models');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');

//copied from v1
authRouter.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

//copied from v1
authRouter.get('/:model', handleGetAll);
authRouter.get('/:model/:id', handleGetOne);
authRouter.post('/:model', handleCreate);
authRouter.put('/:model/:id', handleUpdate);
authRouter.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

//RBAC Routes
authRouter.get('/api/v2/read', bearerAuth, permissions('read'), (req, res, next) => {
  res.status(200).send('Ok. Permissions read');
});

authRouter.post('/api/v2/create', bearerAuth, permissions('create'), (req, res, next) => {
  res.status(200).send('Ok. Permissions create');
});

authRouter.put('/api/v2/update', bearerAuth, permissions('update'), (req, res, next) => {
  res.status(200).send('Ok. Permissions update');
});

authRouter.patch('/api/v2/update', bearerAuth, permissions('update'), (req, res, next) => {
  res.status(200).send('Ok. Permissions update');
});

authRouter.delete('/api/v2/delete', bearerAuth, permissions('delete'), (req, res, next) => {
  res.status(200).send('Ok. Permissions delete');
});

module.exports = authRouter;
