require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  // {
  //   command: "hello",
  //   description: "Получить приветствие",
  // },
  // {
  //   command: "sayhello",
  //   description: "Получить приветствие",
  // },
  // {
  //   command: "mood",
  //   description: "Оценить настроение",
  // },
  // {
  //   command: "share",
  //   description: "Поделиться данными",
  // },
  // {
  //   command: "inline_keyboard",
  //   description: "Инлайн клавиатура",
  // },
  {
    command: "menu",
    description: "Получить меню",
  },
]);

bot.command("start", async (ctx) => {
  await ctx.react("👍", "🔥");
  await ctx.reply(
    'Привет! я бот. Тг канал: <span class="tg-spoiler" href="https://t.me/pomazkovjs">Ссылка</span >',
    {
      parse_mode: "HTML",
    }
  );
});

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Обратится в поддержку", "support");
const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберети пункт меню", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: В пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберети пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

// bot.command("start", async (ctx) => {
//   await ctx.reply(
//     "Привет я бот Тг канал: [Это ссылка] (https://t.me/pomazkovjs)",
//     {
//       parse_mode: "MarkdownV2",
//       disable_web_page_preview: true,
//     }
//   );
// });

// bot.command("mood", async (ctx) => {
//   const moodKeyboard = new Keyboard()
//     .text("Хорошо")
//     .row()
//     .text("Норм")
//     .row()
//     .text("Плохо")
//     .resized();
//   // .oneTime();
//   await ctx.reply("Как настроение?", {
//     reply_markup: moodKeyboard,
//   });
// });
// bot.command("share", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Геолокация")
//     .requestContact("Контакт")
//     .requestPoll("Опрос")
//     .placeholder("Укажи данные")
//     .resized()
//     .oneTime();
//   await ctx.reply("Чем хочешь поделиться?", {
//     reply_markup: shareKeyboard,
//   });
// });
// bot.command("inline_keyboard", async (ctx) => {
// const inlineKeyboard = new InlineKeyboard()
//   .text("1", "button-1")
//   .row()
//   .text("2", "button-2")
//   .text("3", "button-3")
//   .row()
//   .text("4", "button-4");
// await ctx.reply("Выберите цифру", {
//   reply_markup: inlineKeyboard,
//   const inlineKeyboard2 = new InlineKeyboard().url(
//     "Перейти в тг канал",
//     "https://t.me/pomazkovjs"
//   );
//   await ctx.reply("Нажмите кнопку", {
//     reply_markup: inlineKeyboard2,
//   });
// });

// bot.callbackQuery(["button-1", "button-2", "button-3"], async (ctx) => {
//   //   await ctx.answerCallbackQuery("Вы выбрали цифру!");
//   await ctx.reply("Вы выбрали цифру");
// });

// const inlineKeyboard2 = new InlineKeyboard().url(
//   "Перейти в тг канал",
//   "https://t.me/pomazkovjs"
// );
// await ctx.reply("Нажмите кнопку", {
//   reply_markup: inlineKeyboard2,
// });

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery("Вы выбрали цифру!");
//   await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`);
// });

// bot.on(":contact", async (ctx) => {
//   await ctx.reply("Спасибо за контакт");
// });

// bot.hears("Хорошо", async (ctx) => {
//   await ctx.reply("Класс!!!", {
//     reply_markup: { remove_keyboard: true },
//   });
// });

// bot.command(["sayhello", "hello", "say_hi"], async (ctx) => {
//   await ctx.reply("hello.");
// });

// bot.hears(/пипец/, async (ctx) => {
//   await ctx.reply("Ругаемся?");
// });
// bot.hears("ID", async (ctx) => {
//   await ctx.reply(`Ваш ID ${ctx.from.id}`);
// });

// bot.on("message", async (ctx) => {
//   await ctx.reply("надо подумать...");
//   console.log(ctx.from);
// });

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handing ubdate ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram", e);
  } else {
    console.error("Unknown error", e);
  }
});

bot.start();
