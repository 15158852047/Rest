# -*- coding: utf-8 -*-
import scrapy
from ..items import TianqiItem


class PredSpider(scrapy.Spider):
    name = 'Pred'
    allowed_domains = ['weather']
    start_urls = ['http://www.weather.com.cn/weather/101210101.shtml']

    def parse(self, response):
        lis = response.xpath('//div[@id="7d"]/ul[@class="t clearfix"]/li')
        for li in lis :
            item = TianqiItem()
            item['time'] = li.xpath('./h1/text()').extract()[0]
            item['tianqi'] = li.xpath('./p[@class="wea"]/text()').extract()[0]
            item['high'] = li.xpath('./p[@class="tem"]/span/text()').extract()[0]
            item['low'] = li.xpath('./p[@class="tem"]/i/text()').extract()[0]
            yield item