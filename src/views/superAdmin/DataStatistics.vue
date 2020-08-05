<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card style="color: #999;">
            <div style="margin-bottom: 10px;">订单量</div>
            <div style="margin-bottom: 10px;">{{nowDate}} | 今日</div>
            <div style="margin-bottom: 10px;">今日</div>
            <div><span style="font-size:40px;color: black;">{{orderCount}}</span> 个</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card style="color: #999;">
            <div style="margin-bottom: 10px;">成交金额</div>
            <div style="margin-bottom: 10px;">{{nowDate}} | 今日</div>
            <div style="margin-bottom: 10px;">今日</div>
            <div><span style="font-size:40px;color: black;">{{totalPrice}}</span> 元</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card style="color: #999;">
            <div style="margin-bottom: 10px;">新增商品数量</div>
            <div style="margin-bottom: 10px;">{{nowDate}} | 今日</div>
            <div style="margin-bottom: 10px;">今日</div>
            <div><span style="font-size:40px;color: black;">{{productCount}}</span> 件</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-card>
            <!-- <div class="total-class"> -->
            <div id="myChart1"
                 :style="{width: '100%', height: '300px'}"></div>
            <!-- </div> -->
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-col :span="9">
      <div class="grid-content bg-purple">
        <el-card>
          <div id="myChart2"
               :style="{width: '100%', height: '300px'}"></div>
        </el-card>
      </div>
    </el-col>
    <el-col :span="7">
      <div class="grid-content bg-purple-light">
        <el-card>
          <div id="myChart3"
               :style="{width: '100%', height: '300px'}"></div>
        </el-card>
      </div>
    </el-col>

    <el-col :span="7">
      <div class="grid-content bg-purple-light">
        <el-card>
          <div id="myChart5"
               :style="{width: '100%', height: '300px'}"></div>
        </el-card>
      </div>
    </el-col>
  </div>
</template>
<script>
export default {
  name: "hello",
  data() {
    return {
      GMVDate: [],
      GMVData: [],
      requestGMVDate: [],
      nowDate: "",
      order: {},
      product: {},
      orderCount: "0",
      totalPrice: "0",
      productCount: "0",
      productCategoryProportionData: {},
      isUpdateCPUAndMemmory: true,
      memoryData: [],
      cpuData: []
    };
  },
  mounted() {
    //获取mm-dd格式的日期
    this.nowDate = this.Common.format2();
    //获取订单信息
    this.getOrderData(this.Common.format3(new Date().getTime()));
    //获取商品信息
    this.getProductData();
    //获取GMV折线图的横坐标和实际数据
    this.createGMVDate();
    //获取商品种类占比情况
    this.getProductCategoryProportion();
    var timer = null;
    timer = window.setInterval(() => {
      setTimeout(this.updateCPUAndMemmory(), 0);
      console.log(timer);
    }, 1000);
    this.drawLine();
    //离开页面时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(
        document.getElementById("myChart1"),
        "macarons"
      );
      myChart1.showLoading();
      // 绘制图表
      myChart1.setOption({
        title: { text: "GMV近20天变化趋势" },
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.GMVDate
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.GMVData,
            type: "line"
          }
        ]
      });

      let myChart2 = this.$echarts.init(
        document.getElementById("myChart2"),
        "macarons"
      );
      myChart2.showLoading();
      myChart2.setOption({
        backgroundColor: "rgb(255,255,255)",

        title: {
          text: "各种商品分类占比",
          left: "center",
          top: 20,
          textStyle: {
            color: "#999"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
          {
            name: "商品种类",
            type: "pie",
            radius: "75%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "手机" },
              { value: 310, name: "电脑数码" },
              { value: 274, name: "家具" },
              { value: 235, name: "美妆" },
              { value: 400, name: "图书" },
              { value: 200, name: "其他" }
            ].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {},
            labelLine: {
              lineStyle: {},
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0)"
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      });
      let myChart3 = this.$echarts.init(
        document.getElementById("myChart3"),
        "macarons"
      );
      myChart3.showLoading();
      myChart3.setOption({
        xAxis: {
          name: "时间",
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: "内存占用率",
          type: "value",
          max: 100,
          min: 0
        },
        series: [
          {
            data: this.memoryData,
            type: "line",
            smooth: true,
            symbol: "none",
            stack: "a",
            areaStyle: {
              normal: {}
            }
          }
        ]
      });

      let myChart5 = this.$echarts.init(
        document.getElementById("myChart5"),
        "macarons"
      );
      myChart5.showLoading();
      myChart5.setOption({
        xAxis: {
          name: "时间",
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: "CPU占用率",
          type: "value"
        },
        series: [
          {
            data: this.cpuData,
            type: "line",
            smooth: true,
            symbol: "none",
            stack: "a",
            areaStyle: {
              normal: {}
            }
          }
        ]
      });
    },

    createGMVDate() {
      var beginTime = new Date().getTime() - 20 * 24 * 60 * 60 * 1000;
      for (var i = 0; i < 20; i++) {
        beginTime = beginTime + 24 * 60 * 60 * 1000;
        var date = new Date(beginTime),
          m = date.getMonth() + 1,
          d = date.getDate();
        //构建横坐标
        this.GMVDate.push(m + "-" + d);
        //构建请求数组
        this.requestGMVDate.push(this.Common.format3(beginTime));
      }
      //发起销售额数据列表请求
      this.getTotalPriceList();
    },
    //请求某一段时间的销售额
    getTotalPriceList() {
      //首先把请求日期数组转化为字符串
      var TotalPriceListData = new FormData();
      TotalPriceListData.append(
        "requestGMVDate",
        JSON.stringify(this.requestGMVDate)
      );
      this.$http({
        url: "superadmindatastatistics/getTotalPriceList",
        method: "post",
        data: TotalPriceListData
      }).then(response => {
        if (response.data.success == true) {
          //请求成功的为销售额字符串
          //切割为字符串数组
          var TotalPriceListStringList = response.data.TotalPriceListString.split(
            ","
          );
          //遍历整个数组并把字符串还原为数字
          //把数字push到GMVData中
          for (var i = 0; i < TotalPriceListStringList.length - 1; i++) {
            this.GMVData.push(parseInt(TotalPriceListStringList[i]));
          }
          //由于是异步请求所以请求完成后需要刷新图表数据
          this.refreshData(this.GMVData);
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    },
    //刷新GMV图表数据
    refreshData(data) {
      //首先获取到图表对象
      let myChart1 = this.$echarts.init(
        document.getElementById("myChart1"),
        "macarons"
      );
      var option = myChart1.getOption();
      option.series[0].data = data;
      myChart1.setOption(option);
      myChart1.hideLoading();
    },
    //请求不同分类商品占比
    getProductCategoryProportion() {
      this.$http({
        url: "superadmindatastatistics/getProductCategoryProportion",
        method: "post"
      }).then(response => {
        if (response.data.success == true) {
          this.productCategoryProportionData = response.data.dataMap;
          //获取到饼图对象
          let myChart2 = this.$echarts.init(
            document.getElementById("myChart2"),
            "macarons"
          );
          var option = myChart2.getOption();
          var categoryArr = [
            "手机",
            "电脑数码",
            "家具",
            "美妆",
            "图书",
            "其他"
          ];
          var catrgoryColor = [
            "rgb(118,143,199)",
            "rgb(156,142,195)",
            "rgb(185,149,195)",
            "rgb(195,190,222)",
            "rgb(141,204,221)",
            "rgb(136,173,216)"
          ];
          //把请求到的数据渲染到图中并且绑定对应的颜色
          var res = [];
          for (var i = 0; i < categoryArr.length; i++) {
            res.push({
              name: categoryArr[i],
              value: response.data.dataMap[categoryArr[i]],
              itemStyle: { normal: { color: catrgoryColor[i] } }
            });
          }
          res.sort(function(a, b) {
            return a.value - b.value;
          }),
            (option.series[0].data = res);
          myChart2.setOption(option);

          myChart2.hideLoading();
        }
      });
    },
    updateCPUAndMemmory() {
      var cpu;
      var memory;
      if (this.isUpdateCPUAndMemmory) {
        this.$http({
          url: "superadmindatastatistics/getCPUAndMemoryData",
          method: "post"
        }).then(response => {
          if (response.data.success == true) {
            cpu = response.data.CPU;
            memory = response.data.Memory;

            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3"),
              "macarons"
            );
            var option3 = myChart3.getOption();
            this.memoryData.push(memory);

            if (this.memoryData.length > 50) {
              this.memoryData.shift();
            }
            option3.series[0].data = this.memoryData;

            myChart3.setOption(option3,true);
            myChart3.hideLoading();

            let myChart5 = this.$echarts.init(
              document.getElementById("myChart5"),
              "macarons"
            );
            var option5 = myChart5.getOption();
            this.cpuData.push(cpu.toFixed(2));
            if (this.cpuData.length > 50) {
              this.cpuData.shift();
            }
            option5.series[0].data = this.cpuData;
            myChart5.setOption(option5,true);
            myChart5.hideLoading();
          } else {
            this.$toast.fail(response.data.errMsg);
            this.isUpdateCPUAndMemmory = false;
          }
        });
      }
    },
    //获取当天订单数量和销售额
    getOrderData(createTime) {
      this.order.createTime = createTime;
      this.$http({
        url: "superadmindatastatistics/getOrderData",
        method: "post",
        data: this.order
      }).then(response => {
        if (response.data.success == true) {
          this.totalPrice = response.data.totalPrice;

          this.orderCount = response.data.orderCount;
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    },
    getProductData() {
      this.product.createTime = this.Common.format3(new Date().getTime());
      var productCreateTimeData = new FormData();
      productCreateTimeData.append("createTime", this.product.createTime);
      this.$http({
        url: "superadmindatastatistics/getProductData",
        method: "post",
        data: productCreateTimeData
      }).then(response => {
        if (response.data.success == true) {
          this.productCount = response.data.productCount;
        } else {
          this.$toast.fail(response.data.errMsg);
        }
      });
    }
  }
};
</script>