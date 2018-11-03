<template>
  <v-content>
    <div
      id="chartt"
      ref="chart"
      style="height: 300px; width: 100%; background-color: transparent;"
    />
    <v-list>
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
const createDataset = () => {
  let lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet pellentesque nisi. Nullam a dui pretium, ultrices erat eu, tincidunt nisl. Vivamus interdum ligula commodo, venenatis diam vel, volutpat turpis. Sed fermentum congue erat gravida sodales. Donec nec magna in turpis pellentesque ullamcorper id et tortor. Maecenas vitae justo tellus. Fusce feugiat, velit eu placerat condimentum, nisl libero finibus turpis, sit amet rutrum odio dolor ac eros. Pellentesque cursus neque a tellus condimentum, et rhoncus augue maximus. Cras commodo porttitor lectus nec consequat. Proin et augue sed nulla egestas sollicitudin scelerisque id dolor.'
  let stockData = [
    {x: new Date(2012,1,1),y:[5198, 5629, 5159, 5385]},
    {x: new Date(2012,1,2),y:[5366, 5499, 5135, 5295]},
    {x: new Date(2012,1,3),y:[5296, 5378, 5154, 5248]},
    {x: new Date(2012,1,4),y:[5254, 5279, 4788, 4924]},
    {x: new Date(2012,1,5),y:[4910, 5286, 4770, 5278]},
    {x: new Date(2012,1,6),y:[5283, 5348, 5032, 5229]},
    {x: new Date(2012,1,7),y:[5220, 5448, 5164, 5258]},
    {x: new Date(2012,1,8),y:[5276, 5735, 5215, 5703]},
    {x: new Date(2012,1,9),y:[5704, 5815, 4888, 5619]},
    {x: new Date(2012,1,10),y:[5609, 5885, 5548, 5879]},
    {x: new Date(2012,1,11),y:[5878, 5965, 5823, 5905]},
    {x: new Date(2012,1,12),y:[5937, 6111, 5935, 6034]},
    {x: new Date(2012,1,13),y:[6040, 6052, 5671, 5693]},
    {x: new Date(2012,1,14),y:[5702, 5971, 5604, 5682]},
    {x: new Date(2012,1,15),y:[5697, 5962, 5477, 5930]},
    {x: new Date(2012,1,16),y:[5911, 6229, 5910, 5985]},
    {x: new Date(2012,1,17),y:[5997, 6011, 5566, 5842]},
    {x: new Date(2012,1,18),y:[5834, 6093, 5675, 5742]},
    {x: new Date(2012,1,19),y:[5776, 5808, 5118, 5471]},
    {x: new Date(2012,1,20),y:[5480, 6142, 5318, 5735]},
    {x: new Date(2012,1,21),y:[5756, 6309, 5700, 6299]},
    {x: new Date(2012,1,22),y:[6289, 6342, 5972, 6176]},
    {x: new Date(2012,1,23),y:[6171, 6415, 6129, 6304]}
  ]
  let rnd = n => Math.floor(Math.random()*n)
  let n = rnd(5) + 10
  stockData = stockData.slice(rnd(stockData.length - n), n)
  let dates = stockData.map(d => d.x)
  let tweetData = dates.map(d =>
    [0, 0, 0, 0, 0, 0].map(a =>
      ({ 
        content: lorem.substr(rnd(200), rnd(70)+30) + ` At ${d.getDate()} / ${d.getMonth()}`,
        author: lorem.split(' ')[rnd(50)]
      })
    )
  )
  let tmp = {}
  for (let i = 0; i < dates.length; i++) tmp[dates[i]] = tweetData[i]
  tweetData = tmp
  return {dates, stockData, tweetData}
}
let {dates, stockData, tweetData} = createDataset()

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
            this.updateTweet(x)
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
