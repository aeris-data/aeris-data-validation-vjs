require("exports-loader?!./l.min.js")
/* require("./highcharts-contour.js") */

import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import vueResource from 'vue-resource'
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue'

import Map from 'highcharts/modules/map.js';
import Data from 'highcharts/modules/data.js';
import Boost from 'highcharts/modules/boost.js';
import BoostCanvas from 'highcharts/modules/boost-canvas.js';
import Heatmap from 'highcharts/modules/heatmap.js';
import Exporting from 'highcharts/modules/exporting.js';

import Highstock from 'highcharts/modules/stock.js';

Exporting(Highcharts);
Data(Highcharts);
Map(Highcharts);
Boost(Highcharts)
Heatmap(Highcharts)
BoostCanvas(Highcharts)

Highstock(Highcharts)
import aerisChart from './components/Chart.vue'



ljs.addAliases({
  dep: [
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js",
    "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.all.css",
    'https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/css/pikaday.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/css/perfect-scrollbar.css',
    "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js",
    "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js",
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment-with-locales.min.js',
    "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data-2012-2022.min.js",
    'https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/js/perfect-scrollbar.min.js',
    "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.4.0/papaparse.js",
    // "https://rawgithub.com/paulo-raca/highcharts-contour/master/highcharts-contour.js",

    //"https://rawgithub.com/ironwallaby/delaunay/master/delaunay.js"

  ]
})

Vue.use(HighchartsVue)

Vue.use(Highcharts)
Vue.use(vueResource)
Vue.use(vueCustomElement);


ljs.load('dep', function () {

  Vue.customElement('aeris-chart', aerisChart);

})