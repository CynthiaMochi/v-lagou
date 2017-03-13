// 需要薪资
// 查找所有全职
// 全职统计 分别workyear有多少
// 再根据workyear看薪资
var dbUrl = 'mongodb://localhost/lagou';
var mongoose = require('mongoose');
var fs = require('fs');
var CityJobSchema = require('../schemas/cityjob');
var Frontend = mongoose.model('frontend', CityJobSchema);

mongoose.Promise = global.Promise

mongoose.connect(dbUrl);


var workYearKeys = ["5-10年","3-5年","1-3年","不限","应届毕业生","1年以下","10年以上"]
var salaryRange = ['1-5', '6-10', '11-15','16-20', '21-30', '31-50', '51-80'],
    salaryRangeKey = [1, 6, 11, 16, 21, 31, 51,81]

var workYearData = {}
workYearData.key = workYearKeys;
workYearData.data = []

function fullJob() {
    // 全职的那个圆
    // 无经验有多少招聘信息
    var promises = workYearKeys.map(year => {
        return Frontend.find({jobNature: '全职'})
                    .count({workYear: year})
                    .then(result => {
                        return workYearData.data.push({value: result, name: year})
                    })
                    .catch(err => {
                        console.log(err)
                    })
    })
    return Promise.all(promises)
            .then((data) => {
                fs.appendFile( './data.json', JSON.stringify(workYearData), 'utf8' );
            })
}

function salary(cb, key) {
    // 例： 查找无经验的最低薪资的范围和对应数量
    var promises = workYearKeys.map(year => {
        
        return Frontend.find({jobNature: '全职', workYear: year})
                    .then(result => {
                        var obj = {},
                            data = cb(result);
                        obj.key = year + ' ' + key;
                        obj.value = data;
                        obj.sort = divideData(data, year, key)
                        obj.sortValue =Object.keys(obj.sort).map(item => {
                                return obj.sort[item]
                            })
                        obj.average = averageMoney(data, result.length)
                        return obj
                    })
    })
    return Promise.all(promises)
            .then((result) => {
                return fs.appendFile( './data.json', JSON.stringify(result), 'utf8' );
            })
}

function countKey(key) {
    // 计算一组数中某一个属性，具有的类型和对应的数量
    // 比如3-5年工作有100人
    return function(data) {
        var cache = {},
            value;
        
        if (data &&　data.length > 0) {
            data.forEach(function(item) {
                value = item[key];
                if (cache[value]) {
                    cache[value]++
                } else {
                    cache[value] = 1;
                }
            })
        }
        return cache;
    }
}

// 看钱的范围
// 全职->3-5年->最高和最低薪资
// 需要知道最大和最小值


// 划分区间，需要所有min和max的key值的共同最大和最小值
// 传入对象
function divideData (dataObj, year, key) {
    //console.log(dataObj)
    // 在将数据统计划分的时候还是有些问题
    var obj = {},
        objValue = [];
    for (var i = 0; i < salaryRangeKey.length-1; i++) {
        var rangeKey = salaryRangeKey[i] + '-' + (salaryRangeKey[i+1]-1)
        Object.keys(dataObj).forEach(item => {
            var value = dataObj[item]
            if (item < salaryRangeKey[i+1] && item >= salaryRangeKey[i]) {
                obj[rangeKey] = obj[rangeKey] ? (obj[rangeKey] + value) : value;
            }
        })
    }
    return obj;
}

function divide(key) {
    // 查找全职中按照最高薪资排序后，最高的是多少，最低的是多少，好划分区间
    return Frontend.find({jobNature: '全职'})
            .sort({[key]: -1})
            .then(result => {
                var obj = {}
                obj.name = key;
                obj.max = result[0];
                obj.min = result[result.length-1];

                return fs.appendFile( './data.json', JSON.stringify(obj), 'utf8' );                
            })
            .catch(err => {
                console.log(err)
            })
}

function averageMoney(data, length) {
    var sum = 0;
    Object.keys(data).forEach(item => {
        sum += item * data[item]
    })
    return Math.round(sum / length)
}

var countYear = countKey('workYear')
var countSalaryMin = countKey('salaryMin')
var countSalaryMax = countKey('salaryMax')
// fullJob(countYear)        
salary(countSalaryMin, 'min')
salary(countSalaryMax, 'max')
// divide('salaryMax')
// divide('salaryMin')