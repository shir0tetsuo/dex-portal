const express = require('express');
const chalk = require('chalk');
const gsmine = require('./gsmine')

require("dotenv").config();
const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;
const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework

const block_open = `<blockquote>`
const block_close = `</blockquote>`

const X = express(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const PORT = 4000;

const fs = require("fs").promises;
const Sequelize = require('sequelize') // db
let StartDate = new Date(); // when program started running
require('./_common')
require('./_db')
require('./_core')
require('./_auths')
require('./_listen')
require('./_POST')
require('./_GET')
