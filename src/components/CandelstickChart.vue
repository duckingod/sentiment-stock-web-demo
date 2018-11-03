<template>
  <v-content>
    <div
      ref="chart"
      style="height: 300px; width: 100%;"
    />
    <v-list>
      <v-subheader v-if="lastDate !== null">
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
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      chart: null,
      dataset: null,
      tweets: [],
      lastDate: null,
      chartOptions: {
        animationEnabled: true,
        // theme: "light1", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        title: { text: "Netflix Stock Price in 2016" },
        subtitles: [{ text: "Weekly Averages" }],
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
            return `Date: ${x}<br /><strong>Target: <strong>${t}</strong><br />Price:</strong><br />Open: ${y[0]}, Close: ${y[3]}<br />High: ${y[1]}, Low: ${y[2]}`
          }
        },
        data: [
          {
            name: 'Stock',
            type: 'candlestick',
            yValueFormatString: "$##0.00",
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
      this.tweets = []

      let v = this.value
      this.dataset = { dates: v.dates, stock: v.stockData, target: v.targetData, tweets: v.tweetData }
      this.chartOptions.data[0].dataPoints = this.dataset.stock
      this.chartOptions.data[1].dataPoints = this.dataset.target

      this.chart = new CanvasJS.Chart(this.$refs.chart, this.chartOptions)

      let dataSeries;
      for(let i = 0; i < this.chart.options.data.length; i++){
        dataSeries = this.chart.options.data[i];
        for(let j = 0; j < dataSeries.dataPoints.length; j++){
          dataSeries.dataPoints[j].color = (dataSeries.dataPoints[j].y[0] <= dataSeries.dataPoints[j].y[3]) ? (dataSeries.risingColor ? dataSeries.risingColor : dataSeries.color) : (dataSeries.fallingColor ? dataSeries.fallingColor : dataSeries.color);
        }
      }
      this.chart.render()
    },
    updateTweet(d) {
      if (this.lastDate !== d) {
        console.log('Hi')
        this.lastDate = d
        this.tweets = this.dataset.tweets[d]
      }
    }
  }
}

</script>
