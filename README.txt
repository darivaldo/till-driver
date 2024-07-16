#================================================
# App: Dado - Motorista: Mobilidade Urbana app do Motorista
# Author: Darivaldo Santos daridados@gmail.com
# Date:   04/07/2024
# Patrocinador: Cooperativa Coopta - https://coopta.coop.br/
#================================================

#Configurações necessarias

1o.
#node 12.22.12
nvm install 12.22.12
nvm use 12.22.12

2o.
npm install cordova@10.0.0-nightly.2019.12.2.838a0578 --legacy-peers-deps --force

3o.
npm install ionic@5.0.0-beta.0 --legacy-peers-deps --force

4o.
ionic integrations enable cordova --add 

5o.
npm i --legacy-peers-deps --force


# APENAS INSTALAR
adb.exe install -r C:\_Coopta\dado-driver\platforms\android\app\build\outputs\apk\debug\app-debug.apk

