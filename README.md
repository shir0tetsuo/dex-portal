# dex-portal
REST API + Express + Sqlite3 served on HTML

/ = index/mainpage
/test/:id = test
/register = registration
/register/legacyhash = legacy hash / userid pair generator
/register/legacy = poke caller (unimplemented)
/auth = the login/logout page
/auth/authorize = login POST, get user token/hash cookie
/logoff = Redirection Update back to /auth
/view/:id = Node ID/Address & Map Viewer
/node_json/:id = Node Json Printer

/ucp = (unimplemented) User Control Panel

/user/:uid = (unimplemented) view user's data
