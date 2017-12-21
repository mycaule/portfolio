/* eslint import/no-unassigned-import: "off" */

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

const perf2d = echarts.init(document.getElementById('graphPerf2d'))

const draw = (times, spot, prices1, prices2) => {
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
        showSymbol: false,
        data: prices2.map(x => [x.time, x.price]),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        },
        lineStyle: {
          normal: {
            color: '#acb3c2'
          }
        }
      },
      {
        name: 'D-2',
        type: 'line',
        showSymbol: false,
        data: prices1.map(x => [x.time, x.price]),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        },
        lineStyle: {
          normal: {
            color: spot - prices1[0].price > 0 ? '#32b643' : '#e85600'
          }
        }
      }
    ]
  }

  perf2d.setOption(option)
}

export default {draw}
