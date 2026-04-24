'use strict';
const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');
const cors    = require('cors');

const healthRouter = require('./routes/health');
const apiRouter    = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/v1', apiRouter);

app.use(errorHandler);

module.exports = app;

