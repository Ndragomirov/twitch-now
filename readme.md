# Twitch Companion

## Requirements

* [Node v16.14+](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start/)

## How to build

Before all, you need to install dependencies:
```
$ npm install
```

To build every versions of the extension :
```
$ npm run build:all
```

To build a version case of browser firefox, chrome or opera :
```
$ npm run build:<browser>
```

To package every versions of the extension :
```
$ npm run package:all
```

To package a version case of browser firefox, chrome or opera :
```
$ npm run package:<browser>
```

## Translation guide

This guide will help you to get prepared for translation. Let's start!

1.  Register your account first. 
2.  Visit the project page again and choose "Fork" option available in top-right corner. This will copy whole repository to your account.
3.  Hit plus icon to create new translation file in "_locales" directory. If your language directory does not exists yet, feel free to create one (https://developer.chrome.com/webstore/i18n#localeTable)
4.  When you're done, you can now commit and push your changes. The new files will appear on you Github account.
5.  You're almost done. The only thing left is to create a pull request so I can see that you want to apply your changes. To do it, press the "Pull request" button. Make sure, the target repository is correct and press "Send pull request"
