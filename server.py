import socket
import os
import json
import math

def floor(x):
    return math.floor(x)

def nroot(n, x):
    return math.pow(x, 1 / n)

def reverse(s):
    return s[::-1]

def validAnagram(str1, str2):
    return sorted(str1) == sorted(str2)

def sort(strArr):
    return sorted(strArr)

# RPCメソッドを実行して結果を返す
def execute_rpc_method(request):
    method = request['method']
    params = request['params']
    if method == 'floor':
        return floor(float(params[0]))
    elif method == 'nroot':
        return nroot(int(params[0]), int(params[1]))
    elif method == 'reverse':
        return reverse(params[0])
    elif method == 'validAnagram':
        return validAnagram(params[0], params[1])
    elif method == 'sort':
        return sort(params)
    else:
        return "Unknown method"

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server_address = '/tmp/socket_file'

try:
    os.unlink(server_address)
except FileNotFoundError:
    pass

print(f'サーバー起動中... {server_address}')
sock.bind(server_address)
sock.listen(1)

while True:
    print('クライアントの接続を待っています...')
    connection, client_address = sock.accept()
    try:
        print(f'クライアントと接続中... {client_address}')

        data = connection.recv(16)
        if data:
            data_str = data.decode('utf-8')
            print('受信データ: ' + data_str)
            request = json.loads(data_str)
            result = execute_rpc_method(request)
            response = json.dumps({"result": result, "id": request['id']})
            connection.sendall(response.encode('utf-8'))
        else:
            print('データ未受信: ', client_address)
            break

    finally:
        print('接続を終了します')
        connection.close()
