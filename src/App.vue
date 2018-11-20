<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container
        grid-list-md
        text-xs-center
      >
        <v-flex
          xs12
          sm6
          offset-sm3
          d-flex
        >
          <v-select
            v-model="company"
            text-xs-center
            :items="companyList"
            label="Company"
            @change="changeCompany"
          />
        </v-flex>
        <candlestick-demo
          id="demo"
          ref="demo"
          v-model="dataset"
          :n-tweet="6"
        />
      </v-container>
    </v-content>
    <v-footer
      align-center
      class="pa-3"
    >
      <v-layout
        row
        wrap
      >
        <v-flex class="text-xs-center">
          duckingod, cjchen &copy; 2018
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import CandlestickDemo from './components/CandlestickDemo.vue'
import jsonData from './latest_demo_info.json'

const buildDataset = jsonData => {
  let data = {}
  let digLen = 1000
  const round = i => Math.floor(i * digLen) / digLen
  for (let c of jsonData) {
    let name = c.target
    let dates = c.date.map(d => new Date(d))
    let tweets = {}
    for (let i in c.tweet)
      tweets[dates[i]] = c.tweet[i].tweet.map(t => ({ author: 'nan', content: t}))
    let stock = []
    let targets = []
    for (let i in dates) {
      let ohlc = [c.open[i], c.high[i], c.low[i], c.close[i]]
      ohlc = ohlc.map(round)
      stock.push({ x: dates[i], y: ohlc })
      // offset 1 day
      if (i)
        targets.push({ x: dates[i], y: round(Number(c.price_target[i-1]))})
    }
    data[name] = {name, dates, tweets, stock, targets}
  }
  return data
}

const simulateDataset = name => {
  let lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet pellentesque nisi. Nullam a dui pretium, ultrices erat eu, tincidunt nisl. Vivamus interdum ligula commodo, venenatis diam vel, volutpat turpis. Sed fermentum congue erat gravida sodales. Donec nec magna in turpis pellentesque ullamcorper id et tortor. Maecenas vitae justo tellus. Fusce feugiat, velit eu placerat condimentum, nisl libero finibus turpis, sit amet rutrum odio dolor ac eros. Pellentesque cursus neque a tellus condimentum, et rhoncus augue maximus. Cras commodo porttitor lectus nec consequat. Proin et augue sed nulla egestas sollicitudin scelerisque id dolor.'
  let stock = [
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
  let n = rnd(5) + 15
  let i = rnd(stock.length - n)
  stock = stock.slice(i, i + n)
  let targets = stock.map(a => ({ x: a.x, y: Math.floor(a.y[0] * (Math.random() * 0.1 + 1)) }))
  let dates = stock.map(d => d.x)
  let tweets = dates.map(d =>
    [0, 0, 0, 0, 0, 0].map(a =>
      ({ 
        content: lorem.substr(rnd(200), rnd(70)+30) + `. (${d.getMonth()} / ${d.getDate()})`,
        author: lorem.split(' ')[rnd(50)]
      })
    )
  )
  let tmp = {}
  for (let i = 0; i < dates.length; i++) tmp[dates[i]] = tweets[i]
  tweets = tmp
  return {name, dates, stock, targets, tweets}
}

export default {
  name: 'App',
  components: {
    CandlestickDemo
  },
  data () {
    let companys = buildDataset(jsonData)
    let companyNames = Object.keys(companys)
    return {
      companys: companys,
      companyList: companyNames,
      company: companyNames[0],
      dataset: companys[companyNames[0]]
    }
  },
  methods: {
    changeCompany(company) {
      this.dataset = this.companys[company]
      // scroll to demo
      let e = this.$el.querySelector("#demo")
      this.$nextTick(() => {
        window.scrollTo(0, e.offsetTop)
      })
    }
  }
}
</script>
