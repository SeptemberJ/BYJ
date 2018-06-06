
var app = {};
var Url = 'https://jingshangs.com/BYJJK/' //http://139.196.80.116:8080/BYJJK/

var IfSigned = false
var openid = ''
//openid
window.onpageshow = function(event){
    if (event.persisted) {
    window.location.reload();
    }
}

function GetRequest() {
    return QueryString.data;
    //添加数据$.session.set('key', 'value')删除数据$.session.remove('key');获取数据$.session.get('key');清除数据$.session.clear();
}
QueryString = {
        data: {},
        Initial: function () {
            var aPairs, aTmp;
            var queryString = new String(window.location.search);
            queryString = queryString.substr(1, queryString.length); //remove   "?"     
            aPairs = queryString.split("&");
            for (var i = 0; i < aPairs.length; i++) {
                aTmp = aPairs[i].split("=");
                this.data[aTmp[0]] = aTmp[1];
            }
        },
        GetValue: function (key) {
            return this.data[key];
        }
    }
QueryString.Initial();

$(document).ready(function() {
    //var base = new Base64(); 
    
    $('#open_id').val(GetRequest()["openid"]);
    openid = GetRequest()["openid"];
    localStorage.setItem("openid",openid)

})
    


//openid

app.index = {
    template: "#index",
    data: function () {
        return {
            schoolList:['上海大学','厦门大学']
        }
    },
    created: function () {
        axios.get(Url + 'serSign?open_id=' + GetRequest()["openid"]
        ).then((res)=> {
            if(res.data.code == 1){
                    IfSigned = true
                    localStorage.setItem("IfSigned",true)
                    this.$router.push({
                        path: '/success'
                //         // query: {activity: JSON.stringify(this.pageData[index])}
                    })
            }
        }).catch((error)=> {
            console.log(error)
        })

    },
    methods: {
        gotoApply() {

                this.$router.push({
                    path: '/apply',
                    // query: {activity: JSON.stringify(this.pageData[index])}
                })
            
            
        }
    }
}

app.apply = {
    template: "#apply",
    data: function () {
        var validateAddress = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('商品ID不能为空'));
            }
            // setTimeout(() => {
            let nums = value.replace('\n','').split(',')
            if (nums.length >100) {
                callback(new Error('商品ID每次最多导入100个'));
            }
            for (let i=0;i<nums.length;i++) {
                if (isNaN(nums[i])) {
                    callback(new Error('只能纯数字以英文逗号进行隔开'));
                }
            }
        }

        return {
            ProvinceList:[],
            CityList:[],
            CityId:'',
            SchoolList:[],
            AddressProvinceList:[],
            AddressCityList:[],
            AddressAreaList:[],
            form: {
                province:'',
                city:'',
                school:'',
                college:'',
                profession:'',
                class:'',
                name:'',
                mobile:'',
                address:{
                    province:'',
                    city:'',
                    area:'',
                    add:''
                },
                identity:'',
                quotation:'',
                identityPic:''
            },
            rules:{
                province: [
                    { required: true, message: '请选择省份', trigger: 'change' },
                    // {validator: validateProvince, trigger: 'change'}
                ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                school: [
                    { required: true, message: '请选择学校', trigger: 'change' },
                ],
                college: [
                    { required: true, message: '请输入学院', trigger: 'blur' },
                ],
                profession: [
                    { required: true, message: '请输入专业', trigger: 'blur' },
                ],
                class: [
                    { required: true, message: '请选择班级', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入申领人姓名', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入联系人电话', trigger: 'blur' },
                    // { type: 'mphone', message: '请输入正确的联系人电话', trigger: ['blur', 'change'] }
                ],
                // addressProvince: [
                //     {required: true, message: '请选择收货省地址', trigger: 'change'},
                // ],
                // addressCity: [
                //     {required: true, message: '请选择收货市地址', trigger: 'change'},
                // ],
                // addressArea: [
                //     {required: true, message: '请选择收货区地址', trigger: 'change'},
                // ],
                // addressName: [
                //     {required: true, message: '请选择收货详细地址', trigger: 'blur'},
                // ],
                identity: [
                    {required: true, message: '请上传证件信息', trigger: 'blur'},
                ],
                quotation: [
                    {required: true, message: '请上传你的江湖语录', trigger: 'blur'},
                ]
            }
        }
    },
    created: function () {
        if(localStorage.getItem("dataInfo")){
            console.log(JSON.parse(localStorage.getItem("dataInfo")))
            this.form = JSON.parse(localStorage.getItem("dataInfo"))

        }
        
        axios.get(Url + 'provinceList'
        ).then((res)=> {
            this.ProvinceList = res.data.provinceList
        }).catch((error)=> {
        console.log(error)
        })
        this.GetAddressProvinceList()

    },
    mounted: function () {
        var self = this
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            // document.getElementById("goToUpload").onblur(function () {
            //     console.log('sssss')
            // })

            if (this.$route.query && this.$route.query.quotation) {
                self.form.quotation = this.$route.query.quotation
            }
        })
        if(JSON.parse(localStorage.getItem("dataInfo")).identityPic){
            document.getElementById("identityPicTip").style.display = 'none'
        }
        
        document.getElementById("identityPic").style.backgroundImage = 'url('+JSON.parse(localStorage.getItem("dataInfo")).identityPic+')'
    },
    watch: {
            // 'form.province': function () {
            //     this.form.city = ''
            //     this.updateCity()
            // },
            // 'form.city': function () {
            //     this.updateSchool()
            // },
        },
    methods: {
        submitForm(formName) {
            
            var self = this
            let isSuccess = true
            var DATA = {
                fprovince:this.form.province,
                fcity:this.form.city,
                fschool:this.form.school,
                xueyuan:this.form.college,
                fprofessional:this.form.profession,
                fclass:this.form.class, //--------
                fname:this.form.name,
                fmobile:this.form.mobile,
                sh_province:this.form.address.province,
                sh_city:this.form.address.city,
                sh_area:this.form.address.area,
                sh_address:this.form.address.name,
                fpic:this.form.identity,
                yulu:this.form.quotation,
                open_id:localStorage.getItem("openid")
            };
            console.log(DATA)
            this.$refs.form.validate((valid) => {
                if(!valid){
                    isSuccess = false;
                    return false;
                }
            });
            if (!isSuccess) {
                return
            }
            
            axios.post(Url + 'insertSign',DATA
              ).then((res)=> {
                const loadingSubmit =this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)',
                  target: document.querySelector('.div1')
                });
                if(res.data.code == 0){
                        this.$router.push({
                            path: '/success'
                    //         // query: {activity: JSON.stringify(this.pageData[index])}
                        })
                    loadingSubmit.close()
                }
              }).catch((error)=> {
                console.log(error)
                loadingSubmit.close()
              })


        //     this.$router.push({
        //         path: '/success'
        // //         // query: {activity: JSON.stringify(this.pageData[index])}
        //     })
        },
        updateCity(){
            var that = this
            this.ProvinceList.map(function(item,idx){
                if(item.pr_province == that.form.province){
                    that.GetCityList(item.pr_id)
                }
            })
        },
        updateSchool(){
            var that = this
            this.CityList.map(function(item,idx){
                if(item.ci_city == that.form.city){
                    that.GetSchoolList(item.ci_id)
                }
            })
        },
        GetCityList(ProvinceId){
            axios.get(Url + 'cityList?provinceid=' + ProvinceId
            ).then((res)=> {
                this.CityList = res.data.cityList
            }).catch((error)=> {
                console.log(error)
            })
        },
        GetSchoolList(CityId){
            axios.get(Url + 'schoolList?cityid=' + CityId
            ).then((res)=> {
                this.SchoolList = res.data.schoolList
            }).catch((error)=> {
                console.log(error)
            })
        },
        GetAddressProvinceList(){
            axios.get(Url + 'ssqList?ssqid=' + 0
            ).then((res)=> {
                this.AddressProvinceList = res.data.ssqList
            }).catch((error)=> {
                console.log(error)
            })
        },
        GetAddressCityList(ProvinceId){
            axios.get(Url + 'ssqList?ssqid=' + ProvinceId
            ).then((res)=> {
                this.AddressCityList = res.data.ssqList
            }).catch((error)=> {
                console.log(error)
            })
        },
        GetAddressAreaList(CityId){
            axios.get(Url + 'ssqList?ssqid=' + CityId
            ).then((res)=> {
                this.AddressAreaList = res.data.ssqList
            }).catch((error)=> {
                console.log(error)
            })
        },
        //
        onChangeProvince(){
            this.form.city = ''
            this.form.school = ''
            this.updateCity()

        },
        onChangeCity(){
            this.form.school = ''
            this.updateSchool()
        },
        onChangeSchool(e){
            console.log(e)
        },
        onChangeAdProvince(e){
            var that = this
            this.AddressProvinceList.map(function(item,idx){
                if(item.areaname == e){
                    that.GetAddressCityList(item.id)
                }
            })
            this.form.address.city = ''
            this.form.address.area = ''
             // sh_province:this.form.address.province,
             //    sh_city:this.form.address.city,
             //    sh_area:this.form.address.area,
        },
        onChangeAdCity(e){
            var that = this
            this.AddressCityList.map(function(item,idx){
                if(item.areaname == e){
                    that.GetAddressAreaList(item.id)
                }
            })
            this.form.address.area = ''
        },
        onChangeAdArea(e){
            
        },

        onRead(File) {
            //this.form.identity = File.file.name
            const loadingItem =this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
              target: document.querySelector('.div1')
            });
            var that2 = this
            var FileData = File.content
            this.form.identityPic = File.content
            document.getElementById("identityPic").style.backgroundImage = 'url('+File.content+')'
            document.getElementById("identityPicTip").style.display = 'none'

            var file = File.file
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function() {
              img.src = this.result
            }
            var img = new Image,
              width = 1024, //image resize   压缩后的宽
              quality = 0.8, //image quality  压缩质量
              canvas = document.createElement("canvas"),
              drawer = canvas.getContext("2d");
            img.onload = function() {
              canvas.width = 500;
              canvas.height = 500;;
              drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
              //上传到七牛云
              var base64 = canvas.toDataURL("image/jpeg", quality); // 这里就拿到了压缩后的base64图片
              var FileData = {
                imgStr:base64.replace(/^data:image\/(jpeg|png|gif|jpeg);base64,/,'')
                }

                axios.post(Url + 'uploadBase64',Qs.stringify(FileData)
                ).then((res)=> {
                    if(res.data.code == 0){
                        that2.form.identity = res.data.fileName
                       
                        loadingItem.close();
                    }
                }).catch((error)=> {
                    console.log(error)
                    loadingItem.close();
                })
              }

            
        },
        OnErrorPic(){
            // this.$alert('图片太大');
        },
        goToUpload() {
            localStorage.setItem('dataInfo',JSON.stringify(this.form))
            this.$router.push({
                path: '/upload'
                //         // query: {activity: JSON.stringify(this.pageData[index])}
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        openImage() {
            this.$alert('<img src="https://wxmms.swissems.cn/byj/example.jpg" style="width:100%"/>', '学生证图片范例', {
                dangerouslyUseHTMLString: true
            });
        }
    }
}

app.upload={
    template: "#upload",
    data: function () {
        return {
            name:'',
            quotation:'',
            quote:['为什么毕业要选在夏天？可能这季节眼泪蒸发得比较快。','六月，有人笑着说解脱，有人哭着说不舍','堂堂七尺男儿，扛得住挂科的压力，却扛不住离别的忧伤。','四年时光是最好的下酒菜，吃散伙饭时每个人的酒量都因此变得很好。','同学就是：来时五湖四海，离时天各一方。'],
            num:0,
            selectedData:'为什么毕业要选在夏天？可能这季节眼泪蒸发得比较快。',
            imagePath:'image/P5/know.png',
            check:true
        }
    },
    methods:{
        toPre() {
            if (this.num && this.num > 0) {
                this.num--
                this.selectedData = this.quote[this.num]
                // this.quotation = this.quote[this.num]
            }  else {
                this.selectedData = this.quote[0]
                // this.quotation = this.quote[0]
            }

        },
        toNext() {
            if (this.num < this.quote.length-1) {
                this.num++
                this.selectedData = this.quote[this.num]
                // this.quotation = this.quote[this.num]
            } else {
                this.selectedData = this.quote[this.quote.length-1]
                // this.quotation = this.quote[this.quote.length-1]
            }


        },
        goBack() {
            axios.get(Url + 'serSign?open_id=' + GetRequest()["openid"]
            ).then((res)=> {
                if(res.data.code == 1){
                    this.$router.push({
                        path: '/success',
                        //query: {quotation: self.quotation, name: self.name}
                    })
                }else{
                    this.$router.go(-1)
                }
            }).catch((error)=> {
                console.log(error)
            })
        },
        change() {
            this.check = !this.check
            if (this.check) {
                this.imagePath = 'image/P5/know.png'
            } else {
                this.imagePath = 'image/P5/nocheck.png'
            }
        },
        success() {
            var self = this
            if (!this.check) {
                this.$notify({
                    title: '',
                    message: '勾选后才可正常提交',
                    type: 'warning'
                });
                return
            }
            if(this.quotation == '' || this.quotation == 'undefined'){
                this.$notify({
                    title: '',
                    message: '请填写语录！',
                    type: 'warning'
                });
                return
            }
            var DATA = {
                yulu: this.quotation,
                open_id:localStorage.getItem("openid")
            }
            axios.get(Url + 'serSign?open_id=' + GetRequest()["openid"]
            ).then((res)=> {
                const loadingyulu =this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)',
                  target: document.querySelector('.div1')
                });
                if(res.data.code == 1){
                        axios.post(Url + 'insertSignEntry',DATA
                          ).then((res)=> {
                            if(res.data.code == 0){
                                this.$router.push({
                                path: '/success',
                                //query: {quotation: self.quotation, name: self.name}
                            })
                            }
                          }).catch((error)=> {
                            console.log(error)
                          })
                          loadingyulu.close()
                }else{
                    this.$router.push({
                        path: '/apply',
                        query: {quotation: self.quotation, name: self.name}
                    })
                    loadingyulu.close()
                }
            }).catch((error)=> {
                console.log(error)
                loadingyulu.close()
            })
            // if(localStorage.getItem("IfSigned")){
            //     axios.post(Url + 'insertSignEntry',DATA
            //       ).then((res)=> {
            //         if(res.data.code == 0){
            //             this.$router.push({
            //             path: '/success',
            //             //query: {quotation: self.quotation, name: self.name}
            //         })
            //         }
            //       }).catch((error)=> {
            //         console.log(error)
            //       })

            // }else{
            //     this.$router.push({
            //         path: '/apply',
            //         query: {quotation: self.quotation, name: self.name}
            //     })
            // }
        }
    }
}

app.success={
    template: "#success",
    data: function () {
        return {
        }
    },
    methods:{
        gotoApply() {
            this.$router.push({
                path: '/upload'
                //         // query: {activity: JSON.stringify(this.pageData[index])}
            })
        }
    }
}

app.pageChange={
    template: "#page",
    data: function () {

    },
}

Vue.component('index', app.index);

