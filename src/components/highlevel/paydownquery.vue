<template>
<div>

<Input v-model="payorderno" placeholder="输入用户首付款订单编号pay_order_no" style="width: 300px" />

<Button type="primary" @click="handleSubmit(false)"> 查询首付款订单 </Button>

<br/>
<noticeinformation ref="noticeinformation"></noticeinformation>
<br/>

<Table border :columns="columns2" :data="data2"></Table>


<Divider />
<Table border :columns="columns" :data="data"></Table>


</div>
</template>
<script>

export default {
  name: 'paydownquery',
  description:'首付款查询',
  data () {
    return {

      msg: 'payorderno query',
      payorderno:'',
      data:[],
      columns:[{
                        title: 'JobId',
                        key: 'id',
                        width:100
                    },
                    {
                        title: 'Job名称',
                        key: 'machine_status'
                    },
                    {
                        title: '代理串号',
                        key: 'proxy_serial_no'
                    },
                    {
                        title: 'Job状态',
                        key: 'job_status',
                        width:90
                    },
                    {
                        title: '错误',
                        key: 'last_error'
                    },
                    {
                        title: '执行次数',
                        key: 'execute_times',
                        width:90
                    },
                    {
                        title: 'job参数',
                        key: 'job_param',
                        width: 300
                    },                    {
                                            title: 'Action',
                                            key: 'action',
                                            width: 200,
                                            align: 'center',
                                            render: (h, params) => {
                                                return h('div', [
                                                    h('Button', {
                                                        props: {
                                                            type: 'primary',
                                                            size: 'small'
                                                        },
                                                        style: {
                                                            marginRight: '5px'
                                                        },
                                                        on: {
                                                            click: () => {
                                                                this.initjob(params)
                                                            }
                                                        }
                                                    }, '重新执行'),
                                                    h('Button', {
                                                        props: {
                                                            type: 'primary',
                                                            size: 'small'
                                                        },
                                                        style: {
                                                            marginRight: '5px'
                                                        },
                                                        on: {
                                                            click: () => {
                                                                this.failjob(params)
                                                            }
                                                        }
                                                    }, '置为失败')
                                                ]);
                                            }
                                        }


                    ],
            data2:[],
            columns2:[{"title":"业务方订单编号","key":"partner_order_no"},{title:'代理串号',key:'proxy_serial_no'},
            {title:'首付款金额',key:'amount'},{title:'是否退款',key:'order_lanuch_type'},
              {title:'支付渠道',key:'pay_channel'},
         {title:'账务检查结果',key:'payment_sms_check_status'},
         {title:'支付状态结果',key:'payment_confirm_status'},
         {title:'账务上报结果',key:'account_report_status'},
         {title:'备注',key:'comments',    render: (h, params) => {
               return h('div', [
                   '2:成功 0:初始化 1:处理中 其他:失败|'
               ]);
           }}
    ]
    }
  },
  methods:{






handleSubmit(showoriginalalert){

if(this.payorderno == ''){

this.$refs.noticeinformation.showalert('error','未输入首付款订单编号')

return
}


  console.log(this)
  console.log(this.$selectedEnv)

  var uri = 'http://172.16.2.39:7280/api/sql/'+this.$store.state.selectedEnv+'/proxy'
  console.log(uri)

  this.axios.post(uri,
   {"sql":"select * from job where proxy_serial_no = (select proxy_serial_no from user_down_payment where partner_order_no = '"+this.payorderno+"')"}
 )
 .then(response => {
 console.log(response)

 if( response.data.status != 0 ) {
     this.$refs.noticeinformation.showalert('error',response.data.message)
 }
 else
 {
if(!showoriginalalert)
this.$refs.noticeinformation.showalert('success','查询成功')
 this.data=response.data.data
 }


 })
 .catch(e => {

 console.log(e)

 })

// select from user_loan Table

 uri = 'http://172.16.2.39:7280/api/sql/'+this.$store.state.selectedEnv+'/proxy'
 console.log(uri)

 this.axios.post(uri,
  {"sql":"select * from user_down_payment where partner_order_no = '"+this.payorderno+"'"}
 )
 .then(response => {
 console.log(response)

 if( response.data.status != 0 ) {
    this.$refs.noticeinformation.showalert('error',response.data.message)
 }
 else
 {

 if(!showoriginalalert)
   this.$refs.noticeinformation.showalert('success','查询成功')

   this.data2=response.data.data
 }


 })
 .catch(e => {

 console.log(e)

 })





}


}
}

</script>
<style scoped>

code{



}

</style>
