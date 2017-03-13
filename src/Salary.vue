<template>
    <div>
        <div id="salaryBar"></div>
    </div>
</template>
<script>
// 需要先处理数据
// 需要知道是一种经验的，所以可能是workyear的子元素
import echarts from 'echarts'
import './macarons.js'; 
import data from './sort.json'

export default {
    props: ["year"],
    data() {
        return {
            chart: null,
            workYear: this.year
        }
    },
    methods: {
        drawbar(id) {
            let vm = this;
            this.chart = echarts.init(document.getElementById(id), 'macarons');
            this.chart.setOption({
                title : {
                    text: vm.workYear,
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature : {
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    },
                  right: 15,
                  top: 10,
                },
                lengend: {
                  left: 5,
                  top: 10,
                  data: ['最高薪资数', '最低薪资数']
                },
                xAxis: [
                  {
                    type: 'category',
                    data: data.salary.xAxis
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '需求数',
                  }
                ],
                series: [
                {
                  name: '最高薪资数',
                  type: 'bar',
                  markPoint: {
                    data: [
                      {type: 'max', name: '最大数'},
                      {type: 'min', name: '最小数'}
                    ]
                  },
                  markLine: {
                    data: [
                      {type: 'average', name: '平均值'}
                    ]
                  },
                  data: data.salary.max[vm.workYear],
            }, {
                  name: '最低薪资数',
                  type: 'bar',
                  markPoint: {
                    data: [
                      {type: 'max', name: '最大数'},
                      {type: 'min', name: '最小数'}
                    ]
                  },
                  markLine: {
                    data: [
                      {type: 'average', name: '平均值'}
                    ]
                  },
                  data: data.salary.min[vm.workYear],
            }]  
        })
        }
    },
    watch: {
      'year' : function(val, oldVal) {
        var vm = this;
        vm.workYear = val;
        vm.$nextTick(function() {
            vm.drawbar('salaryBar')
        })
      }
    },

    mounted() {
        // 为什么用nextTick
        var vm = this;
        vm.$nextTick(function () {
            vm.drawbar('salaryBar')
        })
    }
}
</script>

<style scoped>
  #salaryBar {
    position: relative;
    width: 600px;
    height: 600px;
  }
</style>