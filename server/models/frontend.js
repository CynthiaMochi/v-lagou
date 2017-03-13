var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FrontendSchema = new Schema({
    companyId: String,
    positionName: String,
    workYear: String, 
    education: String,
    positionId: String,
    createTime: String,
    companyShortName: String,
    district: String,
    companySize: String,
    financeStage: String,
    industryField: String,
    firstType: String,
    secondType: String,
    businessZones: String,//商圈
    jobNature: String, //全职
    city: String,
    positionAdvantage: String,
    salary: String,
    contentUrl: String // 详情页
}, {
    timestamps: true
})

var Frontend = mongoose.model('Frontend', FrontendSchema);

module.exports = FrontendSchema;