# MEAN Stack Skeleton - WIP

This skeleton project is bootstrapped with [ng-poly](https://github.com/dustinspecker/generator-ng-poly).

Right now it is a work in progress, but I plan on using it in several future projects, including my Raspberry Pi.  It is kind of messy to setup right now, but I have plans for that.

All of the client side Angular code is found in the `app` folder, while the server API resides in the `server` folder.

## Features
1. JWT for API authorization.
1. Entire API is locked down except for the login route.
1. SocketIO integration for 3-way binding.
1. User management, new users are currently only added via an existing admin user, registration is certainly possible.

## TODO
1. Change the way the database is seeded.
1. Actually implement the guest user role i.e. read-only mode.
1. Clean up Angular module names, and structure.
1. More I'm sure.

## Development
1. Run `npm install -g bower gulp yo generator-ng-poly`.
1. Run `bower install && npm install` to install this project's dependencies.
1. Rename the `env.sample.js` to `env.js` and edit the settings, mainly the `SESSION_SECRET`.

### Gulp tasks
- Run `gulp` to compile for dev and launch server
- Run `gulp build` to compile for dev
- Flags `--env=prod` to compile for production
-       `--env=prod --pretty` to compile for production without minification
-       `--nobrowser` to launch BrowserSync without opening a browser