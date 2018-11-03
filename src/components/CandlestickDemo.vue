<template>
  <v-content>
    <div
      ref="chart"
      style="height: 400px; width: 100%;"
    />
    <v-list style="height=400px;">
      <v-subheader>
        Tweets - {{ lastDate.toLocaleDateString() }}
      </v-subheader>
      <v-list-tile
        v-for="(tweet, i) in tweets"
        :key="i"
      >
        <v-list-tile-content>
          <v-list-tile-title> {{ tweet.content }} </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-sub-title> {{ tweet.author }} </v-list-tile-sub-title>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-content>
</template>

<script>
export default {
  props: {
    value: { type: Object, default: () => null },
    nTweet: { type: Number, default: () => 4 }
  },
  data() {
    return {
      chart: null,
      tweets: null,
      lastDate: { toLocaleDateString: () => '' },
      chartOptions: {
        animationEnabled: true,
        theme: 'light1',
        exportEnabled: true,
        title: { text: '' },
        subtitles: [{ text: '' }],
        axisX: {
          interval: 1,
          intervalType: "day",
          valueFormatString: "MMM-DD",
          labelAngle: -45
        },
        axisY: { includeZero: false, prefix: "$", title: "Price" },
        backgroundColor: 'transparent',
        toolTip: {
          shared: true,
          contentFormatter: e => {
            let {x, y} = e.entries[0].dataPoint
            let t = e.entries[1].dataPoint.y
            this.updateTweet(x)
            return `Date: ${x.toLocaleDateString()}<br /><strong>Target: <strong>${t}</strong><br />Price:</strong><br />Open: ${y[0]}, Close: ${y[3]}<br />High: ${y[1]}, Low: ${y[2]}`
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
      this.lastDate = { toLocaleDateString() { return "" } }
      this.tweets = Array.from(Array(this.nTweet).keys()).map(_ => ({ content: '', author: '' }))

      this.chartOptions.data[0].dataPoints = this.value.stock
      this.chartOptions.data[1].dataPoints = this.value.targets
      this.chartOptions.subtitles[0].text = this.value.name

      this.chart = new CanvasJS.Chart(this.$refs.chart, this.chartOptions)

      let {r, f, c} = {r: 'risingColor', 'f': 'fallingColor', 'c': 'color'}
      for(let data of this.chart.options.data)
        for(let point of data.dataPoints)
          point.color = (point.y[0] <= point.y[3] ? data[r] : data[f]) || data[c]
      this.chart.render()
    },
    updateTweet(d) {
      if (this.lastDate !== d) {
        this.lastDate = d
        this.tweets = this.value.tweets[d].slice(0, this.nTweet)
      }
    }
  }
}
</script>
