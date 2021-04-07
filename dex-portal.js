const express = require('express');
const chalk = require('chalk');
const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;
const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework
const X = express();
const PORT = 4000;
const fs = require("fs").promises;
const Sequelize = require('sequelize')

var MapController = require('./controller/mapcontroller.js')

///////// FUNCTIONS ////////////////////////////////////////////////////////////
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
//
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    //console.log(data.toString());
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
//
function udummy() {
  data = {};
  data.user_id = 0;
  data.silver = 0;
  data.gold = 0;
  data.permission = 0;
  data.level = 0;
  data.mrecord = 0;
  return data
}
//
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
//
async function readM(addr) {
  return bit = await M.findOne({
    where: {
      coordinate: addr
    }
  })
}
//
async function readU(uid) {
  user = await Users.findOne({
    where: {
      user_id: uid
    }
  })
  if (!user) return udummy();
  return user;
}
////////////////////////////////////////////////////////////////////////////////
// SQLite3 Controller
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});

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
})
//
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
  }
});
//
M.sync();
Users.sync();
////////////////////////////////////////////////////////////////////////////////

const block_open = `<blockquote>`
const block_close = `</blockquote>`

// Listen Start
X.listen(
  PORT,
  () => console.log(`Success at ${PORT}`)
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
  res.status(500).send('500 PLEASE CONTACT ADMINISTRATOR')
})

// .get or .post (or .delete?)

X.get('/', async (req, res) => {
  index = await readFile('./index.html')
  res.status(200).send(index)
})

X.get('/test/:id', async (req, res) => MapController.test_view(req, res, M, Users));

X.get('/filetest/:id', async (req, res) => {
  partA = await readFile('./part/alpha.txt')
  partB = await readFile('./part/bravo.txt')
  parts = `${partA},${partB}`
  res.status(200).send(parts)
})

/// AUTH START /////////////////////////////////////////////////////////////////
X.get('/auth', async (req, res) => {
  console.log(req.cookies)
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  login = await readFile('./part/login.html')
  motd = await readFile('./part/motd.html')
  var res_data = '';
  res_data += `${header}`
  res_data += `<body onLoad="loadGateway()">` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>Gateway ${pub_ver}</div>`
  res_data += `${top_head}Authorize</div></div>`

  res_data += `${login}`

  res_data += `${motd}`

  res.status(200).send(res_data)
})

/// AUTH START /////////////////////////////////////////////////////////////////
X.get('/register', async (req, res) => {
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  //login = await readFile('./part/login.html')
  motd = await readFile('./part/motd.html')
  var res_data = '';
  res_data += `${header}`
  res_data += `<body onLoad="loadRegistrar()">` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>Gateway ${pub_ver}</div>`
  res_data += `${top_head}Register</div></div>`

  //res_data += `${login}`

  res_data += `${motd}`

  res.status(200).send(res_data)
})

X.post('/auth/epost/:address', async (req, res) => {
  const { address } = req.params;
  res.status(501).send(`NOT IMPLEMENTED (${address})`)
})

/*X.get('/auth/ucp', async (req, res) => {
  // check cookies
  // compare with system

  console.log(req.body.user_email)
  res.status(401).send({
    authority: 0
  })
})*/

X.post('/auth/authorize', async (req, res) => {
  var user_email = req.body.user_email;
  var user_password = req.body.password;
  if (!user_password || user_password.length < 8) {
    return res.status(200).send({
      authority: 0,
    })
  } else {
    bcrypt.hash(user_password, saltRounds, function(err, hash) {
      //console.log(hash)
      // compare password data here

      // redirect given response
      //res.set('location','/')
      //res.status(301).send()
      res.status(200).send({
        authority: 1,
        cookie: {
          user_email: user_email,
          hashed_pwd: hash
        },
        toast: 'server_error',
        login: `<a href="/"><b>Access Granted</b></a>`,
      })
    });
  }
  //res.status(501).send('NOT IMPLEMENTED')
})


// MOSTLY DONE

X.get('/view/:id', async (req, res) => {
  let ReqDate = new Date();
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

    ident_img = `${ident_img_array[BYTE.identity-1]}.gif`

    var disp_right = '';
    disp_right = `<div class="display-corner-right"><img src="https://shadowsword.tk/img/avaira/${ident_img}">`
    disp_right += `<div class="bottom-right"><span title="identity">(${BYTE.identity})</span></div>`
    disp_right += `<div class="top-gold"><span title="cost_gold">${BYTE.gold} G</span></div>`
    disp_right += `<div class="top-silver"><span title="cost_silver">${BYTE.silver} S</span></div>`
    disp_right += `<div class="bottom-left">${BYTE.coordinate}</div>`
    disp_right += `</div>`

    var metadata = '(METADATA) NOT IMPLEMENTED';
    metadata = `<div class="extrusionbase"><b>Request: ${id}</b><span class="extrude">`
    metadata += `X: ${xxx} `
    metadata += `Y: ${yyy}<br><b>Ownership: ${BYTE.owner_id}</b><br>`
    metadata += `M${BYTE.owner_id.toString().substring(0,5)}..//U${USER.user_id.toString().substring(0,5)}..<br>`
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

    res_data = ''; // header data
    res_data += `${header}`

    res_data += `<body onLoad="loadPortal()">` // top left elements
    res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
    res_data += `<span title="Information"><a href="/">DEX//</a></span>${zeroPad(xxx,3)}${zeroPad(yyy,3)} ${pub_ver}</div>`

    res_data += `${top_head}` // logo
    res_data += `view`
    res_data += `</div></div>`

    res_data += `${tools}` // view and translate toolkit

    res_data += `${block_open}(MAPVIEW) NOT IMPLEMENTED${block_close}`

    res_data += `${block_open}<div style="font-size: 16px;">Description: <b>${BYTE.description}</b></div>${block_close}`

    res_data += `${block_open}<div class="dsp">${disp_right}${metadata}</div>${block_close}`

    res_data += `${block_open}UP: ${BYTE.updatedAt}<br>CR: ${BYTE.createdAt}<br>RQ: ${new Date()}${block_close}`

    res_data += `${motd}`


    res_data += `</body>` // closing tag

    console.log(chalk.blueBright(`200 ${id}`))
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
    console.log(200)
    res.status(200).send({
      request: {
        raw: id,
        xxx: xxx,
        yyy: yyy,
        address: `${xxx}${yyy}`,
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
