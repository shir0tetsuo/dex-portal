const SHA256 = require('crypto-js/sha256')

function getNow(){
  return new Date().toLocaleString();
}

class EHash{
  constructor(uid){
    this.uid = uid;
    this.timestamp = getNow();
    this.execution = new Date().getTime();
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.timestamp + this.execution + this.nonce + this.uid).toString();
  }
}

exports.mine = async (user) => {
  let ehash = await new EHash(user.user_id);
  console.log(ehash)
  return ehash;
}
