from mongoengine import *

class User(Document):
    name = StringField()
    password = StringField()

if __name__ == '__main__':
    connect('BBS', host='127.0.0.1', port=27017)
    u = User(name='yh960124',password='960124')
    u.save()