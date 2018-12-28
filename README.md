# Numeral Understanding in Financial Tweets for Fine-grained Crowd-based Forecasting Demo

[paper](https://arxiv.org/abs/1809.05356)

## Project setup
```
npm install
```

### Run server
```
npm run serve

# serve on https://url/BASEURL/
BASE_URL=baseurl npm run serve 

# serve without author infomations
VUE_APP_ANONYMOUS=1 npm run serve 
```

### Build
Change `serve` to `build` in [Run server](#Run-server), for example

```
npm run build
```

If you want to upload it to [github page](https://pages.github.com/), set `BASE_URL=your-repo-name`

### Periodic update data
```
DATA_PATH=/path/to/data.json npm run update
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
