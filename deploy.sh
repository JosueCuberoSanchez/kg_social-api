#!/bin/sh
ssh ubuntu@18.222.187.211 <<EOF
 cd ~/KG_Social_api/kg_social-api
 git pull
 npm install — production
 pm2 restart all
 exit
EOF