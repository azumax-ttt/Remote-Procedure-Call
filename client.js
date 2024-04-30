const net = require('net')
const readline = require('readline')

const methodTypes = [
  'floor',
  'nroot',
  'reverse',
  'validAnagram',
  'sort'
]

const request = {
  method: '',
  params: [],
  id: 0
}

const client = new net.Socket()
const serverAddress = '/tmp/socket_file'

// サーバーへの接続処理
const connectToServer = () => {
  console.log('接続中...')
  client.connect(serverAddress, () => {
    console.log('接続成功')
    getMethod()
  })

  client.on('error', error => {
    console.error(`接続に失敗しました: ${error}`)
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// ユーザーからの入力処理
const getMethod = () => {
  console.log('利用するメソッドを選択してください:')
  methodTypes.forEach((method, i) => {
    console.log(`${i}: ${method}`)
  })

  rl.question('', i => {
    const method = methodTypes[parseInt(i)]
    if (method) {
      request.method = method
      request.id = Math.floor(Math.random() * 10000)
      // 本当はメソッドによって
      rl.question('処理するデータを入力してください: ', params => {
        request.params = params
        sendRequest(request)
      })
    } else {
      console.log('無効な選択です。もう一度入力してください。')
      getMethod()
    }
  })
}
const sendRequest = (request) => {
  const query = JSON.stringify(request)
  client.write(query, 'utf8', () => {
    console.log('リクエストが送信されました')
    console.log(query)

  })

  client.on('data', data => {
    const response = JSON.parse(data.toString())
    if (response.error) {
      console.error(`エラー: ${response.error}`)
    } else {
      console.log('---処理結果---')
      console.log(response.result)
      console.log('-------------')
    }
    rl.close()
    client.end()
  })

  client.on('error', (error) => {
    console.error(`通信エラー: ${error.message}`)
  })

  client.on('close', () => {
    console.log('サーバーとの接続を終了します')
  })
}

const main = () => {
  connectToServer()
}

main()
