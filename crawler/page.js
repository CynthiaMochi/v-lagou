
var https = require('https'),
    queryString = require('querystring'),
    cheerio = require('cheerio'),
    superagent = require('superagent'),
    charset = require('superagent-charset'),
    async = require('async'),
    fs = require('fs');

var tags = {

}

var baseUrl = 'www.lagou.com';
var targetPage = [];
//(Ҫ��Ĺ����������ڳ��У��ڼ�ҳ�����ݿ���)
var getPageDetail = function (url, callback) {
    var fetchStart = new Date().getTime();
    superagent
        .post(baseUrl+url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function (err, res) {
            if (err) {
                callback(err, url + ' error happened')
            };
            if (res.status === 200) {
                var time = new Date().getTime() - fetchStart;
                console.log('ץȡ�ɹ�����ʱ' + time + '.����');
                var $ = cheerio.load(res.text);
                var jobDetail = $('.job_bt').text();

                 var delay = parseInt((Math.random() * 10000000) % 2000, 10);
                 setTimeout(function () {
                    callback(null, jobDetail);
                 }, delay)
            
            }
        })
}

exports.getPageDetail = getPageDetail;