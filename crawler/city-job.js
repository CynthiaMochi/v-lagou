//使用request模块版本
//获取前端导航页数据
//具体页面需要positionId + .html
//json格式参考https://www.lagou.com/jobs/positionAjax.json?city=%E5%8C%97%E4%BA%AC&needAddtionalResult=false&first=false&pn=1&kd=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91
var request= require('request'),
    async = require('async'),//控制并发流程
    eventproxy = require('eventproxy');//控制并发流程
var mongo = require('./mongo');
var getPageDetail = require('./page').getPageDetail;
var eq = new eventproxy(); 
var targetPage = [];
var keyWord = process.argv[2] || '前端';//搜索关键词
var urlKey = process.argv[3] || 'frontend'

//(要查的工作名，所在城市，第几页，数据库名)
var getCityJobData = function (kd, city, pn, colName) {

    var postData = {
        'pn': pn,
        'kd': kd,
        'first': false
    }

    var options = {
        headers: {
            "X-Requested-With": 'XMLHttpRequest',
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
            "Origin": 'https://www.lagou.com',
            "Cookie": 'user_trace_token=20170211115515-2db01e4efbb24178989f2b6139d3698e; LGUID=20170211115515-e593a6c4-f00d-11e6-8f71-5254005c3644; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=0; index_location_city=%E5%85%A8%E5%9B%BD; login=false; unick=""; _putrc=""; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1486785316; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1486789519; _ga=GA1.2.1374329991.1486785316; LGRID=20170211130519-af0ec03c-f017-11e6-a32c-525400f775ce; TG-TRACK-CODE=search_code; JSESSIONID=A5AC6E7C54130E13C1519ABA7F70BC3C; SEARCH_ID=053c985ab53e463eb5f747658872ef29',
            "Connection": 'keep-alive'
        },  
        url: 'https://www.lagou.com/jobs/positionAjax.json?px=default&city='+ city,
        method: 'POST',
        json:true,
        form: postData
    };

    function callback(error, response, data) {

        if (!error && response.statusCode == 200) {
            console.log('----info------');
            var totalCount =data.content.positionResult.totalCount,
                pageSize = data.content.pageSize;
                
            data.content.positionResult.result.forEach((item) => {
                var result = processData(item);
                targetPage.push('/jobs/'+item.positionId+'.html');
                console.log(result);
                mongo.save(colName, result);
            });
            console.log('总页数****'+totalCount);

            if(pn <= totalCount/pageSize && data.content.pageNo != 0){
                 var delay = parseInt((Math.random() * 10000000) % 2000, 10);
                 setTimeout(function () {
                    getCityJobData(kd, city, pn+1, colName);
                 }, delay)
            } else {
                console.log('get data successfully')
                eq.emit('finish_city_data', "get" + city +"successfully")
            }
        console.log ("页数" +data.content.pageNo)
        }
    }

    request(options, callback);

}
 
function processData(data) {
    var result = {};
    if (data) {
        var salary = data.salary;
        var arr = salary.split('-');
        var min = arr[0].substring(0,arr[0].indexOf('k'));
        var max = arr.length>1? arr[1].substring(0,arr[1].indexOf('k')):min;    
        result = {
            companyId: data.companyId,
            positionName: data.positionName,
            workYear: data.workYear,
            education: data.education,
            positionId: data.positionId,
            createTime: data.createTime,
            companyShortName: data.companyShortName,
            district: data.district,
            companySize: data.companySize,
            financeStage: data.financeStage,
            industryField: data.industryField,
            firstType: data.firstType,
            secondType: data.secondType,
            businessZones: data.businessZones,//商圈
            jobNature: data.jobNature, //全职
            city: data.city,
            positionAdvantage: data.positionAdvantage,
            salary: data.salary
        }
        result.salaryMin = parseInt(min);
        result.salaryMax = parseInt(max);    
    }
    return result;
}

getCityJobData(keyWord, "北京", 133, 'frontends')

eq.after('finish_city_data', 1, function () {
    var htmlUrl = {};
        htmlUrl[urlKey] = targetPage;

    mongo.save('bjurls', htmlUrl)
    async.mapLimit(targetPage, 5, function(url, callback) {
        getPageDetail(url, callback);
    }, function (err, result) {
        console.log('抓包结束,一共抓取了' + targetPage.length + '条数据')zz
    })
})



exports.getCityJobData = getCityJobData;