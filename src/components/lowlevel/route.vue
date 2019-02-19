<template>
  <div>

    <noticeinformation ref="noticeinformation"></noticeinformation>
   <Button type="primary" @click="queryRoutelist">刷新列表</Button>  <Button type="primary" @click="openAddRouteModal">添加路由</Button>
    <br><br>

    <Table border :columns="routes" :data="routesdata"></Table>

    <Modal
      v-model="addOrUpdateRouteModal"
      title="添加服务"
      width="700"
      :loading="loading"
      @on-ok="addOrUpdateRouteConfirm('routeform')"
      @on-cancel="addOrUpdateRouteCancel" 
    >
      <Form ref="routeform" :model="routeform" :rules="routeValidate" :label-width="150" >
        <FormItem prop="name" label="路由名称">
          <Input v-model="routeform.name" placeholder="服务名称"></Input>
        </FormItem>

          <serviceselector
            v-model="pluginform.service.value"
            :placeholder="pluginform.service.placeholder"
          ></serviceselector>

        <!-- <FormItem prop="retries"  label="重试次数">
          <Input v-model="routeform.retries" placeholder="5"></Input>
        </FormItem> -->
        
        <FormItem prop="protocol"  label="协议">
          <Select v-model="routeform.protocol" >
            <Option v-for="item in protocols" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        
        <FormItem prop="hosts"  label="虚拟主机">
          <Input v-model="routeform.host" placeholder="虚拟主机"></Input>
        </FormItem>

        <!-- <FormItem prop="port"  label="上游服务端口">
          <Input v-model="routeform.port" placeholder="上游服务端口,例如80"></Input>
        </FormItem> -->

        <FormItem prop="paths"  label="路径">
          <Input v-model="routeform.path" placeholder="路径"></Input>
        </FormItem>

        <FormItem prop="paths"  label="路径">
          <Input v-model="routeform.path" placeholder="路径"></Input>
        </FormItem>

        <FormItem prop="connect_timeout"  label="链接超时时间">
          <Input v-model="routeform.connect_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>

        <FormItem prop="write_timeout"  label="请求上游服务超时时间">
          <Input v-model="routeform.write_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>
        <FormItem prop="read_timeout"  label="读取上游服务超时时间">
          <Input v-model="routeform.read_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>
      </Form>
    </Modal>
    
    <Modal
      v-model="deleteRouteModal"
      title="删除服务"
      width="500"
      :loading="loading"
      @on-ok="deleteRouteConfirm('toDeleteRoute')"
      @on-cancel="delRouteCancel" 
    >
    确认删除路由：{{toDeleteRoute.name}} ？
   </Modal>



  </div>
</template>
<script>
import kongadmin from "@/utils/kongadmin";

export default {
  name: "routemgmt",
  description: "",

  data() {
    return {
      addOrUpdateRouteModal: false,
      deleteRouteModal: false,

      msg: "route mgmt",
      toDeleteRoute:{
      name:'',
      id:''
    },
    toUpdateRoute:{
      name:'',
      id:''
    },
      routeform: {
        name: '',
       //retries:'5',
       // id:null,
        protocols:'',
        hosts:'',
      //  port:'80',
        paths:'',
        connect_timeout:'60000',
        write_timeout:'60000',
        read_timeout:'60000'
      },
      routeValidate: {

        name: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],

        retries: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        protocol: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        host: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],        
        
        port: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],      
        
        connect_timeout: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],            
        write_timeout: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],    
        read_timeout: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]                
      },
      protocols: [
        { value: "http", label: "http" },
        { value: "https", label: "https" }
      ],

      routesdata: [],
      routes: [
        // {
        //   title: "route ID",
        //   key: "id",
        //   width: 290
        // },
        {
          title: "协议",
          key: "protocols",
          width: 90
        },
        {
          title: "访问主机",
          key: "hosts",
          width: 150
        },
        {
          title: "请求方法",
          key: "methods",
          width: 100
        },

        {
          title: "路径",
          key: "path",
          width: 100
        },

        {
          title: "关联服务",
          key: "service",
          width: 200
        },

        {
          title: "strip path",

          key: "strip_path",

          width: 90
        },

        {
          title: "regex priority",

          key: "regex_priority",

          width: 100
        },

        {
          title: "preserve host",

          key: "preserve_host",

          width: 100
        },
        {
          title: "创建时间 ",

          key: "created_at",

          width: 100,
                              render:(h,params) =>{               
               //console.log(params)
              return h("span",{},kongadmin.changeDatetoString(params.row.updated_at))

          }
        },

        {
          title: "更新时间",

          key: "updated_at",

          width: 100,
                              render:(h,params) =>{               
               //console.log(params)
              return h("span",{},kongadmin.changeDatetoString(params.row.updated_at))

          }
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
                      this.modal1 = true; //this.ok(params)
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
    };
  },
  created: function() {
    console.log("route mgmt created")

    var success = function(response, component) {
      console.log(component)
      component.routesdata = response.data.data
    }

    var fail = function(response, component) {
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      )
    }
    kongadmin.getRoutes(success, fail, this)
  },

  methods: {
    ok() {
      this.$Message.info("Clicked ok")
    },
    cancel() {
      this.$Message.info("Clicked cancel")
    }
    ,
  openAddRouteModal(){

    this.addOrUpdateRouteModal = true

  },
  queryRoutelist(){


  }

  }


}
</script>
<style scoped>
code {
}
</style>
