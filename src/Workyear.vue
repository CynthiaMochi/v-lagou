<template>
    <div>
        <div class="left">
            <div id="workyearPie"></div>
        </div>
        <div class="right">
            <salary :year="workyear"></salary>           
        </div>
    </div>
</template>
<script>
// 需要先处理数据
import echarts from 'echarts'
import Salary from './Salary.vue'
import './macarons.js'  
import data from './sort.json'

export default {
    data() {
        return {
            chart: null,
            workyear: "5-10年"
        }
    },
    components: {Salary},
    methods: {
        drawpie(id, small, big, center ) {
            var vm = this;
            this.chart = echarts.init(document.getElementById(id), 'macarons');
            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    feature : {
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    },
                    right: 15,
                    top: 10
                },
                legend: {
                    orient: 'vertical',
                    left: 5,
                    top: 10,
                    data: data.workyear.key
                },
                series: [
                {
                  name: '招聘数',
                  type: 'pie',
                  radius: [small, big],
                  center: ['55%', center],
                  roseType: 'radius',
                  data: data.workyear.data,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffset: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]  
        })
        }
    },

    mounted() {
        var vm = this;
        // 为什么用nextTick
        vm.$nextTick(function () {
            vm.drawpie('workyearPie', 30, 100, '50%')
            vm.chart.on('click', function(params) {            
                vm.workyear = params.name
            })
        })
    }
}
</script>

<style scoped>
.left {
    float: left;
}
.right {
    margin-left: 600px;
}
#workyearPie {
    position: relative;
    width: 600px;
    height: 600px;
}
</style>