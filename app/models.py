from app import mongo

class Tian(mongo.Document):
    time = mongo.StringField()
    tianqi = mongo.StringField()
    high = mongo.StringField()
    low = mongo.StringField()

class User(mongo.Document):
    name = mongo.StringField()
    password = mongo.StringField()


class Article(mongo.Document):
    id = mongo.IntField(unique=True)
    ArtName = mongo.StringField()
    ArtSingleInfo = mongo.StringField(max_langth=100)
    ArtAllInfo = mongo.StringField()
    FirstDevide = mongo.StringField()
    SecondDevide = mongo.StringField()
    images = mongo.StringField()
    Source = mongo.FileField()
   # addtime = mongo.DatetimeField()
