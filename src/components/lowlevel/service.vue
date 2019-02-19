<template>
  <div>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <Button type="primary" @click="queryServices">刷新列表</Button> <Button type="primary" @click="openAddServiceForm">添加服务</Button>
    <br><br>
    <Table border :columns="services" :data="servicesdata"></Table>

    <Modal
      v-model="addServiceWindow"
      title="添加服务"
      width="700"
      :loading="loading"
      @on-ok="addOrUpdateServiceConfirm('serviceform')"
      @on-cancel="addOrUpdateServiceCancel" 
    >
      <Form ref="serviceform" :model="serviceform" :rules="serviceValidate" :label-width="150" >
        <FormItem prop="name" label="服务名称">
          <Input v-model="serviceform.name" placeholder="服务名称"></Input>
        </FormItem>
        <FormItem prop="retries"  label="重试次数">
          <Input v-model="serviceform.retries" placeholder="5"></Input>
        </FormItem>
        <FormItem prop="protocol"  label="协议">
          <Select v-model="serviceform.protocol" >
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
    
    <Modal
      v-model="deleteServiceWindow"
      title="删除服务"
      width="500"
      :loading="loading"
      @on-ok="deleteServiceConfirm('toDeleteService')"
      @on-cancel="delServiceCancel" 
    >
    确认删除服务：{{toDeleteService.name}} ？
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
      serviceformDefault:null,
      serviceform: {
        name: '',
        retries:'5',
       // id:null,
        protocol:'',
        host:'',
        port:'80',
        path:'',
        connect_timeout:'60000',
        write_timeout:'60000',
        read_timeout:'60000'
      },
      serviceValidate: {

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

      addServiceWindow: false,
      isAddService:false,
      loading:true,
      deleteServiceWindow:false,
      toDeleteService:{
      name:'',
      id:''
    },
    toUpdateService:{
      name:'',
      id:''
    },


      servicesdata: [],

      services: [
        {
          title: "服务名称",
          key: "name",
            width: 150
        },

        // {
        //   title: "ID",
        //   key: "id",

        //   width: 290
        // },

        {
          title: "服务协议",

          key: "protocol",

          width: 90
        },        {
          title: "服务地址",

          key: "host",

          width: 200
        },        {
          title: "端口",

          key: "port",

          width: 100
        },        {
          title: "路径",

          key: "path",

          width: 100
        },
        {
          title: "重试次数",

          key: "retries",
          width: 90
        },
                {
          title: "链接超时",

          key: "connect_timeout",

          width: 100
        },
        {
          title: "读取超时",

          key: "read_timeout",

          width: 90
        },
        {
          title: "写超时",

          key: "write_timeout",

          width: 90
        },


        {
          title: "更新时间",

          key: "updated_at",

          width: 170,
                    render:(h,params) =>{               
               //console.log(params)
              return h("span",{},kongadmin.changeDatetoString(params.row.updated_at))

          }
        },
        {
          title: "创建时间 ",

          key: "created_at",

          width: 170,
          render:(h,params) =>{               
               //console.log(params)
              return h("span",{},kongadmin.changeDatetoString(params.row.created_at))

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

                      this.openUpdateServiceForm(params)
                      //this.addServiceWindow = true; //this.ok(params)
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
                      this.openDeleteServiceConfirm(params.row)
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
    this.serviceformDefault = JSON.stringify(this.serviceform)

    this.queryServices()

  },

  methods: {
    
    changeDatetoString(date) {
      return new Date(date);
    },

    openAddServiceForm() {
      this.addServiceWindow = true
      this.isAddService=true
    },
    addOrUpdateServiceConfirm(serviceform){

      
      // check form before confirm post.
              this.$refs[serviceform].validate((valid) => {
                    if (valid) {

                      var formdata = JSON.stringify(this.serviceform)
                      formdata = JSON.parse(formdata)
                      this.convertToPostJson(formdata)


                      if(this.isAddService)
                      kongadmin.addService(formdata,this.recallhandler, this.recallhandler, this);

                      else
                      {
                        console.log(this.toUpdateService.id)
                        console.log(formdata)
                        kongadmin.updateService(this.toUpdateService.id,formdata,this.recallhandler, this.recallhandler, this);
                      }

                    } else {
                        this.$Message.error('请输入必填参数')
                        this.changeLoading()                     
                    }
                })     




    },

    changeLoading() {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          },

    addOrUpdateServiceCancel(){
        this._reset()
    },

    deleteServiceConfirm(serviceName){
       
       kongadmin.deleteService(this.toDeleteService.id,this.recallhandler, this.recallhandler, this);

    },

    delServiceCancel(){
        this._reset()
    }
  ,
  openUpdateServiceForm(params){

    this.isAddService=false
    this.addServiceWindow = true

    this.toUpdateService.name = params.row.name
    this.toUpdateService.id = params.row.id

    this.serviceform.retries = params.row.retries+''
    this.serviceform.name = params.row.name
    this.serviceform.protocol = params.row.protocol
    this.serviceform.host = params.row.host
    this.serviceform.port = params.row.port+''
    this.serviceform.path = params.row.path
    this.serviceform.connect_timeout = params.row.connect_timeout+''
    this.serviceform.write_timeout = params.row.write_timeout+''
    this.serviceform.read_timeout = params.row.read_timeout+''



  },
  openDeleteServiceConfirm(params){

     console.log(params)
     this.toDeleteService.name = params.name
     this.toDeleteService.id = params.id
      this.deleteServiceWindow = true

  },
  convertToPostJson(data)  // remove null values and convert integer string to integer
  {

               Object.keys(data).forEach(function(key) {
                
                if(data[key] == null )  delete data[key]
                if(!isNaN(data[key]))  data[key] = parseInt(data[key])
                  
              })
                                        
  }
  ,
  recallhandler(response, component){
      
      //console.log(response)

      if(response.status == 200 || response.status == 201 || response.status == 204){
        console.log(component)
            component.queryServices()            
      }
      else{

      component.$refs.noticeinformation.showalert(
        "error",
        response.data.message
      )
      }
        component.addServiceWindow = false
        component.deleteServiceWindow = false
        component._reset()

    }

  ,

  _reset(){
       this.serviceform = JSON.parse(this.serviceformDefault)
    
  },
  
  queryServices(){

    var queryrecallhandler = function(response, component) {
      if(response.status == 200 ){
      component.servicesdata = response.data.data;
      }
      else{
      component.$refs.noticeinformation.showalert(
        "error",
        response.data
      )
      }

    }

    kongadmin.getServices(queryrecallhandler, queryrecallhandler, this);

  }


  }
}
</script>
<style scoped>
code {
}
</style>
