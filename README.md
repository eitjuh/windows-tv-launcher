windows-tv-launcher
===================

Launcher for windows tv

For Windows

=Requirements=
1. Install Git Bash
2. Install NodeJS
3. Install MongoDB
4. Install NirCmd (CLI tool to activate windows)

=Initial setting up=
1. Checkout repository
2. Goto "app" folder and run command "npm install"
3. In the root directory, create a folder called dbdata and create a folder called tmp

=Running=
1. Start MongoDB from the root folder with the command: "mongod --dbpath dbdata" to start the DB
2. Start the application with "node app/app.js"
