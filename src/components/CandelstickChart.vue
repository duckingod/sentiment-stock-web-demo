<template>
  <v-content>
    <div
      id="chartt"
      ref="chart"
      style="height: 300px; width: 100%; background-color: transparent;"
    />
    <v-list>
      <v-list-tile
        v-for="tweet in tweets">
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
const loadDataset = () => {
  let dates = [
      new Date(2016, 11, 12),
      new Date(2016, 11, 13),
      new Date(2016, 11, 14)
  ]
  let stockData = [
    { y: [6, 7, 1, 2] },
    { y: [2, 1, 10, 5] },
    { y: [5, 15, 4, 10] }
  ]
  let tweetData = [
    [
      { content: 'Hi stock is good', author: 'Mario' },
      { content: 'Hi stock QQ', author: 'Mario1' },
      { content: 'Hi stock bon qui qui', author: 'Mario2' }
    ],
    [
      { content: 'Hi stock is goodd', author: 'Mario' },
      { content: 'Hi stock QQQ', author: 'Mario1' },
      { content: 'Hi stock bon qui qui', author: 'Mario2' }
    ],
    [
      { content: 'Stock is good', author: 'Mario' },
      { content: 'Stock QQ', author: 'Mario1' },
      { content: 'Stock bon qui qui', author: 'Mario2' }
    ]
  ]
  stockData = Array.from(Array(dates.length).keys()).map(i => {
    stockData[i].x = dates[i]
    return stockData[i]
  })
  let tmp = {}
  for (let i = 0; i < dates.length; i++) tmp[dates[i]] = tweetData[i]
  tweetData = tmp
  return {dates, stockData, tweetData}
}
let {dates, stockData, tweetData} = loadDataset()

// Candlestick
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
      dataset: {
        stock: stockData,
        tweets: tweetData
      },
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
          contentFormatter: e => {
            let {x, y} = e.entries[0].dataPoint
            if (this.lastDate !== x) {
              console.log('Hi')
              this.lastDate = x
              this.tweets = this.dataset.tweets[x]
            }
            return `Date: ${x}<br /><strong>Price:</strong><br />Open: ${y[0]}, Close: ${y[3]}<br />High: ${y[1]}, Low: ${y[2]}`
          }
        },
        data: [{
          type: "candlestick",
          yValueFormatString: "$##0.00",
          risingColor: "green",
          fallingColor: "red",      
          dataPoints: stockData
        }]
      }
    }
  },
  mounted() {
    this.chart = new CanvasJS.Chart(this.$refs.chart, this.chartOptions)
    this.renderChart()
  },
  methods: {
    renderChart() {
      let dataSeries;
      for(let i = 0; i < this.chart.options.data.length; i++){
        dataSeries = this.chart.options.data[i];
        for(let j = 0; j < dataSeries.dataPoints.length; j++){
          dataSeries.dataPoints[j].color = (dataSeries.dataPoints[j].y[0] <= dataSeries.dataPoints[j].y[3]) ? (dataSeries.risingColor ? dataSeries.risingColor : dataSeries.color) : (dataSeries.fallingColor ? dataSeries.fallingColor : dataSeries.color);
        }
      }
      this.chart.render()
    
    }
  }
}

</script>
