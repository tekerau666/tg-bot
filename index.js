const telegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("/options")
const token = '6009340335:AAH3mO4FOtng1CFgRJlWhCOh9L1t98otqCY'

const bot = new telegramApi(token,{polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты ее должен угадать.')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай число'}
    ])

    bot.on('message', async msg=> {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start'){
            // bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/17.jpg')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бота`)
        }
        if (text === '/game'){
            return startGame(chatId)
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, че хуйню несешь')
    })
    bot.on('callback_query', async msg=> {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId,`Поздравляю, ты угадал не нужную хуйню ${chats[chatId]}`, againOptions)
        }
        else
        {
            return await bot.sendMessage(chatId,`Поздравляю, ты не угадал не нужную хуйню, цифра была ${chats[chatId]}`, againOptions)
        }
    })
}

start()