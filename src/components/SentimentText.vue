<template>
  <span>
    <template v-for="(t, i) in texts">
      <span
        :key="i"
        :style="{color: t.color}"
      >{{ t.text + ' ' }} </span>
    </template>
  </span>
</template>
<script>
import sentiment from '../dict.json'

export default {
  props: {
    "text": { type: String, default: "" }
  },
  data: () => ({
    sentiment: sentiment
  }),
  computed: {
    texts() {
      return this.text.split(' ').map(t => {
        let color = "#000"
        t = t.toLowerCase()
        if (sentiment[t]) {
          // rgb - 000 - FF0 (positive) - 00F (negetive)
          let s = Math.round(sentiment[t] / 8) + 2
          let c1 = Math.min(Math.abs(s), 15).toString(16)
          let c2 = Math.round(Math.min(Math.abs(s), 12) / 2).toString(16)
          color = "#" + (s > 0 ? `0${c2}0` : `${c1}00`)
        }
        return {
          text: t,
          color: color
        }
      })
    }
  }
}
</script>
