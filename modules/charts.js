/* eslint import/no-unassigned-import: "off" */

const moment = require('moment')
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')

const perf2d = echarts.init(document.getElementById('graphPerf2d'))

const draw = prices => {
  // #c23531, #2f4554, #61a0a8, #d48265, #91c7ae, #749f83,  #ca8622, #bda29a, #6e7074, #546570, #c4ccd3
  console.log(prices)
  const [last] = prices.slice(-1)
  const oneDayAgo = moment(last.time).startOf('day')
  const prices2 = prices.filter(x => moment(x.time).diff(oneDayAgo) < 0)

  console.log('prices', prices)
  console.log('prices2', prices2)

  const option = {
    xAxis: [
      {
        data: prices.map(x => x.time),
        show: false
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        show: false
      }
    ],
    series: [
      {
        name: 'D-1',
        type: 'line',
        data: prices2.map(x => x.price),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        },
        lineStyle: {
          normal: {
            color: '#749f83'
          }
        }
      },
      {
        name: 'D-2',
        type: 'line',
        data: prices.map(x => x.price),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        },
        lineStyle: {
          normal: {
            color: '#c4ccd3'
          }
        }
      }
    ]
  }

  perf2d.setOption(option)
}

module.exports = {draw}
