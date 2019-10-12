from flask import Flask, request, jsonify
from flask_cors import CORS

items = [{"test": "master"}, {"test":"Awesome"}, {"test":"terroible"},{"test":"supercoole"}]

app = Flask(__name__)
CORS(app)
 
@app.route('/hello-world', methods=['GET'])
def hello_world():
    return jsonify(items)

@app.route('/', methods=['GET'])
def api_list():
    return jsonify(items)
 
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
