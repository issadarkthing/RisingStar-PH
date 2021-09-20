# RisingStar-PH

## Setting up

1. unzip file
2. run `npm install` or `yarn install`
3. add `.env` file
4. run `npm run build`
5. run `npm run start`


## .env file content

```
BOT_TOKEN=<your bot token>
DB_URI=<your mongodb uri>
PREFIX=<your bot prefix>
VERFIED_ROLE_ID=<role given after user passed captcha test>
```

## Basic

By default the bot's command is `!`. To see all available commands, use `!help`
or `!h`.

## Customization

There is always an open room for customization. You can modify files in the
`src/structure` or `src/commands` directory.
