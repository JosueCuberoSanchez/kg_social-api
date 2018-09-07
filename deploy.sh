#!/bin/sh
ssh ubuntu@13.59.74.182 <<EOF
 cd ~/KG_Social_api/kg_social-api
 pwd
 git pull
 npm install — production
 pm2 restart all
 exit
EOF