import { Message } from './line';
import { columnHeader, getColumnIndexMap } from './spreadsheet';
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
    }
  }
}

/**
 * リマインドメッセージをスプレッドシートに登録する
 */
const add = (text: string, replyToken: string, userId: string): void => {
  // 登録 <日付(月/日)> <メッセージ>の形式であることを確認する
  const reg = /^登録 (\d{1,2}\/\d{1,2}) (.+)$/
  const validate = reg.test(text)
  if (!validate) {
    sendError(replyToken)
    return
  }
  const match = text.match(reg)
  // 日付を取得
  const dateStr = match?.[1] ?? ''
  const date = new Date(dateStr)
  // 有効な日付であることを確認する, 空文字もここで弾けるはず
  if (isNaN(date.getTime())) {
    sendError(replyToken)
    return
  }
  // スプレッドシートを開く
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = activeSpreadsheet.getSheetByName('シート１')
  if (!sheet){
    throw new Error('sheet not found')
  }

  // 列のインデックスを取得
  const columnIndexMap = getColumnIndexMap(sheet)
  // 新しい行を作成して書き込む
  const newRow: Row = Array.from({ length: columnHeader.length }, () => ''
  )
  newRow[columnIndexMap.date] = dateStr
  newRow[columnIndexMap.message] = match?.[2] ?? ''
  newRow[columnIndexMap.user_id] = userId
  sheet.appendRow(newRow)
  // 登録完了メッセージを送信する
  const messages = [
    {
      type: 'text',
      text: '登録しました',
    },
  ]
  sendReplyMessage(replyToken, messages)
}
