<template>
  <v-container>
    <div
      ref="chart"
      style="height: 400px; width: 100%;"
    />
    <v-list
      v-show="showTweets"
      style="height=400px;"
    >
      <v-subheader>
        Tweets - {{ dates[lastDate].toLocaleDateString() }}
      </v-subheader>
      <v-list-tile
        v-for="(tweet, i) in tweets"
        :key="i"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            <sentiment-text :text="tweet.content" />
          </v-list-tile-title>
        </v-list-tile-content>
        <!--
        <v-list-tile-action>
          <v-list-tile-sub-title> {{ tweet.author }} </v-list-tile-sub-title>
        </v-list-tile-action>
        -->
      </v-list-tile>
    </v-list>
  </v-container>
</template>

<script>
import SentimentText from './SentimentText'
import _ from 'lodash'
export default {
  components: { SentimentText },
  props: {
    value: { type: Object, default: () => null },
    showTweets: {type: Boolean, default: true },
    nTweet: { type: Number, default: () => 4 }
  },
  data() {
    return {
      chart: null,
      tweets: null,
      lastDate: 0,
      dates: [{ toLocaleDateString: () => "" }],
      chartOptions: {
        animationEnabled: true,
        theme: 'light1',
        exportEnabled: true,
        title: { text: '' },
        subtitles: [{ text: '' }],
        axisX: {
          interval: 1,
          labelAngle: -45
        },
        axisY: { includeZero: false, prefix: "$", title: "Price" },
        backgroundColor: 'transparent',
        toolTip: {
          shared: true,
          contentFormatter: e => {
            let {x, y} = e.entries[0].dataPoint
            let date = `Date: ${this.dates[x].toLocaleDateString()}<br />`
            let target
            if (e.entries[1]) {
              target = e.entries[1].dataPoint.y.toFixed(3)
            } else if (e.entries[2]) {
              target = e.entries[2].dataPoint.y.toFixed(3)
            } else {
              target = 'NaN'
            }
            target = `<strong>Target: <strong>${target}</strong><br />`
            let ohlc = `Price:</strong><br />Open: ${y[0]}, Close: ${y[3]}<br />High: ${y[1]}, Low: ${y[2]}`
            this.updateTweet(x)
            return `${date}${target}${ohlc}`
          }
        },
        data: [
          {
            name: 'Stock',
            type: 'candlestick',
            risingColor: "green",
            fallingColor: "red",
            dataPoints: null
          },
          {
            name: 'Target',
            type: 'line',
            lineColor: 'darkRed',
            connectNullData: false,
            dataPoints: null
          },
          {
            name: 'DashedLine',
            type: 'line',
            lineDashType: "dash",
            lineColor: 'darkRed',
            markerType: "none",
            connectNullData: false,
            dataPoints: null
          }
        ]
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.reset()
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const nextPoint = points => {
        points = points.slice(1)
        for (let i in points) {
          if (points[i].y !== null) return { dist: Number(i) + 1, y: points[i].y}
        }
        return null
      }
      this.lastDate = 0
      if (this.showTweets)
        this.tweets = Array.from(Array(this.nTweet).keys()).map(_ => ({ content: '', author: '' }))
      this.dates = this.value.dates
      this.chartOptions.data[0].dataPoints = this.value.stock

      let targets = this.value.targets.map(p => ({...p, y: p.y || null}))
      this.chartOptions.data[1].dataPoints = targets

      let dashLines = targets.map(t => ({...t, y: null}))
      for (let i in dashLines) {
        i = Number(i)
        if (targets[i+1] && targets[i+1].y === null && targets[i].y !== null) {
          let yp = targets[i].y
          if (nextPoint(targets.slice(i))) {
            let { dist, y } = nextPoint(targets.slice(i))
            dashLines.slice(i, i + dist + 1).forEach((point, index) => {
              point.y = yp + (y - yp) / dist * index
            })
          } else {
            dashLines.slice(i).forEach(point => { point.y = yp })
          }
        }
      }
      this.chartOptions.data[2].dataPoints = dashLines
      this.chartOptions.title.text = this.value.name
      this.chart = new CanvasJS.Chart(this.$refs.chart, this.chartOptions)
      let {r, f, c} = {r: 'risingColor', 'f': 'fallingColor', 'c': 'color'}
      for(let data of this.chart.options.data)
        for(let point of data.dataPoints)
          if (point.y)
            point.color = (point.y[0] <= point.y[3] ? data[r] : data[f]) || data[c]
      this.chart.render()
    },
    updateTweet(d) {
      if (!this.showTweets) return
      if (this.lastDate !== d) {
        this.lastDate = d
        this.tweets = _.sampleSize(this.value.tweets[this.dates[d]], this.nTweet)
      }
    }
  }
}
</script>
