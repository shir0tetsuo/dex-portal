const SHA256 = require('crypto-js/sha256')

const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});

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

Rewards.sync()

async function ruser(Rewards) {
  return node = await Rewards.findOne({ where: { id: 4 }})
}

ruser(Rewards).then(r =>{ console.log('ID',r.id, 'REWARD',r.reward, 'HASH',r.hash, 'KEY',r.key) })
