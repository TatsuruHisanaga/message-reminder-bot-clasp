import { Message } from './line';
export const main = () => {
  console.log('🐛 debug : テスト')
}


/**
 * WebhookからのPOSTリクエストを処理する
 * @param e
 */
export const doPost = (e: any) => {
  const EVENTS = JSON.parse(e.postData.contents).events
  for (const event of EVENTS) {
    execute(event)
  }
}

/**
 * イベントを処理する
 * @param event
 */
const execute = (event: any) => {
  const EVENT_TYPE = event.type
  const REPLY_TOKEN = event.replyToken
  const USER_ID = event.source.userId

  if(EVENT_TYPE === 'message') {
    if(event.message.type === 'text') {
      const text = event.message.text
      // 「登録」で始まるメッセージの場合、リマインドメッセージを登録する
      const matchResult = text.match(/^登録/)
      if (matchResult && matchResult.input === text) {
        add(text, REPLY_TOKEN, USER_ID)
      } else {
        sendError(REPLY_TOKEN)
      }
      ]
    }
  }
}