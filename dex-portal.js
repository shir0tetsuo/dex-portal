const express = require('express');
const X = express();
const PORT = 4000;
const Sequelize = require('sequelize')

var MapController = require('./controller/mapcontroller.js')

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

async function readM(addr){
  return bit = await M.findOne({ where: { coordinate: addr }})
}

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

async function readU(uid){
  user = await Users.findOne({ where: { user_id: uid }})
  if (!user) return udummy();
  return user;
}

// SQLite3 Controller
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});

// client.map
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

M.sync();
Users.sync();

// Listen Start
X.listen(
  PORT,
  () => console.log(`Success at ${PORT}`)
)

// Parse as json
X.use( express.json() )

// load /img/ media from folder 'img'
X.use('/pub', express.static('img'));
X.use('/favicon.ico', express.static('favicon.ico'));
//X.use(express.bodyParser());
//X.use(express.cookieParser());
//X.use(X.router);

X.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('500 PLEASE CONTACT ADMINISTRATOR')
})

// .get or .post (or .delete?)

X.get('/map/:id', MapController.map_view);
//X.get('/map/:id', async (req, res) => {
//  res.status(200).send(req.params)
//})

// VIEW :id
X.get('/node/:id', async (req, res) => {

  const { id } = req.params;

  if (id.length != 6 || isNaN(id)) {
    res.status(406).send({
      error: `request ${id} length != 6 or isNaN`
    })
  } else {
    // determine x,y
    xxx = parseInt(id.slice(0,3))
    yyy = parseInt(id.slice(3,6))
    // define technical limits
    if (xxx >= 180) xxx = 179
    if (yyy >= 360) yyy = 359
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
    realLat = parseInt(xxx)-90
    realLon = parseInt(yyy)-180
    // if system had to make correction
    var corrected = '';
    if (parseInt(id.slice(0,3)) != xxx) corrected += 'xxx-corrected,'
    if (parseInt(id.slice(3,6)) != yyy) corrected += 'yyy-corrected,'
    // load node data
    BYTE = await readM(`${xxx}${yyy}`);
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
