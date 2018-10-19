from flask import Flask, render_template, request, send_from_directory, make_response, jsonify
from flask_socketio import SocketIO
import os, sys

#initialize library variables
app = Flask(__name__, static_folder='templates')
#app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)


@app.route('/', defaults={'path':'/'})
@app.route('/<path:path>', methods=['GET', 'POST'])
def router(path):
    print("entered router for " + str(path), file=sys.stdout)
    if 'api' in path:
        pass
    
    #return homepage
    elif path is '/':
        return send_from_directory('client/build', 'index.html')

    #retrieve static files
    elif path and os.path.exists('client/build/' + path):
        print('returned ' + str(path), file=sys.stdout)
        return send_from_directory('client/build/', path)
    
    

#socketIO code
def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')


@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)


#entry point
if __name__ == '__main__':
    app.run()
    socketio.run(app)