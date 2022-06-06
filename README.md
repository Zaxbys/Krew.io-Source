# Krew.io Source
 Krew.io Source is an open source engine for krew.io

## Disclaimer
 This code was sourced off https://github.com/arpandutta0000/krew2.io

### Prequisites
 * Node.js v14
 * NPM v7
 * NGINX
 * MongoDB

**Running in development**
``npm run dev``

**Running in production** (using pm2 to keep process alive)
``npm run prod``

Running in production mode serves to ``localhost:8200``.
Running in dev mode serves to ``localhost:8080``.

In production, Nginx proxies the local webfront port to 443 and redirects 80 to 443. 

## Webserver Setup

### Automated Installation.
```sh
# Please run me in root
su

# Obtaining the files
wget https://raw.githubusercontent.com/ZEROPOINTBRUH/Krew.io-Source/main/bash%20installation/automated-install.sh

# Changing Permissions of the installation
chmod 777 automated-install.sh

# Run the installation
./automated-install.sh
```

### After this is complete
Please follow the instructions guided here
https://github.com/ZEROPOINTBRUH/Krew.io-Source#create-certificates
& https://github.com/ZEROPOINTBRUH/Krew.io-Source#mongodb-setup


### Manual Installation
```sh
# Please run me in Root
su

# Installing common distributables

apt install sudo -y # Sudo 
sudo apt install ssh fail2ban -y # SSH & SERVICES 
sudo apt install gnupg htop git wget curl apt-transport-https software-properties-common gnupg2 unzip -y # Common Necessities
sudo apt install nginx -y # Web Service
sudo apt install python3-certbot-dns-cloudflare -y # Certbot 
# sudo apt install ufw -y # FireWall (Not Required)

# Halting Nginx
systemctl stop nginx

# Unlink the old NGINX configuration.
unlink /etc/nginx/sites-enabled/default

# Fetching Latest Nginx Configuration

cd /etc/nginx/conf.d
wget https://raw.githubusercontent.com/ZEROPOINTBRUH/Krew.io-Source/main/nginx%20config/krew.conf

# Preparing Certificates to be setup manully
mkdir /root/.secrets/
cd /root/.secrets/
wget https://raw.githubusercontent.com/ZEROPOINTBRUH/Krew.io-Source/main/certbot/cloudflare.ini

# Now It must be a secret right?
sudo chmod 0700 /root/.secrets/
sudo chmod 0400 /root/.secrets/cloudflare.ini

# Fetching Required Third Party Packages
cd /home
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org.list
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
sudo apt update -y

sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt update -y

# Install common third party distributables
sudo apt install mongodb-org -y # MongoDb 4.4
sudo apt -y install nodejs -y # NodeJs 14.16.0

# Install PM2 Globaly
npm i -g npm
npm i pm2 -g

# Enable Mongodb
systemctl enable --now mongod

# Update Everything
sudo apt update -y && sudo apt upgrade -y && sudo apt full-upgrade -y
# Prequilities Aquired

# Aquiring Files
cd /var/opt
wget https://github.com/ZEROPOINTBRUH/Krew.io-Source/releases/download/Release/krew.io-source.zip

# Extracting Package
unzip krew.io-source.zip
rm -rf krew.io-source.zip
chmod 775 /var/opt/krew.io-source

# Installing Node Modules
cd /var/opt/krew.io-source
npm i
npm run prod
```

### Create Certificates
```sh
# Please Run me as root
su

# Your website has to be registared to https://www.cloudflare.com/ dns service

# Editing Certbot Information
nano /root/.secrets/cloudflare.ini

# dns_cloudflare_email = youremail@example.com
# dns_cloudflare_api_key = yourapikey 

# Keep your secrets a Secret
sudo chmod 0700 /root/.secrets/
sudo chmod 0400 /root/.secrets/cloudflare.ini

# Create the Certificate
# Fun fact: You dont need to open port 80 to create the certificate
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.secrets/cloudflare.ini -d example.com,*.example.com
```


### Mongodb Setup

```sh
# Please Run me as root
# Open Mongodb up
mongo

# Run these Commands in mongodb
use exampledb
db.createUser({user: 'exampledb',pwd: 'passwordsgenerator.net',roles: [ { role: 'readWrite', db: 'exampledb' } ]});
```


## Admin Commands
 ```
 ;;login
 ```
 - Set playerEntity.isAdmin to ``true`` (otherwise other admin commands won't work).

 ```
 ;;say <message>
 ```
 - Send an admin message to all players online.

 ```
 ;;whois <seadog123>
 ```
 - Get player ID of specified seadog (in this case seadog123).

 ```
 ;;kick <Identifier> [reason]
 ```
 - Disconnect a player's socket connection (kick them) and display reason on his screen.
 - Identifier can be either a playerID or displayname.
 - Reason is optional.

 ```
 ;;ban <Identifier> [reason]
 ```
 - Disconnect a player's socket connection (kick them) and display reason on his screen.
 - Additionally adds them to the permanent ban list, barrciading them from using their account.
 - Identifier can be either a playerID or displayname.
 - Reason is optional.

 ```
 ;;unban <Identifier>
 ```
 - Removes a user from the permanent ban list and sends a webhook to Discord.
 - Identifier can be either a playerID or displayname.
 - Reason is optional.

 ```
 ;;nick <name>
 ```
 - Set the name in the chat to a specified string (for easier admin communication).

 ```
 ;;restart
 ```
 - Saves the current game progress of all players which are logged in. Then, disconnects all players from the server.
 - Detailed information about how to smoothly restart the server is located further down in this document.

 ## Mod Commands
 ```
 ;;login
 ```
 - Set playerEntity.isMod to ``true`` (otherwise other mod commands won't work).

 ```
 ;;report <Identifier> [reason]
 ```
 - Report a player (sends him a warning and a webhook message to Discord. When a player gets reported the second time, he is kicked from the server).

 ```
 ;;mute <Identifier> [reason]
 ```
 - Mute a player (for 5 minutes) and display a message to him telling him that he has been muted. Sends a webhook message to Discord with the reason.

 ```
 ;;tempban <Identifier> [reason]
 ```
 - Temporarily ban a player.

 ```
 ;;ban <Identifier> [reason]
 ```
 - Permanently ban an account. This player will be unable to use this account

## Smooth Server Restart
 - Login to the game with your user account.
 - Authenticate yourself as admin in the chat:
 ```
 ;;login
 ```

 - Save the current progress of all players and "kick" them from the game.
 ```
 ;;update
 ```
 - The game will automatically kick all players and pull the latest commit from GitHub. Once done, it will restart itself and allow players to join back.


## Documentation

### Network Types

 ```
 -1: Entity
 0: Player
 1: Boat    
 2: Projectile
 3: Impact
 4: Pickup ( Fish / crab / shell / cargo / chest)
 5: Island
 ```

### Ship States

 ```
 -1: Starting
 0: Sailing
 1: Docking
 2: Finished Docking
 3: Anchored
 4: Departing
 ```

### Projectiles

 ```
 0: Cannonball
 1: Fishing Hook
 ```

### Weapons

 ```
 -1: Nothing
 0: Cannon
 1: Fishing Rod
 2: Telescope
 ```
