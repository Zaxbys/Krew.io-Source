cd /var/opt
sudo rm -r krew.io-source
sudo wget https://github.com/ZEROPOINTBRUH/Krew.io-Source/releases/download/Release/krew.io-source.zip
unzip krew.io-source.zip
chmod 775 /var/opt/krew.io-source
cd /var/opt/krew.io-source
npm i
npm run build
pm2 restart all