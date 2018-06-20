<template>
  
  <div class="chartElem">
    
      <header class="toolbar" style="background: #4765a0;margin-bottom: 15px;">
      <label class="toolbarLabel"> Current data set :  </label>
      <select name="dataset" v-model="activeSerie" >
      <option   :value='item.uuid' v-for="(item,index) in instrumentListeUUIDByName">{{item.name}}</option>
      </select>

      
    <label class="toolbarLabel"> Periode  </label>
        <span style="color:white"> from : </span>
        <i class="fa fa-2x fa-angle-left" v-on:click="prevDay"></i>
        <input class="aeris-day-image-datepicker-input" id="datepicker"  v-model="selectedDay" @blur="getinputVal()" >
        <i class="fa fa-2x fa-angle-right" v-on:click="nextDay"></i>
         <span style="color:white">to :  </span>
        <!--  <i class="fa fa-2x fa-angle-left" v-on:click="prevDay"></i> -->
        <input disabled class="aeris-day-image-datepicker-input" id="datepicker"  v-model="selectedDay" @blur="getinputVal()" >
        <!-- <i class="fa fa-2x fa-angle-right" v-on:click="nextDay"></i> -->
      <div class="buttonPanel">
      <!-- <button id="drawMode" class="icon-button" type="button"  title="Draw Mode (d)">
              <i class="fa fa-pencil"></i>
            </button> -->
              <button  id="save" class="icon-button" type="button"  title="Save" >
              <i class="fa fa-floppy-o" ></i>
            </button>
        </div>
      </header>
    
    <div class="row">
      <highcharts class="chart" :options="chartOptions" ref="highcharts" ></highcharts>
      <div>
        <div class="AnnotationPanel"> 
          <ul style="list-style:none;margin-left:0;padding-left:0">
            <li  v-for="(elt,index,prop) in elt_tab[elt_name]">
          
          <select name="quality" v-model="elt.quality" class="annotationSelect">
              <option value="" selected disabled>Choose quality flag</option>
              <option :value="'('+item.code+') '+item.label" v-for="item in qualityFlagTab">{{item.label}}</option>
            </select>
          <label class="annotationLabel"> Start : </label>
          <input type="time" v-model="xStartNew" class="annotationTime">
          <label class="annotationLabel"> End : </label>        
          <input type="time" v-model="xEndNew"  class="annotationTime">   
          <label class="annotationLabel"> Comment : </label>    
          <textarea  rows="5" cols="5" v-model="elt.comment" class="annotationTextarea"></textarea>
          <button  @click="delCurrentElt" :value='"Del " +elt_name' class="annotationButton"> <i class="fa fa-trash"></i></button>
        </li>
        </ul>
        </div>
        
      </div>
      
      <div id="toolTipBox">
          <label class="tooltipHeader">Resume</label>
          <br />
          <label class="tooltipLabel">Quality flag:</label>
          <label id="title" class="tooltipText">totot</label>
          <br />
          <label class="tooltipLabel">Comment:</label>
          <label id="targetPrice" class="tooltipText"></label>
          <br />
          <!-- <label class="tooltipLabel">Validateur:</label>
          <label id="rating" class="tooltipText"></label>
          <br />
          <label class="tooltipLabel">Date:</label>
          <label id="ltGrowth" class="tooltipText"></label>
          <br /> -->

      </div>
      
    </div>

  </div>


</template>

<script>
const DATE_FORMAT = "LL";
//var interact = require('interactjs')
export default {
  data() {
    return {
      /* chartOptions: {
        /* data: {
            csvURL: window.location.origin + "/ppg2008.csv"
        },   

        chart: {
          animation: false,
          type: "contour"
        },
        plotOptions: {
          heatmap: {
            animation: false,
            enableMouseTracking: false,
            stickyTracking: true,
            shadow: false,
            dataLabels: { style: { textShadow: false } }
          }
        },
        boost: {
          useGPUTranslations: true,
          usePreAllocated: true,
          boostForceChartBoost: true,
          boostThreshold: 1,
          turboThreshold: 0
        },
        yAxis: {
          endOnTick: false
        },
        xAxis: {
          endOnTick: false
        },
        tooltip: {
          enabled: false,
          animation: false
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        colorAxis: {
          stops: [[0, "#3060cf"], [0.5, "#fffbbc"], [1, "#c4463a"]]
        }, 
        series: [
          {
            dataGrouping: {
              enabled: true
            },
            data: []
          }
        ]
      }, */

      chartOptions: {
        series: [
          {
            data: ""
          }
        ],
        mapNavigation: {
          enabled: true,
          enableButtons: false,
          enableDoubleClickZoomTo: false
        },
        tooltip: {
          enabled: false
        },

        title: {
          text: ""
        },
        chart: {
          zoomType: "x",
          panning: true,
          panKey: "shift",
          animation: false,
          events: {
            selection: event => {
              var _this = this.$refs.highcharts.chart;
              this.group = _this.renderer.g("rectangle").add();

              (this.coord.xMin = _this.xAxis[0].translate(
                (event.xAxis[0] || _this.xAxis[0]).min
              )),
                (this.coord.xMax = _this.xAxis[0].translate(
                  (event.xAxis[0] || _this.xAxis[0]).max
                )),
                (this.coord.yMin = _this.yAxis[0].translate(
                  (event.yAxis[0] || _this.yAxis[0]).min
                )),
                (this.coord.yMax = _this.yAxis[0].translate(
                  (event.yAxis[0] || _this.yAxis[0]).max
                ));

              console.log(this.$refs.highcharts);
              this.elt_id = this.elt + this.cpt++;

              _this.renderer
                .rect(
                  this.coord.xMin + _this.plotLeft,
                  _this.plotHeight + _this.plotTop - this.coord.yMax,
                  this.coord.xMax - this.coord.xMin,
                  this.coord.yMax - this.coord.yMin
                )
                .attr({
                  id: this.elt_id
                })
                .css({
                  stroke: "red",
                  strokeWidth: ".5",
                  fill: "blue",
                  fillOpacity: ".1"
                })
                .add(this.group);

             /*  $("rect")
                .draggable() // WORKS
                .on("drag", function(event, ui) {
                  console.log(event);
                  event.target.setAttribute("x", ui.position.left);
                  event.target.setAttribute("y", ui.position.top);
                });

              $("#" + this.elt_id)
                .resizable()
                .on("resize", function(event, ui) {
                  console.log("resize");
                  event.target.setAttribute("width", ui.size.width);
                  event.target.setAttribute("height", ui.size.height);
                }); */

              this.group.on("mousemove", this.ToolTipFollow.bind(this));

              this.group.on("mouseout", this.ToolTipOut.bind(this));

              this.group.on("mouseover", this.feedToolTip.bind(this));

              this.group.on("click", this.selectElt.bind(this));
              var that = this;
             // this.group.on('mousedown', this.mouseDown.bind(this))
              window.setTimeout(function() {
                that.currentXStart = Math.round(
                  _this.xAxis[0].toValue($("#" + that.elt_id).attr("x"))
                );
                // timestamp en millseconde
                that.currentXEnd = Math.round(
                  _this.xAxis[0].toValue(
                    parseInt($("#" + that.elt_id).attr("x")) +
                      parseInt($("#" + that.elt_id).attr("width"))
                  )
                );
                that.xStartNew = moment(moment(that.currentXStart)._d).format(
                  "HH:mm:ss"
                );
                that.xEndNew = moment(moment(that.currentXEnd)._d).format(
                  "HH:mm:ss"
                );
                console.log("that.currentXEnd");
                console.log(that.elt_name);
                that.elt_name = that.elt_id;
                that.$set(that.elt_tab, that.elt_name, [
                  {
                    comment: "",
                    quality: "",
                    coords: {
                      start: {
                        x: that.xStartNew
                      },
                      stop: {
                        x: that.xEndNew
                      }
                    }
                  }
                ]);

                console.log(that.elt_tab);
              }, 50);

              return false;
            }
          }
        },
        time: {
          timezone: "Europe/Berlin"
        },
        dataGrouping: {
          enabled: false
        },
        yAxis: [
          {
            gridLineWidth: 0,
            minorGridLineWidth: 0
          }
        ],
        data: {
          csv: ""
        }
      },
      activeSerieUuid: "",
      _tab: [],
      elt_tab: {},
      index: null,
      qualityFlagTab: [],
      group: {},
      commentTooltip: "",
      toolTipQuality: "",
      graph: {},
      cpt: 0,
      elt: "element_",
      elt_id: "",
      elt_name: "1",
      xStartNew: 0,
      xEndNew: 0,
      date_file: {
        type: String,
        default: "a"
      },
      coord: {
        xMin: null,
        xMax: null,
        yMin: null,
        yMax: null
      },
      current_rect: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      },
      blankElment: {
        comment: "",
        quality: "",
        coords: {
          start: {
            x: "6:30",
            y: "500"
          },
          stop: {
            x: "10:00",
            y: "0"
          }
        },
        id: "",
        elementType: "range"
      },

      valdata: "",
      handlesSize: 8,
      currentHandle: false,
      drag: false,
      instrumentListeUUIDByName: [],
      instrumentUUIDListe: [],
      instrumentNameListe: [],
      isclassActive: false,
      instrumentInfo: "",
      SerieTitle: "",
      activeSerie: "",
      orcid: {
        type: String
      },
      days: {
        type: Array,
        default: []
      },
      selectedDay: {
        type: String,
        default: "10 avril 2018"
      },
      picker: {
        type: Object
      },
      lang: "fr",
      currentXEnd: {},
      currentXStart: {},
      date_file: "",
      csvtab: [],
      heatmapTab: []
    };
  },
  created() {
    var that = this;

    /* $.get("rcs_0.csv", function(data) {
      that.csvtab = Papa.parse(data);
      console.log(that.csvtab);
    });  */

    console.log("ceated hook chart component");
    this.orcid = "none";
    this.displayValidation = false;
    document.addEventListener(
      "aerisOrcidResponse",
      this.checkOrcidForvalidation.bind(this)
    );
    var eventOrcid = new CustomEvent("aerisOrcidRequest");
    document.dispatchEvent(eventOrcid);

    moment.locale("fr");
  },
  mounted() {
    console.log("mounted hook chart component");
    this.selectedDay = "25 mai 2018";
    /* this.selectedDay = moment(new Date());
    var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
    this.selectedDay = selectedMoment.format(DATE_FORMAT); */
    this.graph = this.$refs;
    
    console.log(this.graph);
    this.getLabelValue();
    // console.log(this.csvtab)
    /* i18n */
    var monthsArray = [];
    var daysArray = [];
    var shortDaysArray = [];
    for (var i = 0; i < 12; i++) {
      monthsArray.push(
        this.capitalize(
          moment()
            .month(i)
            .format("MMMM")
        )
      );
    }
    for (var i = 0; i < 7; i++) {
      daysArray.push(
        this.capitalize(
          moment()
            .day(i)
            .format("dddd")
        )
      );
      shortDaysArray.push(
        this.capitalize(
          moment()
            .day(i)
            .format("ddd")
        )
      );
    }
    this.picker = new Pikaday({
      field: this.$el.querySelector("#datepicker"),
      format: DATE_FORMAT,
      maxDate: new Date(),
      firstDay: 1,
      defaultDate: new Date(),
      setDefaultDate: true,
      i18n: {
        previousMonth: "Previous",
        nextMonth: "Next",
        months: monthsArray,
        weekdays: daysArray,
        weekdaysShort: shortDaysArray
      }
    });
  },
  watch: {
    csvtab() {
      /* console.log("csvtastart");
      console.log(this.csvtab);
      for (var i = 0; i < this.csvtab.data.length; i++) {
        for (var j = 0; j < this.csvtab.data[i].length; j++) {
          this.heatmapTab.push([i, j, parseFloat(this.csvtab.data[i][j])]);
        }
      } */
      /* console.log(this.heatmapTab);
      this.graph.options.series[0].data = this.heatmapTab;
      console.log("csvtabend");
      console.log(this.graph);
      var arr = this.heatmapTab;
      var a = document.createElement("a");
      var file = new Blob([JSON.stringify(arr)], { type: "text/plain" });

      a.href = URL.createObjectURL(file);
      a.download = "bla4";
      a.click();   */
    },
    xStartNew(newValue) {
      var hour = newValue.split(":");
      console.log(hour);
      this.updateXStartvalue(
        moment(this.currentXStart)
          .hour(hour[0])
          .minute(hour[1])
          .second(hour[2])
          .valueOf()
      );
    },
    xEndNew(newValue) {
      console.log("newValue" + newValue);

      var hour = newValue.split(":");
      console.log(hour);
      moment(this.currentXEnd)
        .hour(hour[0])
        .valueOf();

      console.log("currentXEnd : ");
      console.log(moment(this.currentXEnd));
      console.log(moment(moment(this.currentXEnd)._d).format("HH:mm:ss"));
      this.updateXEndValue(
        moment(this.currentXEnd)
          .hour(hour[0])
          .minute(hour[1])
          .second(hour[2])
          .valueOf()
      );
    },

    selectedDay(value) {
      console.log("watch selected day");
      var today = moment(new Date());
      var selected = moment(this.selectedDay, DATE_FORMAT);
      this.date_file = moment(this.selectedDay, "DD MMMMMMM YYYY").format(
        "YYYY-MM-DD"
      );
      this.queryService();
    }
  },

  methods: {
    get_current_elt_id: function() {
      return this.elt_name;
    },
    get_current_rect_prop: function() {
      return this.elt_name;
    },
    updateXEndValue: function(xval) {
      console.log("time : ");
      console.log(xval);
      console.log("--------------");
      xval = this.graph.highcharts.chart.xAxis[0].toPixels(xval);
      var XX = parseInt($("#" + this.elt_name).attr("x"));
      var WW = parseInt($("#" + this.elt_name).attr("width"));
      var Nw = xval - XX;
      console.log(Nw);
      $("#" + this.elt_name).attr("width", Nw);
    },

    updateXStartvalue: function(xval) {
      xval = this.graph.highcharts.chart.xAxis[0].toPixels(xval);
      var WW = $("#" + this.elt_name).attr("width");
      var XX = $("#" + this.elt_name).attr("x") - xval;
      var Nw = parseInt(WW) + parseInt(XX);
      $("#" + this.elt_name).attr("width", Nw);
      $("#" + this.elt_name).attr("x", xval);
      console.log("Nw :");
      console.log(Nw);
    },

    delCurrentElt: function() {
      $("#" + this.elt_name).remove();

      delete this.elt_tab[this.elt_name];
    },

    ToolTipFollow: function(e) {
      if(this.elt_tab[e.target.id][0].quality != ""){
       console.log("mouse move");
      console.log(e)
      this.graph.highcharts.chart.options.chart.zoomType = "none";
      this.graph.highcharts.chart.options.chart.panning = false;

      $("#toolTipBox").show();
      $("#toolTipBox").css({
        left: e.pageX + 15,
        top: e.pageY + 15
      }); }
    },

    ToolTipOut: function(e) {
      this.graph.highcharts.chart.options.chart.zoomType = "x";
      this.graph.highcharts.chart.options.chart.panning = true;
      console.log("mouse out");

      $("#toolTipBox").hide();
    },

    selectElt: function(e) {
      console.log("click");
     
      this.elt_name = e.target.id;
      if (this.currentElt != this.elt_name){
        $("#" + this.elt_name).css('stroke','green')
        if(this.currentElt !=""){
        $("#" + this.currentElt).css('stroke','red')}
        this.currentElt = this.elt_name
      }
         
      
      this.current_rect = {
        id: e.target.id,
        x: $("#" + this.elt_name).attr("x"),
        y: $("#" + this.elt_name).attr("y"),
        w: $("#" + this.elt_name).attr("width"),
        h: $("#" + this.elt_name).attr("height")
      };
      console.log(this.current_rect);
      this.currentXStart = Math.round(
        this.graph.highcharts.chart.xAxis[0].toValue($("#" + this.elt_name).attr("x"))
      );
      // timestamp en millseconde
      this.currentXEnd = Math.round(
        this.graph.highcharts.chart.xAxis[0].toValue(
          parseInt($("#" + this.elt_name).attr("x")) +
            parseInt($("#" + this.elt_name).attr("width"))
        )
      );

      this.xStartNew = moment(moment(this.currentXStart)._d).format("HH:mm:ss");
      this.xEndNew = moment(moment(this.currentXEnd)._d).format("HH:mm:ss");
      console.log("time : ");
      console.log(this.xEndNew);

      console.log("======");
      /* $('.highcharts-rectangle').each(function(i, gridLinesArray) 
            {
              console.log(i)
            });
           */

      /*interact('#'+this.elt_name).resizable(
            {
   
              onmove: function (event) {
                var rectangle 
                event.target.setAttribute('width', this.ui.size.width.bind(this));
                event.target.setAttribute('height', this.ui.size.height); 
                
              }
  });*/
    },

    feedToolTip: function(e) {
      console.log(this.elt_tab);
      console.log(e);
      $("#title").text(this.elt_tab[e.target.id][0].quality);
      $("#targetPrice").text(this.elt_tab[e.target.id][0].comment);
    },

    queryService: function() {
      var _this = this;
      var url = _this.service + _this.date_file; /* Modify with the UUID */
      console.time("download time : ");
      this.$http
        .get(
          // "bla4.txt"
          "https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/quicklook/download?uuid=91440f71-9c3e-5d31-befc-2729873ce581&folder=/GROUND-BASED/P2OA_Pic-Du-Midi/NEPHE/NEPHE_RAW/" +
            _this.date_file.substring(0, 4) +
            "&image=PDM_NEPH_" +
            _this.date_file.replace(/\D/g, "") +
            ".csv"
        )
        .then(
          response => {
            /* if (!_this.graph.highcharts.Series.prototype.renderCanvas) {
              console.error("Module not loaded");
              return;
            } */
            console.log("******************************");
            console.timeEnd("download time : ");
            //console.log(response.body);
            console.log("******************************");

            
            _this.chartOptions.data.csv = response.bodyText;

         
          
          },
          response => {
            console.log("error");
          }
        );
         _this.graph.highcharts.chart.series[0].show()
    },

    getLabelValue: function(uuid) {
      var url_o =
        "https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/quality/flags/";
      var that = this;
      var service = url_o + "91440f71-9c3e-5d31-befc-2729873ce581";
      $.when(
        $.ajax({
          url: service,
          data: "",
          contentType: "application/json; charset=utf-8",
          type: "GET",
          success: function(data) {
            console.log("ajax request for label quality ok ");
          },
          error: function(x, y, z) {
            alert(x.responseText + "  " + x.status);
          }
        })
      ).then(function(resp) {
        var i = 0;
        for (i = 0; i < resp.length; i++) {
          that.qualityFlagTab.push(resp[i]);
        }
      });
      this.isShow = !this.isShow;
    },

    checkOrcidForvalidation: function(e) {
      if (typeof e.detail.user.orcid != "undefined") {
        console.log("orcid : " + e.detail.user.orcid);
        this.orcid = e.detail.user.orcid;
        var urlServiceInstrumentUUIIDbyOrcid =
          "https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/admin/uuids?orcid=" +
          this.orcid;
        this.$http.get(urlServiceInstrumentUUIIDbyOrcid).then(
          response => {
            this.instrumentUUIDListe = response.body;
            for (var i = 0; i < response.body.length; i++) {
              this.getInstrumentInfo(this.instrumentUUIDListe[i]);
            }
          },
          response => {
            console.log("error");
          }
        );
      } else {
        console.log("orcid is undefined");
      }
    },

    getInstrumentInfo: function(uuidInstrument) {
      var urlInstrumentInfo =
        "https://sedoo.aeris-data.fr/catalogue/rest/metadatarecette/id/" +
        uuidInstrument;
      var obj = {};
      this.$http.get(urlInstrumentInfo).then(
        response => {
          this.instrumentNameListe.push(response.body.resourceTitle.en);
          obj = { name: response.body.resourceTitle.en, uuid: uuidInstrument };
          this.instrumentListeUUIDByName.push(obj);

          this.activeSerie = this.instrumentListeUUIDByName[0].uuid;
        },
        response => {
          console.log("error");
        }
      );
    },

    /************************************************************/
    /* get current value from input text field of the datepicker*/
    /************************************************************/
    getinputVal: function() {
      this.selectedDay = document.getElementById("datepicker").value;
    },
    /********************************************************************/
    /* Set current selected day to today (on display and in datepicker) */
    /********************************************************************/
    goToToday: function() {
      this.picker.setDate(new Date());
      this.selectedDay = this.picker.getMoment().format(DATE_FORMAT);
    },
    /*************************************************/
    /* Intercept events and add granule informations */
    /*************************************************/
    setListenersDayComp: function(event) {
      this.debugTrace(this.debug, "**setListenersDayComp start");
      this.$.viewer.addEventListener(
        "selectionModified",
        function(ev) {
          ev.detail.granule = this.selectedElem;
        }.bind(this)
      );
      this.$.viewer.addEventListener(
        "selectionEnd",
        function(ev) {
          ev.detail.granule = this.selectedElem;
        }.bind(this)
      );
      this.debugTrace(this.debug, "**setListenersDayComp end");
    },
    /************************************************/
    /* Query service to get images for a given date */
    /************************************************/
    queryServiceDayComp: function() {
      this.debugTrace(this.debug, "**queryServiceDayComp start");
      var _this = this;
      var url_service = this.service + _this.convert_Date_Format();
      console.log("url_service " + url_service);
      $.ajax({
        url: url_service,
        data: _this.queryParams,
        method: "get",
        dataType: "json"
      })
        .done(function(data) {
          _this.uuid_day = _this.getId();
          _this.days = data.granules;
          _this.showql = true;
          _this.totalResults = data.totalResults;
          /*if(_this.totalResults == 0){
          _this.uuid_day =_this.getId
       
        }else{
          _this.uuid_day =_this.getId//_this.days[0].uuid
        }*/

          window.setTimeout(function() {
            _this.selectedElem = _this.uuid_day; //_this.days[0];
            _this.viewElement.setAttribute("totalResults", data.totalResults);
            _this.viewElement.setAttribute("uuid", _this.uuid_day);
            // _this.showElement( _this.selectedElem);//if (_this.days.length) _this.showElement( _this.uuid_day);
            Ps.initialize(document.getElementById("datepicker"));
          }, 200);
        })
        .fail(function(data) {
          console.log("Error day: " + data.statusText);
        });
      this.debugTrace(this.debug, "**queryServiceDayComp end");
    },
    /******************************************************/
    /* Display the selected element in the view component */
    /******************************************************/
    showElement: function(selectedElem) {
      this.debugTrace(this.debug, "**showElement start");
      this.viewElement.setAttribute("uuid", this.selectedElem.uuid);
    },
    /* -------------------- */
    /*  Utilities           */
    /* -------------------- */
    /**************************************************/
    /* Check if this is the first element in the list */
    /**************************************************/
    checkFirst: function(index) {
      return index === 0;
    },
    /***************************/
    /* Capitalize given string */
    /***************************/
    capitalize: function(str) {
      return str.substring(0, 1).toUpperCase() + str.substr(1).toLowerCase();
    },
    /******************************************/
    /* Define the selected element from click */
    /******************************************/
    getElementFromClick: function(element) {
      /* Cooldown to avoid display bugs */
      this.debugTrace(this.debug, "**getElementFromClick start");
      this.selectedElem = element;
      this.showElement();
    },
    /****************************************/
    /* Format time displayed under elements */
    /****************************************/
    formatItemHour: function(date) {
      return moment(date).format("LT (Z)");
    },
    /******************************************/
    /* subtract a day to current selected day */
    /******************************************/
    prevDay: function() {
      console.log(" prevDay" + this.selectedDay);
      moment.locale("fr");
      var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
      console.log(" selectedMoment : " + selectedMoment);

      this.selectedDay = selectedMoment.subtract(1, "days").format(DATE_FORMAT);
      console.log(" prevDay : " + this.selectedDay);
    },
    /*************************************/
    /* Add a day to current selected day */
    /*************************************/
    nextDay: function() {
      console.log(" nextDay" + this.selectedDay);
      var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
      if (selectedMoment.isBefore(moment(new Date()), "day")) {
        this.selectedDay = selectedMoment.add(1, "days").format(DATE_FORMAT);
      }
    }
  }

  /* // Début code resize rectangle     
point : function(x, y) {
    return {
        x: x,
        y: y
    };
},

 dist  : function(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
},

 getHandle  : function(mouse) {
    if (this.dist(mouse, this.point(this.current_rect.x,  this.current_rect.y)) <= this.handlesSize) return 'topleft';
    if (this.dist(mouse, this.point(this.current_rect.x + this.current_rect.w,  this.current_rect.y)) <= this.handlesSize) return 'topright';
    if (this.dist(mouse, this.point(this.current_rect.x,  this.current_rect.y + this.current_rect.h)) <= this.handlesSize) return 'bottomleft';
    if (this.dist(mouse, this.point(this.current_rect.x + this.current_rect.w,  this.current_rect.y + this.current_rect.h)) <= this.handlesSize) return 'bottomright';
    if (this.dist(mouse, this.point(this.current_rect.x + this.current_rect.w / 2, this.current_rect.y)) <= this.handlesSize) return 'top';
    if (this.dist(mouse, this.point(this.current_rect.x,  this.current_rect.y + this.current_rect.h / 2)) <= this.handlesSize) return 'left';
    if (this.dist(mouse, this.point(this.current_rect.x + this.current_rect.w / 2, this.current_rect.y + this.current_rect.h)) <= this.handlesSize) return 'bottom';
    if (this.dist(mouse, this.point(this.current_rect.x + this.current_rect.w, this.current_rect.y + this.current_rect.h / 2)) <= this.handlesSize) return 'right';
    return false;
},

 mouseDown : function(e) {
    if (this.currentHandle) this.drag = true;
    this.draw();
},

mouseUp  : function() {
    drag = false;
    currentHandle = false;
    draw();
},

mouseMove  : function(e) {
    var previousHandle = this.currentHandle;
    if (!this.drag) this.currentHandle = this.getHandle(this.point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
    if (this.currentHandle && this.drag) {
        var mousePos = this.point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        switch (this.currentHandle) {
            case 'topleft':
                this.current_rect.w += this.current_rect.x - mousePos.x;
                this.current_rect.h += this.current_rect.y - mousePos.y;
                this.current_rect.x = mousePos.x;
                this.current_rect.y = mousePos.y;
                break;
            case 'topright':
                this.current_rect.w = mousePos.x - this.current_rect.x;
                this.current_rect.h += this.current_rect.y - mousePos.y;
                this.current_rect.y = mousePos.y;
                break;
            case 'bottomleft':
                this.current_rect.w += this.current_rect.x - mousePos.x;
                this.current_rect.x = mousePos.x;
                this.current_rect.h = mousePos.y - this.current_rect.y;
                break;
            case 'bottomright':
                this.current_rect.w = mousePos.x - this.current_rect.x;
                this.current_rect.h = mousePos.y - this.current_rect.y;
                break;

            case 'top':
                this.current_rect.h += this.current_rect.y - mousePos.y;
                this.current_rect.y = mousePos.y;
                break;

            case 'left':
                this.current_rect.w += this.current_rect.x - mousePos.x;
                this.current_rect.x = mousePos.x;
                break;

            case 'bottom':
                this.current_rect.h = mousePos.y - this.current_rect.y;
                break;

            case 'right':
            console.log(this.current_rect)
                this.current_rect.w = mousePos.x - this.current_rect.x;
                break;
        }
    }
    console.log("draw 1")
    if (this.drag || this.currentHandle != previousHandle)this.draw();
},

 draw  : function() {
    console.log("draw")
    if (this.currentHandle) {
        var posHandle = point(0, 0);
        switch (this.currentHandle) {
            case 'topleft':
                posHandle.x = this.current_rect.x;
                posHandle.y = this.current_rect.y;
                break;
            case 'topright':
                posHandle.x = this.current_rect.x + this.current_rect.w;
                posHandle.y = this.current_rect.y;
                break;
            case 'bottomleft':
                posHandle.x = this.current_rect.x;
                posHandle.y = this.current_rect.y + this.current_rect.h;
                break;
            case 'bottomright':
                posHandle.x = this.current_rect.x + this.current_rect.w;
                posHandle.y = this.current_rect.y + this.current_rect.h;
                break;
            case 'top':
                posHandle.x = this.current_rect.x + this.current_rect.w / 2;
                posHandle.y = this.current_rect.y;
                break;
            case 'left':
                posHandle.x = this.current_rect.x;
                posHandle.y = this.current_rect.y + this.current_rect.h / 2;
                break;
            case 'bottom':
                posHandle.x = this.current_rect.x + this.current_rect.w / 2;
                posHandle.y = this.current_rect.y + this.current_rect.h;
                break;
            case 'right':
                posHandle.x = this.current_rect.x + this.current_rect.w;
                posHandle.y = this.current_rect.y + this.current_rect.h / 2;
                break;
        }
        ctx.globalCompositeOperation = 'xor';
        ctx.beginPath();
        ctx.arc(posHandle.x, posHandle.y, handlesSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}  */
};
</script>

<style >
.chartElem {
  font-family: "Open Sans", sans-serif;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
}

#toolTipBox {
  word-wrap: break-word;
  background-color: White;
  opacity: 0.7;
  position: absolute;
  /* border-radius: 5px; */
  border: 0.5px solid #808080;
  padding: 10px;
  width: 20%;
  display: none;
  /*top: 100px;*/
  /* box-shadow: 1px 1px 3px #666;*/
  /*min-width: 100px;*/
}
.tooltipText {
  font-weight: normal !important;
  font-size: 11px;
  font-size: black;
}
.tooltipHeader {
  color: #ff6b00;
  font-weight: bold;
  font-size: 13px;
}
.tooltipLabel {
  color: black;
  font-weight: bold;
  font-size: 12px;
}

.toolbarLabel {
  color: #fff;
  margin-top: 0;
  height: 2.6rem;
  margin-bottom: 0px;
  text-align: center;
  align-items: center;
  padding-left: 15px;
  clear: none;
}

header select {
  font-weight: bold;
  background: #4765a0;
  border: none;
  color: #fff;
  height: 2.6rem;
  font-size: 1rem;
  -ms-box-sizing: content-box;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.icon-button {
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  /*border-radius: 50%;*/
  width: 2rem;
  height: 2rem;
  background: #eee;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: #4765a0;
  border-radius: inherit;
}
.fa-2x {
  font-size: 1.5em;
  color: white;
}
#datepicker {
  font-family: "Open Sans", sans-serif;
  font-size: 0.9rem;
  text-align: center;
  border: none;
  margin-right: 5px;
  margin-left: 5px;
}

.buttonPanel {
  display: inline-block;
  margin-left: 30px;
}
.annotationTime {
  border: solid 1px #ddd;
  /* height: 100px; */
  resize: none;
  /* width: 100%; */
  color: #555;
  resize: none;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  border-radius: 3px;
}
.annotationTextarea {
  border: solid 1px #ddd;
  vertical-align: bottom;
  resize: none;
  width: 200px;
  color: #555;
  resize: none;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  border-radius: 3px;
  background: white;
}

.annotationSelect {
  border: solid 1px #ddd;
  vertical-align: bottom;
  resize: none;
  font-size: 17px;
  color: #555;
  resize: none;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  border-radius: 3px;
  background: white;
}
.annotationLabel {
  color: black;
}
.AnnotationPanel {
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.annotationButton {
  border: solid 1px #ddd;
  vertical-align: bottom;
  resize: none;
  font-size: 25px;
  color: #555;
  resize: none;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  border-radius: 3px;
  background: white;
  margin-left: 5px;
}
</style>
