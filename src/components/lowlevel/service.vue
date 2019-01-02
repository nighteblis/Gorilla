<template>
  <div>
    <br>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <br>
    <Button type="primary" @click="addService">添加服务</Button>

    <Table border :columns="services" :data="servicesdata"></Table>

    <Modal
      v-model="addServiceWindow"
      title="添加服务"
      width="700"
      @on-ok="addServiceConfirm"
      @on-cancel="addServiceCancel" 
    >
      <Form :model="serviceform" :rules="serviceValidate" :label-width="150" >
        <FormItem prop="name" label="服务名称">
          <Input v-model="serviceform.name" placeholder="服务名称"></Input>
        </FormItem>
        <FormItem prop="retries"  label="重试次数">
          <Input v-model="serviceform.retries" placeholder="5"></Input>
        </FormItem>
        <FormItem prop="protocol"  label="协议">
          <Select v-model="serviceform.protocol" multiple >
            <Option v-for="item in protocols" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="host"  label="上游服务">
          <Input v-model="serviceform.host" placeholder="上游服务"></Input>
        </FormItem>
        <FormItem prop="port"  label="上游服务端口">
          <Input v-model="serviceform.port" placeholder="上游服务端口,例如80"></Input>
        </FormItem>
        <FormItem prop="path"  label="上游服务路径">
          <Input v-model="serviceform.path" placeholder="上游服务路径(可选)"></Input>
        </FormItem>

        <FormItem prop="connect_timeout"  label="链接超时时间">
          <Input v-model="serviceform.connect_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>

        <FormItem prop="write_timeout"  label="请求上游服务超时时间">
          <Input v-model="serviceform.write_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>
        <FormItem prop="read_timeout"  label="读取上游服务超时时间">
          <Input v-model="serviceform.read_timeout" placeholder="60000单位毫秒"></Input>
        </FormItem>
      </Form>
    </Modal>
    
  </div>
</template>
<script>
import kongadmin from "@/utils/kongadmin";

export default {
  name: "servicemgmt",
  description: "",

  data() {
    return {
      serviceform: {
        name: "",
        retries:'5',
        protocol:'',
        host:'',
        port:'',
        path:'',
        connect_timeout:'60000',
        write_timeout:'60000',
        read_timeout:'60000'


      },
      serviceValidate: {
        retries: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],
        protocol: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],
        host: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],        
        
        port: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],      
        
        connect_timeout: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],            
        write_timeout: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ],    
        read_timeout: [
          {
            required: true,
            message: "cannot be empty",
            trigger: "blur"
          }
        ]                
      },
      protocols: [
        { value: "http", label: "http" },
        { value: "https", label: "https" }
      ],

      addServiceWindow: false,

      servicesdata: [],

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
                      this.addServiceWindow = true; //this.ok(params)
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
                      //this.cancel();
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

    var recallhandler = function(response, component) {
      if(response.status == 200 || response.status == 201){
      component.servicesdata = response.data.data;
      }
      else{
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      )
      }

    }

    kongadmin.getServices(recallhandler, recallhandler, this);


  },

  methods: {
    changeDatetoString(date) {
      return new Date(date);
    },
    addService() {
      this.addServiceWindow = true;
    },
    addServiceConfirm(){

          var recallhandler = function(response, component) {
      if(response.code == 200 || response.code == 201){
            this.created()
      }
      else{
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      )
      }

    }


    kongadmin.addService(this.serviceform,recallhandler, recallhandler, this);


    },
    addServiceCancel(){

    }
  }
};
</script>
<style scoped>
code {
}
</style>
