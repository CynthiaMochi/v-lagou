var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var CityJobSchema = new Schema({
    companyId: String,
    positionName: String,
    workYear: String,
    education: String,
    positionId: String,
    createTime: Date,
    companyShortName: String,
    district: String,
    companySize: String,
    financeStage: String,
    industryField: String,
    firstType: String,
    secondType: String,
    businessZones: Array,//商圈
    jobNature: String, //全职
    city: String,
    positionAdvantage: String,
    salaryMin: Number,
    salaryMax: Number,
    salary: String
});

CityJobSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
}) 

CityJobSchema.statics = {
    fetchAll: function(cb) {
        return this
            .find()
            .exec(cb)
    },
    fetchTar: function(name, cb) {
        var reg = new RegExp(name);
        return this.find({'positionName':reg})
                .exec(cb)
    }
}

module.exports = CityJobSchema;