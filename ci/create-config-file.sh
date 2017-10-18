mv ./{config.example,config}.json
sed -i -e "s|http://example.com/glpi/apirest.php|${APIREST_URL}|g" config.json
sed -i -e "s|exampleName|${USER_NAME}|g" config.json
sed -i -e "s|examplePassword|${USER_PASSWORD}|g" config.json
sed -i -e "s|exampleUserToken|${USER_TOKEN}|g" config.json
sed -i -e "s|exampleAppToken|${APP_TOKEN}|g" config.json
