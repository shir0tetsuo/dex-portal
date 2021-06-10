async function checkAuthorization(user_email, hashed_pwd) {
  var flag = false;
  if (!user_email || !hashed_pwd) return flag;
  if (user_email == undefined || parseInt(user_email) == 0 || user_email.length < 3) return flag;
  if (user_email && hashed_pwd) {
    var user = await readPortalU(user_email);
    if (user && hashed_pwd == user.portalhash) {
      flag = true;
      console.log(202,user_email)
    }
  }
  return flag;
}
