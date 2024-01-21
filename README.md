# dex-portal
REST API + Express + Sqlite3 "Realm/Node/Property" Database served on HTML

# Dec. 7, 2023
Working local copy (beta test) only. Pulled directly from the remains from the server. This is the **last** v1 update. A few bugs were fixed, there is now an example.env for quicker setup though it's not well documented. You can see a working version of this in the uploaded screenshot. This is based on what is now relatively old dependencies; As-is, this is no longer a very useful tool, but good examples exist for some still relevant extensions such as Stripe. TL;DR, this is a janky "working" "dex-portal", which is posted for reference, and has since become obsolete by newer systems.

# V3
Third gen. might be constructed in a separate system, data management inspiration from the hcfs tool.

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
