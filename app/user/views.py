from . import user
import flask_restful as restful
from flask_restful import reqparse
from flask_restful import request as re
from flask import render_template,url_for,redirect,session,request,jsonify
from app.models import Tian,User
from app import api
from app import db
import time
import datetime
import os

oneart = {}
parser = reqparse.RequestParser()
parser.add_argument('mid')
def TimeStampToTime(timestamp):
        timeStruct = time.localtime(timestamp)
        return time.strftime('%Y-%m-%d %H:%M:%S',timeStruct)


@user.route('/',methods=['POST','GET'])
def index():
    if request.method == 'GET':
        t = Tian.objects().limit(3).all()
        for i in t :
            if '大雨' in i.tianqi :
                i.tianqi = '大雨'
            elif '雨' in i.tianqi :
                i.tianqi = '雨'
            elif '晴' in i.tianqi :
                i.tianqi = '晴'
            elif '风' in i.tianqi :
                i.tianqi = '风'
            elif '雪' in i.tianqi :
                i.tianqi = '雪'
            else:
                i.tianqi = '阴'
            i.time = i.time[-3:-1]
        message = db.db.BBS.find().sort('time').limit(10).skip(0)
        all = db.db.BBS.count()
        print(all)
        re = int(all // 8)+1
        print(re)
        return render_template('main.html',tianqi=t,messages=message,allcount=re)
    else :
        data = request.get_json()
        page = data['page']
        print(page)
        s = db.db.BBS.find().sort('time').limit(10).skip((int(page)-1)*10)
        message = {}
        x = 1
        for i in s :
            one = []
            one.append(i['name'])
            one.append(i['info'])
            one.append(i['time'])
            one.append(i['First'])
            one.append(i['Second'])
            one.append(url_for('static',filename='images/16.jpg'))
            one.append(i['id'])
            message[str(x)] = one
            x += 1
        return jsonify({'messages':message})

@user.route('/beforeadd/',methods=['POST','GET'])
def beforeadd():
    if request.method == 'GET':
        return render_template('before.html')
    else:
        data = request.get_json()
        oneart['First'] = data['1']
        oneart['Second'] = data['2']
        oneart['title'] = data['3']
        oneart['info'] = data['4']
        return jsonify({'isok':'yes'})

@user.route('/addmessage/',methods=['POST','GET'])
def addmessage():
    if request.method == 'GET':
        return render_template('message.html')
    else :
        s = ''
        data = request.get_json()
        isend = data['isend']
        if isend == 0 :
            s += data['text']
        else:
            s += data['text']
            one = {
                'id':str(int(time.time())),
                'name':oneart['title'],
                'info':oneart['info'],
                'First':oneart['First'],
                'Second':oneart['Second'],
                'main':s,
                'time':datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            }
            db.db.BBS.insert_one(one)
            return jsonify({'code':'true'})
    return jsonify({'code':'true'})

@user.route('/dook/<info>')
def dook(info):
    if '文章' in info :
        return render_template('dook.html',info=info,url=1)
    if '文件' in info :
        return render_template('dook.html',info=info,url=2)

@user.route('/upfile/',methods=['POST','GET'])
def upfile():
    if request.method == 'GET':
        return render_template('upfile.html')
    else:
        name = request.form.get('name')
        a = request.files['file']
        a.save(os.getcwd()+'/app/static/zip/%s' % name)
        return jsonify({'code':200})

@user.route('/lookfile/')
def lookfile():
    return render_template('lookfile.html')


@user.route('/files/')
def files():
    filename = os.listdir(os.getcwd()+'/app/static/zip')
    myfile = {}
    i = 0
    for file in filename:
        x = []
        filepath = os.getcwd()+'/app/static/zip/'+file
        x.append(file)
        si = os.path.getsize(filepath)
        fsize = round(si / float(1024 * 1024),2)
        x.append(fsize)
        t = os.path.getmtime(filepath)
        x.append(TimeStampToTime(t))
        myfile[str(i)] = x
        i += 1
    return render_template('files.html',file=myfile)


class Login(restful.Resource):
    def post(self):
        dict = re.form.to_dict()
        n = dict['name']
        p = dict['pass']
        user = User.objects(name=n,password=p).all()
        d = {}
        if user :
            session['name'] = n
            d['code'] = 200
        else:
            d['code'] = 404
        return d

class Readmsg(restful.Resource):
    def get(self,mid):
        one = db.db.BBS.find_one({'id':mid})
        return {'html':one['main'],'title':one['name'],'info':one['info'],
                'time':one['time'],'First':one['First'],'Second':one['Second']}


@user.context_processor
def session_context():
   name = session.get('name')
   if name :
       user = User.objects(name=name).first()
       if user:
           return {'user':user}
   return {}

api.add_resource(Login,'/login/',endpoint='user.login')
api.add_resource(Readmsg,'/readmsg/<mid>',endpoint='user.readmsg')