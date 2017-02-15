# Twitch Now

* Chrome version: https://chrome.google.com/webstore/detail/twitch-now/nlmbdmpjmlijibeockamioakdpmhjnpk
* Firefox version: https://addons.mozilla.org/firefox/addon/twitch-now/
* Opera version: https://addons.opera.com/extensions/details/twitch-now/

## Requirements

* Node.js
* Gulp

## How to build

Before all, you need to install dependencies:
```
$ npm install
```

To build Chrome version:
```
$ gulp chrome
```

To build Firefox version:
```
$ gulp firefox
```

To run Firefox version:
```
$ run firefox, goto about:debugging, then load build/firefox/manifest.json
```

To build Opera version:
```
$ gulp opera
```

## Translation guide

This guide will help you to get prepared for translation. Let's start!

1.  Register your account first. 
2.  Visit the project page again and choose "Fork" option available in top-right corner. This will copy whole repository to your account.
3.  Hit plus icon to create new translation file in "_locales" directory. If your language directory does not exists yet, feel free to create one (https://developer.chrome.com/webstore/i18n#localeTable)
4.  When you're done, you can now commit and push your changes. The new files will appear on you Github account.
5.  You're almost done. The only thing left is to create a pull request so I can see that you want to apply your changes. To do it, press the "Pull request" button. Make sure, the target repository is correct and press "Send pull request"
