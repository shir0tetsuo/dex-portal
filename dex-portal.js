const express = require('express');
const chalk = require('chalk');

require("dotenv").config();

const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;

const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework

const X = express(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const PORT = 4000;

const fs = require("fs").promises;
const Sequelize = require('sequelize')

let StartDate = new Date();

var MapController = require('./controller/mapcontroller.js')

///////// FUNCTIONS ////////////////////////////////////////////////////////////
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function genID() {
  return `1P${zeroPad(getRandomInt(999),3)}X${Date.now()}`
}
async function generateNode(M,address) {
  // write cell/node to database
  try {
    const block = M.create({
      coordinate: address,
      owner_id: 0,
      silver: 2,
      gold: 0,
      identity: '0',
      description: '0',
    }).catch(err=>{
      if (err.name === 'SequelizeUniqueConstraintError') {
        //console.log('SYS',address,'NODE EXISTS')
      }
    })
    //console.log('SYS',address,'NODE OK')
  }
  catch (e) {
    console.log(e)
  }
}

async function rMapNode(M,addr) {
  return node = await M.findOne({ where: { coordinate: addr }})
}

async function generateMapComponents(M,x,y) {
  // min/max
  var xmin = parseInt(x) - 5,
    xmax = parseInt(x) + 4,
    ymin = parseInt(y) - 5,
    ymax = parseInt(y) + 5;
  if (xmin < 0) xmin = 0;
  if (xmax >= 180) xmax = 179;
  if (ymin < 0) ymin = 0;
  if (ymax >= 360) ymax = 359;
  var workload = [];
  // loop through generation
  await (async function loop() {
    for (lat = xmin; lat < xmax; lat++) {
      for (lon = ymin; lon < ymax; lon++) {
        var xx = zeroPad(lat,3)
        var yy = zeroPad(lon,3)
        var address = `${xx}${yy}`
        await generateNode(M,address);
      }
    }
  })().then(r => {
    console.log(chalk.greenBright('201 generateMapComponents X',xmin,xmax,'Y',ymin,ymax))
  })

  data = {};
  data.xmin = xmin;
  data.xmax = xmax;
  data.ymin = ymin;
  data.ymax = ymax;

  return data;
  // just calls generateNode function and puts it in cells
  //console.log(workload)
  //node = await rMapNode(M,x,y);
  //
  //return node.silver;
}
function udummy() {
  data = {};
  data.user_id = 0;
  data.silver = 0;
  data.gold = 0;
  data.permission = 0;
  data.level = 0;
  data.mrecord = 0;
  data.portalemail = 0;
  data.portalhash = 0;
  data.portalban = false;
  return data
}
function mdummy() {
  data = {};
  data.owner_id = 0;
  data.silver = 0;
  data.gold = 0;
  data.identity = 0;
  data.description = 0;
  //data.mrecord = 0;
  return data
}
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    //console.log(data.toString());
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
async function newAccount(Users, user_id, user_email, hash) {
  console.log(chalk.greenBright('201 REGISTERED',user_id,user_email))
  data = {};
  data.user_id = user_id;
  data.silver = 10;
  data.gold = 20;
  data.permission = 0;
  data.level = 0;
  data.mrecord = 1;
  data.portalemail = user_email;
  data.portalhash = hash;
  data.portalban = false;

  try {
    const tag = Users.create({
      user_id: data.user_id,
      permission: data.permission,
      level: data.level,
      silver: data.silver,
      gold: data.gold,
      mrecord: data.mrecord,
      portalemail: data.portalemail,
      portalhash: data.portalhash,
      portalban: data.portalban,
    }).catch(e => {
      //console.log(e)
    })
  } catch (e) {
    //if (e.name === 'SequelizeUniqueConstraintError') console.log(chalk.greenBright(`DOCUMENT EXIST ${user_id}`))
  } finally {
    //console.log(data)
    console.log('202 Access Granted',data.portalemail, data.user_id)
  }
  // some Users write fn
}
async function readM(addr) {
  return bit = await M.findOne({
    where: {
      coordinate: addr
    }
  })
}
async function readU(uid) {
  user = await Users.findOne({
    where: {
      user_id: uid
    }
  })
  if (!user) return udummy();
  return user;
}
async function readPortalU(email) {
  //console.log(email)
  user = await Users.findOne({
    where: {
      portalemail: email
    }
  })
  //if (!user) return udummy();
  return user;
}
// SQLITE CONTROLLER
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});
////////////////////////////////////////////////////////////////////////////////
///////// DATABASE DATA ////////////////////////////////////////////////////////
const M = sequelize.define('mapdata', {
  coordinate: {
    type: Sequelize.STRING,
    unique: true,
  },
  owner_id: {
    type: Sequelize.STRING,
  },
  silver: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  gold: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  identity: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false,
  },
});
const Users = sequelize.define('users', {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  permission: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  silver: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  gold: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  mrecord: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  portalemail: {
    type: Sequelize.STRING,
    defaultValue: 0,
    allowNull: false,
    unique: true,
  },
  portalhash: {
    type: Sequelize.STRING,
    defaultValue: 0,
    allowNull: false,
  },
  portalban: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    unique: true,
  }
});
M.sync();
Users.sync();
////////////////////////////////////////////////////////////////////////////////

const block_open = `<blockquote>`
const block_close = `</blockquote>`

////////////////////////////////////////////////////////////////////////////////
// Listen Start
X.listen(
  PORT,
  () => console.log(`Connection Open @ localhost:${PORT}`)
)

// Parse as json
X.use(express.json());
X.use(bparse.urlencoded({ extended: false }));
X.use(bparse.json());
X.use(cookies())
// load /img/ media from folder 'img'
X.use('/pub', express.static('pub'));
X.use('/favicon.ico', express.static('favicon.ico'));

X.use(function(err, req, res, next) {
  console.error(err.stack);
  //res.status(500).send('500 PLEASE CONTACT ADMINISTRATOR')
})

// .get or .post (or .delete?)

X.get('/', async (req, res) => {
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  index = await readFile('./part/index2_infotext.html')
  logos = await readFile('./part/index2_logos.html')
  motd = await readFile('./part/motd.html')

  if (req.cookies.user_email) req.cookies.user_email = `<a href="/ucp"><blue>${req.cookies.user_email}</blue></a>`
  if (!req.cookies.user_email) req.cookies.user_email = "Not Logged In"

  var res_data = '';
  res_data += `${header}`
  res_data += `<body>` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Jump To Random Location"><a href="#" onclick="getRandLoc()">DEX//</a></span>Information ${pub_ver}</div>`
  res_data += `${top_head}information</div></div>${index}`
  res_data += `${block_open}<div class="loginbox"><a href="/auth">Login/Logout</a> &nbsp;<span title="Jump To Random Location"><a href="#" onclick="getRandLoc()">Enter</a></span><br><br>(${req.cookies.user_email})</div>${block_close}`
  res_data += `${block_open}<br>`
  res_data += `System up since ${StartDate}<br><br>`
  res_data += `${block_close}`

  res_data += `${motd}`

  res_data += `${logos}</body>`

  console.log('200 /')
  res.status(200).send(res_data)
})

X.get('/test/:id', async (req, res) => MapController.test_view(req, res, M, Users));

X.get('/logoff', async (req, res) => {
  res.set('location','/')
  res.status(301).send()
})

X.get('/start_instance', async (req, res) => {
  res.status(200).send({
    start_instance: StartDate
  })
})


/*X.get('/auth/ucp', async (req, res) => {
  // check cookies
  // compare with system

  console.log(req.body.user_email)
  res.status(401).send({
    authority: 0
  })
})*/


/// AUTH START /////////////////////////////////////////////////////////////////
X.get('/auth', async (req, res) => {
  //console.log(req.cookies)
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  login = await readFile('./part/login.html')
  rules = await readFile('./part/registered_rules.html')
  logout_a = await readFile('./part/logout_p1.html')
  logout_b = await readFile('./part/logout_p2.html')
  motd = await readFile('./part/motd.html')
  var res_data = '';
  res_data += `${header}`
  res_data += `<body onLoad="loadGateway()">` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>Gateway ${pub_ver}</div>`
  res_data += `${top_head}Authorize</div></div>`
  res_data += `${rules}`
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    res_data += `${logout_a}<b>${req.cookies.user_email}</b>, ${logout_b}`
  } else {
    res_data += `${login}`
  }

  res_data += `${motd}`

  res_data += `</html>`
  console.log(chalk.yellowBright('200 /auth'))
  res.status(200).send(res_data)
})

X.get('/leaders', async (req, res) => {
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  motd = await readFile('./part/motd.html')

  res_data = ''; // header data
  res_data += `${header}`

  res_data += `<body>` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>Leaderboard ${pub_ver}</div>`

  const list_maxgold = await Users.findAll({
    order: [
      ['gold','DESC']
    ]
  })
  const list_maxsilver = await Users.findAll({
    order: [
      ['silver','DESC']
    ]
  })
  const list_maxlevel = await Users.findAll({
    order: [
      ['level','DESC']
    ]
  })
  const list_maxmrecord = await Users.findAll({
    order: [
      ['mrecord','DESC']
    ]
  })
  const list_maxmwealthgold = await M.findAll({
    order: [
      ['gold','DESC']
    ]
  })
  const list_maxmwealthsilver = await M.findAll({
    order: [
      ['silver','DESC']
    ]
  })

  var maxgold = '', maxsilver = '', maxlevel = '', maxmrecord = '', maxmwealthgold = '', maxmwealthsilver = ''

  for (i = 0; i < 12; i++) {
    maxgold += `<a href="/user/${list_maxgold[i].user_id}">${list_maxgold[i].user_id}</a> <gold>${list_maxgold[i].gold} G</gold><br>`
    maxsilver += `<a href="/user/${list_maxsilver[i].user_id}">${list_maxsilver[i].user_id}</a> ${list_maxsilver[i].silver} S<br>`
    maxlevel += `<a href="/user/${list_maxlevel[i].user_id}">${list_maxlevel[i].user_id}</a> <level>${list_maxlevel[i].level} Lv</level><br>`
    maxmrecord += `<a href="/user/${list_maxmrecord[i].user_id}">${list_maxmrecord[i].user_id}</a> <level>${list_maxmrecord[i].mrecord} EXP</level><br>`
    maxmwealthgold += `<a href="/view/${list_maxmwealthgold[i].coordinate}">${list_maxmwealthgold[i].coordinate}</a> <gold>${list_maxmwealthgold[i].gold} G</gold><br>`
    maxmwealthsilver += `<a href="/view/${list_maxmwealthsilver[i].coordinate}">${list_maxmwealthsilver[i].coordinate}</a> ${list_maxmwealthsilver[i].silver} S<br>`
  }


  res_data += `${top_head}` // logo
  res_data += `ldrs`
  res_data += `</div></div>`
  res_data += `${block_open}<div class="userPropertyBox">${maxgold}top_gold</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxsilver}top_silver</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxlevel}top_level</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmrecord}top_exp</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmwealthsilver}most_valuable_silver_nodes</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmwealthgold}most_valuable_gold_nodes</div>${block_close}`

  //res_data += ``
  res_data += `${motd}`


  res.status(200).send(res_data)
})

X.get('/buy/:id', async (req, res) => {
  if (!req.cookies.user_email || !req.cookies.hashed_pwd) return res.status(401).send({
    error: "NOT LOGGED IN / ACCESS DENIED"
  })
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }
  const { id } = req.params;
  Node = await readM(id)
  if (!Node) return res.status(400).send({
    error: "BAD METHOD"
  })

  if (user.silver < Node.silver || user.gold < Node.gold) return res.status(400).send({
    error: "USER NOT ENOUGH FUNDS"
  })

  if (Node.owner_id != 0) var owner_user = await readU(Node.owner_id);
  if (!owner_user) owner_user = {}, owner_user.level = 0;
  if (owner_user.level > user.level) return res.status(400).send({
    error: "NODE OWNER LEVEL > USER LEVEL"
  })

  user_gold = user.gold - Node.gold;
  user_silver = user.silver - Node.silver;
  user_mrecord = user.mrecord + 1;

  Users.update({ gold: user_gold, silver: user_silver, mrecord: user_mrecord },{ where:{ user_id: user.user_id }})

  M.update({ owner_id: user.user_id },{where: { coordinate: Node.coordinate }})
  redirect = await readFile('./part/301.html')
  console.log('301 PURCHASE',req.cookies.user_email)
  res.status(200).send(redirect)
})

X.post('/update', async (req, res) => {
  if (!req.cookies.user_email || !req.cookies.hashed_pwd) return res.status(401).send({
    error: "NOT LOGGED IN / ACCESS DENIED"
  })
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }
  Node = await readM(req.body.address)
  if (!Node) return res.status(400).send({
    error: "BAD METHOD"
  })
  if (user.user_id != Node.owner_id) return res.status(200).send({
    response: "&nbsp;User doesn't have Ownership."
  })

  var node_cost_gold = Node.gold,
  node_cost_silver = Node.silver,
  ident_request = req.body.identity,
  descr_request = req.body.desc,
  gold_request = req.body.gold,
  silver_request = req.body.silver;

  // if the request length in the description exceeds maximum
  if (descr_request.length > 33) return res.status(400).send({error: "Descr len > 33"})

  // if the request leaves the node with less than 0
  if (gold_request < 0 || silver_request < 0) return res.status(400).send({error: "Silver/Gold < 0"})

  var gold_after = Node.gold - gold_request,
  silver_after = Node.silver - silver_request;

  var user_gold_after = user.gold + gold_after,
  user_silver_after = user.silver + silver_after;

  // if the request leaves the user with less than 0
  if (user_gold_after < 0 || user_silver_after < 0) return res.status(400).send({error: "User funds < 0"})

  if (descr_request == '(No Description)') descr_request = 0;

  Users.update({ gold: user_gold_after, silver: user_silver_after },{ where: { portalemail: req.cookies.user_email }})
  M.update({ gold: gold_request, silver: silver_request, identity: ident_request, description: descr_request },{ where: { coordinate: Node.coordinate }})

  res.status(200).send({
    response: "&nbsp;<b>Update Successful</b>",
    reload: true,
  })

  console.log(chalk.greenBright('301 UPDATE SUCCESS',req.cookies.user_email))
})

X.post('/auth/authorize', async (req, res) => {
  var user_email = req.body.user_email;
  var user_password = req.body.password;
  var user_confirm = req.body.passwordconfirmation;
  const hash = bcrypt.hashSync(user_password, saltRounds);
  // EMAIL AUTHENTICATION RULES

  if (!user_email || /...*@..*\..*$/.test(user_email) == false) {
    // bad email
    return res.status(200).send({
      authority: 5,
    })
  }
  if (!user_password || user_password.length < 8) {
    // no password or len < 8
    return res.status(200).send({
      authority: 0,
    })
  } else {
    //console.log(user_email)
    const portalUser = await readPortalU(user_email);
    //console.log(portalUser)
    // error 3 cannot find email
    if (!portalUser && user_confirm == user_password) {
      const user_id = await genID()
      const generation = await newAccount(Users, user_id, user_email, hash)
      return res.status(200).send({
        authority: 22,
        user_id: user_id,
        start_instance: StartDate,
      })
    }
    if (!portalUser || portalUser.portalemail == 0) {
      return res.status(200).send({authority: 3,});
    }
    if (portalUser.portalhash == 'REGISTER' && user_confirm != user_password) {
      return res.status(200).send({
        authority: 20,
      });
    }
    if (portalUser.portalhash == 'REGISTER' && user_confirm == user_password) {
      Users.update({ portalhash: hash },{ where: { portalemail: user_email }})
      console.log(chalk.greenBright('200 AUTHORIZED/HASHED LEGACY',user_email))
      return res.status(200).send({
        authority: 21,
      })
    }
    if (portalUser.portalban == true) return res.status(200).send({authority: 2,});
    if (portalUser.portalemail) {
      if (portalUser.portalhash == 0) return res.status(200).send({ authority: 4, })
      if (bcrypt.compareSync(user_password, portalUser.portalhash)) {
        console.log(chalk.greenBright(`200 Access Elevated by Server ${user_email}`))
        res.status(200).send({
          authority: 1,
          cookie: {
            user_email: user_email,
            hashed_pwd: portalUser.portalhash
          },
          toast: 'server_error',
          login: `<a href="/"><b>Access Granted</b></a><br>Reloading in 5sec.`,
        })
      } else {
        res.status(200).send({
          authority: 4,
        })
      }
    } else {
      return res.status(200).send({
          authority: 3,
        })
    }
  }
  //res.status(501).send('NOT IMPLEMENTED')
})

////////////////////////////////////////////////////////////////////////////////



X.get('/user/:uid', async (req, res) => {

  errorfile = await readFile('./part/400.html')

  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }

  const { uid } = req.params;

  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  motd = await readFile('./part/motd.html')

  errorReturn = `${header}${errorfile}`

  if (!uid) return res.status(400).send(errorReturn)

  res_data = ''; // header data
  res_data += `${header}`

  res_data += `<body>` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>${uid} ${pub_ver}</div>`

  res_data += `${top_head}` // logo
  res_data += `user`
  res_data += `</div></div>`

  var user = await readU(uid);

  if (!user.user_id) return res.status(400).send(errorReturn)

  if (!/.*P.*/.test(user.user_id)) {
    var legacy = "&#11088;";
  } else {
    var legacy = "";
  }

  const tagList = await M.findAll({ where: { owner_id: user.user_id } })
  Properties = tagList.length

  var ownedSilverValue = 0, ownedGoldValue = 0;

  for (i = 0; i < Properties; i++) {
    ownedSilverValue = parseInt(ownedSilverValue) + parseInt(tagList[i].silver),
    ownedGoldValue = parseInt(ownedGoldValue) + parseInt(tagList[i].gold)
  }

  var PropertyDetail = '';

  if (Properties == 0) PropertyDetail = '(No Properties)'

  for (i = 0; i < Properties; i++) {
    if (tagList[i].description == 0) {
      tagList[i].description = '<br>'
    } else {
      tagList[i].description += '<br>'
    }
    PropertyDetail += `<br><a href="/view/${tagList[i].coordinate}"><b>${tagList[i].coordinate}</b></a> // <gold>${tagList[i].gold} G</gold>, ${tagList[i].silver} S, <level>sov. ${tagList[i].updatedAt}</level><br>&nbsp;${tagList[i].description}`
  }

  res_data += `${block_open}<div class="loginbox">`
  res_data += `<b>${uid}</b>${legacy} // <level>Level ${user.level}</level> / <level>${user.mrecord} EXP</level> // <gold>${ownedGoldValue} G</gold>, ${ownedSilverValue} S <gold>in ${Properties} Nodes</gold> // <a href="/leaders">Leaderboard</a>`
  res_data += `</div>${block_close}`

  res_data += `${block_open}<div class="userPropertyBox">`
  res_data += `${PropertyDetail}`
  res_data += `</div>${block_close}`

  res_data += `${motd}`

  console.log(chalk.blueBright('200 user',uid,req.cookies.user_email))
  res.status(200).send(res_data)
    //if (!req.cookies.user_email)
})

X.get('/ucp', async (req, res) => {
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }

    header = await readFile('./part/header.html')
    pub_ver = await readFile('./part/pub_ver.html')
    top_head = await readFile('./part/top_head.html')

    res_data = ''; // header data
    res_data += `${header}`

    res_data += `<body>` // top left elements
    res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
    res_data += `<span title="Information"><a href="/">DEX//</a></span>User Control Panel ${pub_ver}</div>`

    res_data += `${top_head}` // logo
    res_data += `ucp`
    res_data += `</div></div>`

    var re = /@.*$/;
    email_small = req.cookies.user_email.replace(re, "")

    if (!/.*P.*/.test(user.user_id)) {
      var legacy = "&#11088; (legacy) ";
    } else {
      var legacy = "";
    }

    res_data += `${block_open}`
    res_data += `<br><b>${email_small}</b> <a href="/auth">Logout</a><br><br>`
    res_data += `ID: <a href="/user/${user.user_id}">${user.user_id}</a> <b>${legacy}</b><br>Email: ${user.portalemail}<br><br>`
    res_data += `${block_close}`

    res_data += `${block_open}<div class="loginbox">`
    res_data += `<blue>Authority: ${user.permission}</blue><br>`
    res_data += `<level>Level: ${user.level}</level> / <level>EXP: ${user.mrecord}</level><br><br>`
    res_data += `<gold>${user.gold} G</gold>, ${user.silver} S <gold>available</gold> // `

    const tagList = await M.findAll({ where: { owner_id: user.user_id } })
    Properties = tagList.length

    var ownedSilverValue = 0, ownedGoldValue = 0;

    for (i = 0; i < tagList.length; i++) {
      ownedSilverValue += parseInt(tagList[i].silver),
      ownedGoldValue += parseInt(tagList[i].gold)
    }

    res_data += `<gold>${ownedGoldValue} G</gold>, ${ownedSilverValue} S <gold>in ${Properties} Nodes</gold>`
    res_data += `${block_close}</div>`

    console.log(chalk.yellowBright('200 /ucp',req.cookies.user_email))
    res.status(200).send(res_data)

  } else {
    res.status(405).send('NOT LOGGED IN')
  }
})


X.get('/edit/:id', async (req, res) => {
  if (!req.cookies.user_email || !req.cookies.hashed_pwd) return res.status(401).send({
    error: "NOT LOGGED IN / ACCESS DENIED"
  })
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }

  if (!user) return res.status(406).send({
    error: "ACCESS DENIED USER DOESN'T EXIST"
  })
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  editctrl = await readFile('./part/editctrl.html')
  motd = await readFile('./part/motd.html')

  const { id } = req.params;

  const node = await rMapNode(M,id)

  if (!node || !node.coordinate) return res.status(401).send({
    error: "NODE DOESN'T EXIST IN DATABASE"
  })

  if (node.owner_id != user.user_id) return res.status(406).send({
    error: "NODE OWNERSHIP != USER_ID"
  })

  res_data = ''; // header data
  res_data += `${header}`

  res_data += `<body onLoad="loadEditCtrl()">` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span><a href="/view/${id}">${id}</a> ${pub_ver}</div>`

  res_data += `${top_head}` // logo
  res_data += `edit`
  res_data += `</div></div>`

  res_data += `${editctrl}`

  res_data += `${motd}`

  console.log(chalk.blueBright('200 EDIT',id,req.cookies.user_email))

  res.status(200).send(res_data)

})

// MOSTLY DONE

X.get('/view/:id', async (req, res) => {
  let ReqDate = new Date();
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  tools = await readFile('./part/toolkit.html')
  motd = await readFile('./part/motd.html')

  const { id } = req.params;

  if (id.length != 6 || isNaN(id)) {
    res.status(406).send({
      error: `request ${id} length != 6 or isNaN`
    })
  } else {
    // determine x,y
    xxx = parseInt(id.slice(0, 3))
    yyy = parseInt(id.slice(3, 6))
    // define technical limits
    if (parseInt(xxx) >= 180) xxx = 179
    if (parseInt(yyy) >= 360) yyy = 359
    // "real" lat/lon
    realLat = parseInt(xxx) - 90
    realLon = parseInt(yyy) - 180
    // if system had to make correction
    var corrected = '';
    if (parseInt(id.slice(0, 3)) != xxx) corrected += 'xxx-corrected,'
    if (parseInt(id.slice(3, 6)) != yyy) corrected += 'yyy-corrected,'

    maximus = await generateMapComponents(M,zeroPad(xxx,3),zeroPad(yyy,3))

    glyph = '&#9679;';

    var map_system = '<div class="dsp"><!--<div class="nav"><b>N-></b></div>--><table>';

    for (lon = maximus.ymax; lon >= maximus.ymin; lon--) {
      map_system += `<tr>`
      for (lat = maximus.xmin; lat <= maximus.xmax; lat++) {
        var nhead = '', ntail = ''
        addr = `${zeroPad(lat,3)}${zeroPad(lon,3)}`
        NODE = await rMapNode(M,addr)
        if (!NODE) NODE = await mdummy();
        if (NODE.owner_id != 0) nhead = '<level>', ntail = '</level>'
        if (NODE.description == 0) NODE.description = '(No Description)'
        if (user && NODE.silver <= user.silver && NODE.gold <= user.gold) nhead = '<blue>', ntail = '</blue>'
        if (NODE.owner_id == 0) nhead = '', ntail = '', NODE.owner_id = '(No Ownership)'
        if (user && NODE.owner_id == user.user_id) nhead = '<gold>', ntail = '</gold>'
        if (NODE.coordinate == `${zeroPad(xxx,3)}${zeroPad(yyy,3)}`) nhead = '<b>', ntail = "</b>"
        map_system += `<td><a href="/view/${addr}"><span class="nodebase">${nhead}${glyph} ${addr}${ntail}`
        map_system += `<div class="nodeextrude">${NODE.coordinate}<br>${NODE.description}<br>${NODE.owner_id}</div></span></a></td>`
      }
      map_system += `</tr>`
    }

    map_system += `</table></div>`

    // load node data
    BYTE = await readM(`${zeroPad(xxx,3)}${zeroPad(yyy,3)}`);
    if (!BYTE) {
      BYTE = mdummy()
      USER = udummy()
      corrected += 'node-empty-in-database,'
    } else {
      USER = await readU(BYTE.owner_id);
    }

    if (!BYTE.coordinate) {
      BYTE.coordinate = `<b><span title="node-empty-in-database">(Error)</span></b>`
    }

    ident_img_array = [
      '1_city','2_nIV','3_spar','4_spar','5_spar','6_defconstruct',
      '7_railgun','8_nithya','9_dark','10_arirealm','11_arigate','12_NULL','13_astragate','14_lightgate','15_construct','16_wormhole'
    ]

    if (!BYTE.identity) {
      BYTE.identity = 16
    }
    if (!BYTE.description || BYTE.description == 0) {
      BYTE.description = `(No Description)`
    }

    var lvDisplay = '';
    if (USER.level) {
      lvDisplay = `${USER.level}`;
    } else {
      lvDisplay = 0;
    }

    var ownerlink = '', linkclose = '';
    if (BYTE.owner_id != 0 && BYTE.owner_id != undefined) {
      var ownerlink = `<a href="/user/${BYTE.owner_id}">`, linkclose = `</a>`
    }

    ident_img = `${ident_img_array[BYTE.identity-1]}.gif`

    var box_provider = '';
    if (req.cookies.user_email && req.cookies.hashed_pwd) var box_provider = `<a onclick="poptoast('ebox')"><span style="font-family: devicons; font-weight: normal; font-style: normal; font-size: 25px;" ><green>&#xe664;</green></span></a>`;

    var disp_right = '';
    disp_right = `<div class="display-corner-right"><img src="https://shadowsword.tk/img/avaira/${ident_img}">`
    disp_right += `<div class="bottom-right"><span title="Identity">(${BYTE.identity})</span></div>`
    disp_right += `<div class="top-gold"><span title="Cost Gold">${BYTE.gold} G</span></div>`
    disp_right += `<div class="top-edgebar"><span title="Controls">${box_provider}</span></div>`
    disp_right += `<div class="top-level"><level><span style="font-size: 20px !important;" title="Node Level">${lvDisplay}</span></level></div>`
    disp_right += `<div class="top-silver"><span title="Cost Silver">${BYTE.silver} S</span></div>`
    disp_right += `<div class="bottom-left">${BYTE.coordinate}</div>`
    disp_right += `</div>`

    var metadata = '(METADATA) NOT IMPLEMENTED';
    var owner_flag = '';
    var edit_flag = '';

    if (!USER) USER = {}, USER.level = 0;

    if (user && user.user_id != BYTE.owner_id && user.silver >= BYTE.silver && user.gold >= BYTE.gold && user.level >= USER.level) {
      edit_flag = `<div class="editbox"><a href="/buy/${zeroPad(xxx,3)}${zeroPad(yyy,3)}">Purchase</a></div>`
    }

    if (user && user.user_id === BYTE.owner_id) {
      var owner_flag = '(Owned)';
      var edit_flag = `<div class="editbox"><a href="/edit/${zeroPad(xxx,3)}${zeroPad(yyy,3)}">Edit</a></div>`
    }
    metadata = `<div class="extrusionbase"><b>Request: ${id} ${owner_flag}</b><span class="extrude">`
    metadata += `X: ${xxx} `
    metadata += `Y: ${yyy}<br>${ownerlink}Ownership: <b>${BYTE.owner_id}</b>${linkclose}<br>`
    metadata += `M${BYTE.owner_id.toString().substring(0,5)}..//U${USER.user_id.toString().substring(0,5)}.. <br>`
    metadata += `COST: ${BYTE.gold} G, ${BYTE.silver} S`

    let PushDate = new Date();
    var updateTime = PushDate.getTime()-ReqDate.getTime();

    metadata += `</span></div><br><br><span style="font-family: devicons; font-weight: normal; font-style: normal; font-size: 20px;" >&#xe606</span> ${updateTime} ms<br><br><br>`
    metadata += `address: ${zeroPad(xxx,3)}${zeroPad(yyy,3)}<br>`
    //metadata += `coordinate: ${BYTE.coordinate}<br>`
    metadata += `lat,lon: <a href="https://www.google.com/maps/@${realLat}.0000000,${realLon}.0000000,8.0z">${realLat}.00,${realLon}.00</a><br>`
    metadata += `<br><br>`
    //metadata += `<br>description: <b>${BYTE.description}</b><br><br>`
    //metadata += `updated_at: ${BYTE.updatedAt}<br>`
    //metadata += `created_at: ${BYTE.createdAt}`


    // send response
    //console.log(BYTE)

    if (!user) user = {}, user.level = 0, user.silver = 0, user.gold = 0;

    res_data = ''; // header data
    res_data += `${header}`

    res_data += `<body onLoad="loadPortal()">` // top left elements
    res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
    res_data += `<span title="Information"><a href="/">DEX//</a></span>${zeroPad(xxx,3)}${zeroPad(yyy,3)} ${pub_ver}</div>`

    res_data += `${top_head}` // logo
    res_data += `view`
    res_data += `</div></div>`

    res_data += `${tools}` // view and translate toolkit

    res_data += `${block_open}${map_system}${block_close}`

    res_data += `${block_open}<div style="font-size: 16px;">Description: <b>${BYTE.description}</b></div>${block_close}`

    res_data += `${block_open}<div class="dsp">${disp_right}${metadata}</div>${block_close}`

    const failure = `<span class="segmentfail">`
    const pass = `<span class="segmentpass">`

    var levelPass = failure;
    if (parseInt(lvDisplay) <= user.level) levelPass = pass;

    var silverPass = failure;
    if (BYTE.silver <= user.silver) silverPass = pass;

    var goldPass = failure;
    if (BYTE.gold <= user.gold) goldPass = pass;

    //if (user.user_id)

    res_data += `<blockquote class="toast tooldrop dsp" id="ebox">`
    res_data += `<a>Level <level>${lvDisplay}</level> // <level>${user.level} (you)</level> ${levelPass}&#9679;</span></a><br>`
    res_data += `<a>Gold <gold>${BYTE.gold}</gold> // <gold>${user.gold} (you)</gold> ${goldPass}&#9679;</span></a><br>`
    res_data += `<a>Silver ${BYTE.silver} // ${user.silver} (you) ${silverPass}&#9679;</span></a>`
    res_data += `${edit_flag}`
    res_data += `${block_close}`

    res_data += `${block_open}<div class="loginbox"><green><span title="Sovereignty Updated">sov.: ${BYTE.updatedAt}</span></green>`
    res_data += `<br><span title="Node Generated">gen.: ${BYTE.createdAt}</span>`
    res_data += `<br><br><span title="Requested"><gold>req.: ${new Date()}</gold></span>`
    res_data += `<br><span title="Uptime">upt.: ${StartDate}</span>`

    res_data += `</div>${block_close}`

    res_data += `${motd}`


    res_data += `</body>` // closing tag

    console.log(chalk.blueBright(`200 ${id} ${req.cookies.user_email}`))
    res.status(200).send(res_data)
  }
})

// VIEW :id
X.get('/node_json/:id', async (req, res) => {

  const { id } = req.params;

  if (id.length != 6 || isNaN(id)) {
    res.status(406).send({
      error: `request ${id} length != 6 or isNaN`
    })
  } else {
    // determine x,y
    xxx = parseInt(id.slice(0, 3))
    yyy = parseInt(id.slice(3, 6))
    // define technical limits
    if (parseInt(xxx) >= 180) xxx = 179
    if (parseInt(yyy) >= 360) yyy = 359
    // width, height of projection
    var xmin = parseInt(xxx) - 4,
      xmax = parseInt(xxx) + 5,
      ymin = parseInt(yyy) - 2,
      ymax = parseInt(yyy) + 3;
    if (xmin < 0) xmin = 0;
    if (xmax >= 180) xmax = 179;
    if (ymin < 0) ymin = 0;
    if (ymax >= 360) ymax = 359;
    // "real" lat/lon
    realLat = parseInt(xxx) - 90
    realLon = parseInt(yyy) - 180
    // if system had to make correction
    var corrected = '';
    if (parseInt(id.slice(0, 3)) != xxx) corrected += 'xxx-corrected,'
    if (parseInt(id.slice(3, 6)) != yyy) corrected += 'yyy-corrected,'
    // load node data
    BYTE = await readM(`${zeroPad(xxx,3)}${zeroPad(yyy,3)}`);
    if (!BYTE) {
      BYTE = mdummy()
      USER = udummy()
      corrected += 'node-empty-in-database,'
    } else {
      USER = await readU(BYTE.owner_id);
    }

    // send response
    //console.log(BYTE)
    console.log('200 json',id,req.cookies.user_email)
    res.status(200).send({
      request: {
        raw: id,
        xxx: xxx,
        yyy: yyy,
        address: `${zeroPad(xxx,3)}${zeroPad(yyy,3)}`,
        geo: {
          lat: `${realLat}.00`,
          lon: `${realLon}.00`,
          coordinate: `${realLat}.00,${realLon}.00`,
          google_url: `https://www.google.com/maps/@${realLat}.0000000,${realLon}.0000000,8.0z`,
        },
        limits: {
          xmin: xmin,
          xmax: xmax,
          ymax: ymax,
          ymin: ymin,
        }
      },
      node: {
        errors: {
          warning: corrected,
        },
        node_ownership: {
          owner_id: BYTE.owner_id,
          node_updatedAt: BYTE.updatedAt,
          node_createdAt: BYTE.createdAt,
          user_id: USER.user_id,
          user_permission: USER.permission,
          user_level: USER.level,
          user_silver: USER.silver,
          user_gold: USER.gold,
          user_mrecord: USER.mrecord,
        },
        node_coordinate: BYTE.coordinate,
        node_cost_silver: BYTE.silver,
        node_cost_gold: BYTE.gold,
        node_identity: BYTE.identity,
        node_description: BYTE.description,
      },
    })
  }
});
