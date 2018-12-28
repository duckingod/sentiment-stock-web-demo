<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>CrowdPT</span>
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
        <v-flex
          xs12
          sm10
          offset-sm1
          d-flex
        >
          <candlestick-demo
            id="demo"
            ref="demo"
            v-model="dataset"
            :n-tweet="0"
            :show-tweets="false"
          />
        </v-flex>
      </v-container>
    </v-content>
    <v-snackbar v-model="snackbar">
      {{ snackbarMessage }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-footer
      v-if="!config.anonymous"
      align-center
      class="pa-3"
    >
      <v-layout
        row
        wrap
      >
        <v-flex class="text-xs-center">
          <a :href="config.paper.url">{{ config.paper.title }}</a>,
          <a :href="config.github.url">github</a> &copy; 2018
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import CandlestickDemo from './components/CandlestickDemo.vue'
import config from './config'
// import jsonData from './latest_demo_info.json'
import axios from 'axios'
import placeholderJson from './smallData.json'
let jsonData = axios.get(config.dataUrl)

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
      stock.push({ x: Number(i), y: ohlc, label: dates[i].toLocaleDateString() })
      // offset 1 day
      if (i)
        targets.push({ x: Number(i), y: round(Number(c.price_target[i-1])), label: dates[i].toLocaleDateString() })
    }
    data[name] = {name, dates, tweets, stock, targets}
  }
  return data
}

function initData (jsonData) {
  let companys = buildDataset(jsonData)
  let companyNames = Object.keys(companys)
  return {
    companys: companys,
    companyList: companyNames,
    company: companyNames[0],
    dataset: companys[companyNames[0]],
    config: config
  }
}
export default {
  name: 'App',
  components: {
    CandlestickDemo
  },
  data () {
    return {
      snackbarMessage: 'Loading data ...',
      snackbar: true,
      ...initData(placeholderJson) }
  },
  async mounted () {
    try {
      let data = initData(await jsonData)
      this.snackbar = false
      await this.$nextTick
      Object.keys(data).forEach(k => this[k] = data[k])
      this.snackbar = true
      this.snackbarMessage = 'Data loaded'
    } catch (e) {
      this.snackbar = true
      this.snackbarMessage += ` Encountered ${e.message}`
    }
  },
  methods: {
    changeCompany (company) {
      this.dataset = this.companys[company]
      // scroll to demo
      let e = this.$el.querySelector("#demo")
      this.$nextTick(() => {
        window.scrollTo(0, e.offsetTop)
      })
    },
  }
}
</script>
