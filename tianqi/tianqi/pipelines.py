# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
from mongoengine import *

class Tian(Document):
    time = StringField()
    tianqi = StringField()
    high = StringField()
    low = StringField()


class TianqiPipeline(object):
    def __init__(self):
        connect('BBS',host='127.0.0.1',port=27017)
        de = Tian.objects().all()
        de.delete()

    def process_item(self, item, spider):
        s = item['low'][:-1]
        tian = Tian(time=item['time'],
                    tianqi=item['tianqi'],
                    high=item['high'],
                    low=s)
        tian.save()
        return item
