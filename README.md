# node-project-server
node-project-server is a MEAN (Mongodb, Express, Angularjs, Node.js) web application that focuses on streamlining and automating the process of submitting project reports at Harris Corportation to track savings throughout the company.

The client-side is built using Angularjs (with Foundation css framework for styling), and uses SPA (Single Page Application) principals such as angular routing to deliver a seamless user experience navigating through the application. 
The middleware of the application uses Express.js to provide a REST api for the client application to share data with a Mongodb database.

## Dependencies required before setup:
    git (http://git-scm.com/)
    node (http://nodejs.org/en/download/)
    npm (comes with node, be sure to update with $ npm install -g npm)
 
## Dependencies installed during setup:
    bower ($ npm install -g bower)
    pm2 ($ npm install -g pm2)
    gulp ($ npm install -g gulp)
 
## Setting up the server (Redhat Enterprise Linux 6):
    $ git clone https://github.com/Harris-SpaceInt/HBX-Int
    $ cd node-project-server
    $ chmod +x install.sh
    $ ./install.sh
        > might need to run $ sudo ./install.sh depending on where npm was installed
    change the ip in public/dist/config/url.constant.js from 10.39.96.248 to the server's private ip
        > you can find the server's ip by running $ ifconfig
            > look for "eth" followed by a number (ex. "eth0" or "eth1")
            > on the next line, "inet addr" is the server's public ip
        > $ gedit public/dist/config/url.constant.js
        > change 10.39.96.248 to the server ip and save
    start the server by running $ gulp
 
## Setting up the server to redirect connections to the project website:
    install nginx (http://nginx.org/en/download.html)
    $ git clone https://github.com/amaczugowski/nginx-project-server
    $ cd nginx-project-server
    $ sudo cp nginx.conf /etc/nginx
    $ sudo cp sites-available /etc/nginx
    $ cd /etc/nginx
    $ sudo cp sites-available/default sites-enabled
    start nginx with $sudo nginx
    test the server by typing localhost in the browser
 
## Server commands (need to be in project directory):
    start the server: $ gulp
    stop the server: $ gulp stop
    restart the server (intended for development): $ gulp restart
