/* eslint import/no-unassigned-import: "off" */

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

const perf2d = echarts.init(document.getElementById('graphPerf2d'))

const draw = (times, prices1, prices2) => {
  const option = {
    xAxis: [
      {
        data: times,
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
        data: prices2.map(x => [x.time, x.price]),
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
      },
      {
        name: 'D-2',
        type: 'line',
        data: prices1.map(x => [x.time, x.price]),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        },
        lineStyle: {
          normal: {
            color: prices1[prices1.length - 1].price - prices1[0].price > 0 ? '#749f83' : '#c23531'
          }
        }
      }
    ]
  }

  perf2d.setOption(option)
}

export default {draw}
