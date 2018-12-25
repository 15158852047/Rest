from flask import Flask
import flask_restful as restful
from flask_mongoengine import MongoEngine
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['SECRET_KEY'] = 'thisismyfirstbbs'
app.config['MONGODB_SETTINGS'] = {
    'db': 'BBS',
    'host': '127.0.0.1',
    'port': 27017,
}
app.config.update(
    MONGO_URI='mongodb://localhost:27017/BBS',
)


api = restful.Api(app)
mongo = MongoEngine()
mongo.init_app(app)
db = PyMongo(app)


from .admin import admin
from .user import user
app.register_blueprint(admin,url_prefix='/admin')
app.register_blueprint(user)