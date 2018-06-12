
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
//share
var sha1;
(function (sha1) {
    var POW_2_24 = Math.pow(2, 24);
    var POW_2_32 = Math.pow(2, 32);

    function hex(n) {
        var s = "",
            v;
        for (var i = 7; i >= 0; --i) {
            v = (n >>> (i << 2)) & 15;
            s += v.toString(16);
        }
        return s;
    }

    function lrot(n, bits) {
        return ((n << bits) | (n >>> (32 - bits)));
    }
    var Uint32ArrayBigEndian = (function () {
        function Uint32ArrayBigEndian(length) {
            this.bytes = new Uint8Array(length << 2);
        }
        Uint32ArrayBigEndian.prototype.get = function (index) {
            index <<= 2;
            return (this.bytes[index] * POW_2_24) + ((this.bytes[index + 1] << 16) | (this.bytes[index + 2] << 8) | this.bytes[index + 3]);
        };
        Uint32ArrayBigEndian.prototype.set = function (index, value) {
            var high = Math.floor(value / POW_2_24),
                rest = value - (high * POW_2_24);
            index <<= 2;
            this.bytes[index] = high;
            this.bytes[index + 1] = rest >> 16;
            this.bytes[index + 2] = (rest >> 8) & 255;
            this.bytes[index + 3] = rest & 255;
        };
        return Uint32ArrayBigEndian;
    })();

    function string2ArrayBuffer(s) {
        s = s.replace(/[\u0080-\u07ff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(192 | code >> 6, 128 | code & 63);
        });
        s = s.replace(/[\u0080-\uffff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
        });
        var n = s.length,
            array = new Uint8Array(n);
        for (var i = 0; i < n; ++i) {
            array[i] = s.charCodeAt(i);
        }
        return array.buffer;
    }

    function hash(bufferOrString) {
        var source;
        if (bufferOrString instanceof ArrayBuffer) {
            source = bufferOrString;
        } else {
            source = string2ArrayBuffer(String(bufferOrString));
        }
        var h0 = 1732584193,
            h1 = 4023233417,
            h2 = 2562383102,
            h3 = 271733878,
            h4 = 3285377520,
            i, sbytes = source.byteLength,
            sbits = sbytes << 3,
            minbits = sbits + 65,
            bits = Math.ceil(minbits / 512) << 9,
            bytes = bits >>> 3,
            slen = bytes >>> 2,
            s = new Uint32ArrayBigEndian(slen),
            s8 = s.bytes,
            j, w = new Uint32Array(80),
            sourceArray = new Uint8Array(source);
        for (i = 0; i < sbytes; ++i) {
            s8[i] = sourceArray[i];
        }
        s8[sbytes] = 128;
        s.set(slen - 2, Math.floor(sbits / POW_2_32));
        s.set(slen - 1, sbits & 4294967295);
        for (i = 0; i < slen; i += 16) {
            for (j = 0; j < 16; ++j) {
                w[j] = s.get(i + j);
            }
            for (; j < 80; ++j) {
                w[j] = lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var a = h0,
                b = h1,
                c = h2,
                d = h3,
                e = h4,
                f, k, temp;
            for (j = 0; j < 80; ++j) {
                if (j < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 1518500249;
                } else {
                    if (j < 40) {
                        f = b ^ c ^ d;
                        k = 1859775393;
                    } else {
                        if (j < 60) {
                            f = (b & c) ^ (b & d) ^ (c & d);
                            k = 2400959708;
                        } else {
                            f = b ^ c ^ d;
                            k = 3395469782;
                        }
                    }
                }
                temp = (lrot(a, 5) + f + e + k + w[j]) & 4294967295;
                e = d;
                d = c;
                c = lrot(b, 30);
                b = a;
                a = temp;
            }
            h0 = (h0 + a) & 4294967295;
            h1 = (h1 + b) & 4294967295;
            h2 = (h2 + c) & 4294967295;
            h3 = (h3 + d) & 4294967295;
            h4 = (h4 + e) & 4294967295;
        }
        return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4);
    }
    sha1.hash = hash;
})(sha1 || (sha1 = {}));

var companyId = 'a59e68f2d99744019f38d6864b55fc84';
var urlCode = 'ZHCS';
var appid = 'wx99fde7318286d01a';//'wx99fde7318286d01a';
var appsecret = 'd79c50de6a88c2b6386877ffb981a81f'//'d79c50de6a88c2b6386877ffb981a81f';
var mytimestamp = (Date.parse(new Date())) / 1000;
var mynonceStr = sha1.hash(String(mytimestamp)).substring(0, 16);
var mywxjsapi_ticket = '';
var mysignature = '';
//console.log(mytimestamp)
//console.log(mynonceStr)

//console.log(mynonceStr + "::" + wxjsapi_ticket + "::" + mytimestamp + "::" + window.location.href.split("#")[0]);
//share
//获取  access token
function GetAccessToken(){
	axios.post('https://tst.mindmedia.cn/wxm/auth/getAccessToken/'+ companyId + '.do',
	).then((res)=> {
		this.GetJsapiTicket(res.data.infoData)
	}).catch((error)=> {
		console.log(error)
	})
}
//获取  jsapi_ticket
function GetJsapiTicket2(){
	var mysignatureReall = "jsapi_ticket=kgt8ON7yVITDhtdwci0qeQXDDjr4r37auJ-Y469qGcJG8E9gbogoDiBXPuFvjr021-EULvFAu617aRTtZp3IfA&noncestr=" + mynonceStr + "&timestamp=" + mytimestamp + "&url=" + window.location.href.split("#")[0];
	alert(sha1.hash(mysignatureReall))
	wx.config({  
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
		    appId: appid, // 必填，公众号的唯一标识  
		    timestamp: mytimestamp, // 必填，生成签名的时间戳  
		    nonceStr: mynonceStr, // 必填，生成签名的随机串  
		    signature:sha1.hash(mysignatureReall),// 必填，签名，见附录1  
		    jsApiList: [  
		        'checkJsApi',  
		        'onMenuShareTimeline',  
		        'onMenuShareAppMessage',  
		        'onMenuShareQQ',  
		        'onMenuShareWeibo',  
		        'chooseWXPay'  
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
		});
		wx.ready(function () {  
		    wx.onMenuShareTimeline({  
		        title: '100000瓶粱大侠毕业用酒免费申领中……', // 分享标题  
		        link: 'wxmms.swissems.cn', // 分享链接,将当前登录用户转为puid,以便于发展下线  
		        imgUrl: './image/shareTitImg.jpg', // 分享图标  
		        success: function () {   
		            // 用户确认分享后执行的回调函数  
		            console.log('分享成功');  
		        },  
		        cancel: function () {   
		            // 用户取消分享后执行的回调函数  
		        }  
		    });  
		    wx.error(function(res){  
		        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
		        alert("errorMSG:"+res);  
		    });  
		}); 
}
function GetJsapiTicket(){
	axios.post('https://tst.mindmedia.cn/wxm/auth/getJsApiAccessToken/' + companyId + '.do',
	).then((res)=> {
		alert('jsapi_ticket---' + res.data.infoData)
		var mysignatureReall = "jsapi_ticket=" + res.data.infoData + "&noncestr=" + mynonceStr + "&timestamp=" + mytimestamp + "&url=" + window.location.href.split("#")[0];
    	mysignature = mysignatureReall
    	console.log(mysignatureReall)
    	wx.config({  
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
		    appId: appid, // 必填，公众号的唯一标识  
		    timestamp: mytimestamp, // 必填，生成签名的时间戳  
		    nonceStr: mynonceStr, // 必填，生成签名的随机串  
		    signature:mysignatureReall,// 必填，签名，见附录1  
		    jsApiList: [  
		        'checkJsApi',  
		        'onMenuShareTimeline',  
		        'onMenuShareAppMessage',  
		        'onMenuShareQQ',  
		        'onMenuShareWeibo',  
		        'chooseWXPay'  
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
		});
		wx.ready(function () {  
		    wx.onMenuShareTimeline({  
		        title: '100000瓶粱大侠毕业用酒免费申领中……', // 分享标题  
		        link: 'wxmms.swissems.cn', // 分享链接,将当前登录用户转为puid,以便于发展下线  
		        imgUrl: './image/shareTitImg.jpg', // 分享图标  
		        success: function () {   
		            // 用户确认分享后执行的回调函数  
		            console.log('分享成功');  
		        },  
		        cancel: function () {   
		            // 用户取消分享后执行的回调函数  
		        }  
		    });  
		    wx.error(function(res){  
		        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
		        alert("errorMSG:"+res);  
		    });  
		}); 
	}).catch((error)=> {
		console.log(error)
	})
}

//GetJsapiTicket()



//share
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
                luokuang:'',
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
            if (this.$route.query && this.$route.query.quotation) {
                self.form.quotation = this.$route.query.quotation
                self.form.luokuang = this.$route.query.name
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
                fsignature:this.form.luokuang,
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
              var base64 = canvas.toDataURL("image/jpeg", quality); // 压缩后的base64图片
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
            }  else {
                this.selectedData = this.quote[0]
            }

        },
        toNext() {
            if (this.num < this.quote.length-1) {
                this.num++
                this.selectedData = this.quote[this.num]
            } else {
                this.selectedData = this.quote[this.quote.length-1]
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
            if(this.name == '' || this.name == 'undefined'){
                this.$notify({
                    title: '',
                    message: '请填写落款人！',
                    type: 'warning'
                });
                return
            }
            var DATA = {
                yulu: this.quotation,
                open_id:localStorage.getItem("openid"),
                fsignature:this.name
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

