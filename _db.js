// SQLITE CONTROLLER
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});

async function readRewardHashed(hash) {
  pack = await Rewards.findOne({
    where: {
      hash: hash
    }
  })
  return pack;
}
async function umr(Users,user_email) {
  user = await readPortalU(user_email)
  if (!user) return;
  const levelCalculated = Math.floor(0.4 * Math.sqrt(user.mrecord));
  const levelRewardGold = Math.floor(user.mrecord / 12);
  const levelRewardSilver = 10 + Math.floor(user.mrecord / 10) + levelCalculated;
  var newmrecord = user.mrecord + 1,
  newsilver = user.silver + levelRewardSilver,
  newgold = user.gold + levelRewardGold;
  if (levelCalculated > user.level) {
    console.log('200 UPDATED USER LEVEL',user_email,levelCalculated)
    Users.update({level: levelCalculated, gold: newgold, silver: newsilver, mrecord: newmrecord},{where: { user_id: user.user_id }})
  } else {
    Users.update({mrecord: newmrecord},{where: { user_id: user.user_id }})
  }
}
async function readPortalU(email) {
  //console.log(email)
  if (!email) return udummy()
  user = await Users.findOne({
    where: {
      portalemail: email
    }
  })
  //if (!user) return udummy();
  return user;
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
async function readReward(uid) {
  pack = await Rewards.findOne({
    where: {
      user_id: uid
    }
  })
  return pack;
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
function bdummy() {
  data = {};
  return data
}

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
// make a list from a user's zones to tether this to
const Mission = sequelize.define('mission', {
  owner_id: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false
  },
  m_name: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false
  },
  m_type: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  m_area: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false
  },
  m_area_securityrating: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false
  },
  m_description: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false
  },
  m_difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  m_corruption: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  m_complete: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  m_date:{
    type: Sequelize.STRING,
    defaultValue: 'May 1, 2021 12:00:00',
    allowNull: false
  }
})

const Rewards = sequelize.define('rewards', {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  last_execution: {
    type: Sequelize.STRING,
    defaultValue: "0",
    allowNull: false,
  },
  next_execution: {
    type: Sequelize.STRING,
    defaultValue: "0",
    allowNull: false,
  },
  hash: {
    type: Sequelize.STRING,
    unique: true,
  },
  key: {
    type: Sequelize.STRING,
    defaultValue: 0,
    allowNull: false,
  },
  reward: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
})
// (uid).block -> (level*calculator)=next_execution,payout;

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
Mission.sync();
Rewards.sync();
Users.sync();
