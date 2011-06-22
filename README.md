Intro
=====

This is a shell for a self-updating server written in NodeJS.

The intent here was to practice making a systemd system file.  This server does not actually do any updating, but it has all the functionality to do so.

Install
=======

Install node to `/usr/local/bin` (the default)

* Copy `server.service` to `/etc/systemd/system`
* Run `systemctl enable server.service`
* Copy `client.js` to `/usr/local/bin/updating-server`

How to test
===========

Once the service is started (either through systemctl or on reboot), visit `http://localhost:2000` in a browser (or curl it). If you see something, the server is running.

Once the server is running, start server.js.  Once it starts, you should see some output (`Request update`). This means that the daemon requested an update. There should be a file called `update.tar` in `/usr/local/bin/updating-server`.
