Setup a project:
1. Instal Node.js
2. Run cmd from the project folder
3. Run "npm init" command and follow the instructions
4. Install the webdriverIO "npm install webdriverio"
5. Run the config helper './node_modules/.bin/wdio config'
6. Follow the instructions and choose tools that you are needed (allure, selenium-stand-alone, chromedriver, jasmie)
7. Check that all is installed "npm install"

Run the test:
1. Run cmd from the main project folder 
2. Run the "selenium-standalone start" command
3. Run cmd again from the project folder
4. Run the "wdio" command

Reports:
1. Run cmd from the project folder
2. Run the "npm run allureReport" command

To change the browser: open wdio.config - find browsers section and change the name of the browser or add another.