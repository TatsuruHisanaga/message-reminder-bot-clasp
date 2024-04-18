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