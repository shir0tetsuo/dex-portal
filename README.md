# dex-portal
REST API + Express + Sqlite3 "Realm/Node/Property" Database served on HTML

# What It Does
The Avaira bot is able to register "legacy" accounts linked to a discord userid. This is done for cross-use purposes.

There is a simplified 2D array of the max longitude/latitude values converted into six digit pointers.
The system is able to store publicly displayed nodes encoded in these pointers. The nodes can be captured by others.

There are two simplified centralized currencies "Silver" and "Gold" that users can use to purchase nodes.

There is a bank that can donate shareable hashes and keys to obtain funds. This has a timer delay.

# Building
This requires the avaira sql database from the avaira project.

Dependencies are listed in `npm.sh` otherwise see https://cdn.shadowsword.tk/ as components (CSS, JS, images) are stored here. This wasn't designed with external users in mind, sorry. At some point I will take the time to add those files to Github.

Tested working through Caddy's proxy.

# Running
It's possible to run the project through the `up.sh` file and through a .service file in `/etc/systemd/system`

https://realmdex.shadowsword.tk/

/ = Main Page

/auth = Authentication

/logoff = Logoff Compliment

/view/:id = View Node

/user/:uid = User Information

/leaders = Leaderboard Generation

/edit/:id = Edit Node

/delete/:id = Delete Node

/update = POST for edit compliment

/ucp = User Control Panel

/node_json = Print node as json

Legacy ownership requires Avaira ..legacy command from Concord Discord server
