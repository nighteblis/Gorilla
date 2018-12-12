<template>
  <div>
    <br/>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <br/>

    <Button type="primary"  @click="addPlugin">添加插件</Button>

    <Table border :columns="services" :data="servicesdata"></Table>

    <Modal v-model="modal1" title="测试" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>

    <Modal v-model="addPluginWindow" title="添加插件" width="600" @on-ok="addPluginConfirm" @on-cancel="addPluginCancel">

          <Row>
        启用插件名称：
               <Col span="12"  >
             <Select v-model="pluginName" filterable>
                <Option v-for="item in pluginNames" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
         </Row>
         
        <Row>
         针对服务和路由：
               <Col span="12"  >
              <Select  v-model="serviceId" filterable>
                <Option v-for="item in serviceslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
                <Select  v-model="routeId" filterable>
                <Option v-for="item in routeslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
         </Row>

        <Row>
         针对消费者：
               <Col span="12" >
              <Select  v-model="consumerId" filterable>
                <Option v-for="item in rcomsumerslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
         </Row>

       <div>
       插件配置：

       <Input v-model="pluginConfig" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter configs">
       </Input>

    </div> 

    </Modal>

  </div>
</template>
<script>
export default {
  name: "pluginmgmt",
  description: "",

  data() {
    return {
      modal1: false,
      addPluginWindow:false,
      msg: 'plugin mgmt',
      pluginName:'',
      serviceId:'',
      routeId:'',
      consumerId:'',
      pluginConfig:'',

      pluginNames:[{value:'pre-function',label:'pre-function'}],

      serviceslist:[],

      routeslist:[{value:'91963006-01e4-4946-b24f-e1ce9144b2de',label:'router1'}],

      rcomsumerslist:[],

      servicesdata:[],

      services: [
        {
          title: "名称",

          key: "name"
        },

        {
          title: "ID",
          key: "id",

          width: 290
        },
        {
          title: "服务器",

          key: "host",

          width: 200
        },

        {
          title: "链接超时",

          key: "connect_timeout",

          width: 100
        },

        {
          title: "协议",

          key: "protocol",

          width: 90
        },

        {
          title: "读取超时",

          key: "read_timeout",

          width: 90
        },

        {
          title: "端口",

          key: "port",

          width: 100
        },

        {
          title: "路径",

          key: "path",

          width: 100
        },
        {
          title: "更新时间",

          key: "updated_at",

          width: 100
        },
        {
          title: "创建时间 ",

          key: "created_at",

          width: 100
        },

        {
          title: "重试",

          key: "retries",
          width: 90
        },

        {
          title: "写超时",

          key: "write_timeout",

          width: 90
        },

        {
          title: "操作",

          key: "action",

          width: 150,

          align: "center",

          fixed: "right",

          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",

                    size: "small"
                  },

                  style: {
                    marginRight: "5px"
                  },

                  on: {
                    click: () => {
                      this.modal1 = true //this.ok(params)
                    }
                  }
                },
                "更新"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "primary",

                    size: "small"
                  },

                  style: {
                    marginRight: "5px"
                  },

                  on: {
                    click: () => {
                      this.cancel()
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    }
  },
  created: function() {
    console.log("dashboard created")
    this.axios
      .get(this.$store.state.kongAdmin + "/plugins/")

      .then(response => {
        if ((response.status = "200")) {
          console.log(response)
          this.servicesdata = response.data.data
        } else {
          this.$refs.noticeinformation.showalert(
            "error",
            "kong 有异常请尽快修复"
          );
        }
      })

      .catch(e => {
        console.log(e)
      })
  },

  methods: {

    addPluginConfirm() {

  var uri = this.$store.state.kongAdmin +'/plugins/'
  console.log(this.serviceId)
  console.log(this.routeId)
  console.log(this.consumerId)
  console.log(this.pluginName)

  var s1= this.serviceId === '' ?  '' : 'service_id='+this.serviceId
  var s2= this.routeId === '' ?  '' : 'route_id='+this.routeId
  var s3= this.consumerId === '' ?  '' : 'consumer_id='+this.consumerId
  var s4= this.pluginName === '' ? '':'name='+this.pluginName
  var s5=this.pluginConfig === '' ? '':this.pluginConfig


  console.log(uri)

  this.axios.post(uri,this.checkAndGenerateWwwData(s1,s2,s3,s4,s5),{headers: {'content-type': 'application/x-www-form-urlencoded'}})
 .then(response => {
 console.log(response)

 if( response.data.status != 0 ) {
     this.$Message.info("error ?")
 }
 else
 {
     if(!showoriginalalert)
    this.$Message.info("Clicked ok")

 }


 })
 .catch(e => {

 console.log(e)

 })

      this.$Message.info("Clicked ok")
    },
    addPluginCancel() {
      this.$Message.info("Clicked cancel")
    },
    ok() {
      this.$Message.info("Clicked ok")
    },
    cancel() {
      this.$Message.info("Clicked cancel")
    },    
    changeDatetoString (date) {
      return new Date(date)
    },
    addPlugin(){

      console.log('add plugin...')
      this.addPluginWindow = true

    },
        checkAndGenerateWwwData(){

         var returnstring = ''
         for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
            if(arguments[i] === '' ) 
            {
                continue       
            }
            else{
               if(i===0)   returnstring += arguments[i]
               else returnstring += '&'+arguments[i]
            }        

          }

          console.log(returnstring = returnstring.replace(/^&+|&+$/g, ''))
          return returnstring

    }
  }
}
</script>
<style scoped>
code {
}
</style>
