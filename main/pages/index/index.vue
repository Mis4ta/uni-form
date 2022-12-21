<template>
	<view class="Main">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<view class="">
			<u-avatar :src="src" shape="circle" style="margin:0 auto" size=80 @click='handleUpload'> </u-avatar>
		</view>
		<view class="toast">
			提示: * 皆为必填项
		</view>
		<u--form labelPosition="left" :model="model1" :rules="rules" ref="form1" labelWidth='100px'>
			<u-form-item label="姓名" prop="userInfo.name" ref="item1" :border-bottom="false" required>
				<u--input v-model="model1.userInfo.name" border="none" placeholder="请输入姓名"> </u--input>
			</u-form-item>
			<u-form-item label="身份证" prop="userInfo.id" ref=" item1" :border-bottom="false" required>
				<u--input v-model="model1.userInfo.id" placeholder="请输入身份证号" border="none">
				</u--input>
			</u-form-item>
			<u-form-item label="手机号" prop="userInfo.phone" ref=" item1" :border-bottom="false" required>
				<u--input v-model.number="model1.userInfo.phone" placeholder="请输入手机号" border="none"></u--input>
			</u-form-item>
			<u-form-item label="邮箱" prop="userInfo.email" ref=" item1" :border-bottom="false" required>
				<u--input v-model="model1.userInfo.email" placeholder="请输入邮箱" border="none"></u--input>

			</u-form-item>
			<u-form-item label="生日" prop="userInfo.birthday" ref=" item1" @click="show = true" :border-bottom="false">

				<u--input disabled disabledColor="#ffffff" placeholder="请选择您的生日" border="none" v-model="birthdayData">
				</u--input>
				<u-icon class="inpIcon" slot="right" name="arrow-right"></u-icon>
				<u-datetime-picker :show="show" mode="datetime" @cancel="cancel" @confirm="confirm" @close="cancel">
				</u-datetime-picker>
			</u-form-item>
			<u-form-item label="所在地区" prop="userInfo.address" :border-bottom="false">
				<view class="address">
					<AddressPicker :level="3" @change="change">{{planLocate}} </AddressPicker>
				</view>
				<u-icon class="inpIcon" slot="right" name="arrow-right"></u-icon>
			</u-form-item>
			<u-form-item label="紧急联系人" prop="userInfo.emergencyPeople" :border-bottom="false" ref=" item1">
				<u--input v-model="model1.userInfo.emergencyPeople" placeholder="请输入紧急联系人姓名" border="none"></u--input>
			</u-form-item>
			<u-form-item label="紧急联系手机号码" prop="userInfo.emergencyPhone" :border-bottom="false" ref=" item1">
				<u--input v-model.number="model1.userInfo.emergencyPhone" placeholder="请输入手机号" border="none"></u--input>
			</u-form-item>

			<view style="margin-right: 54rpx;">
				<u-button @click="submit">提交</u-button>
			</view>
		</u--form>
		<!-- 头像: <image :src="newObj.data.image.avatar ? newObj.data.image.avatar :'' "></image> -->
		<view class="" v-if="newObj.data">
			<u-avatar :src=" newObj.data.image.avatar" shape="circle" style="margin:0 auto" size=80
				@click='handleUpload'>
			</u-avatar>
			{{newObj.data.body.name}}
		</view>
	</view>
</template>

<script>
	import AddressPicker from "@/components/lingdang-AddressPicker/AddressPicker.vue"
	import {
		submitFn
	} from '@/util/request/api.js'
	import compress from '../../util/util.js'
	export default {
		data() {
			return {
				src: '', //头像
				showSex: false,
				model1: {
					userInfo: {
						name: '456',
						email: '2219207911@qq.com',
						id: "511324200112195792",
						phone: '18428093957',
						address: '', //地址
						emergencyPeople: '', //	紧急联系人
						emergencyPhone: '', //紧急联系人电话
						birthday: "",
					},
				},

				// 遮罩
				show: false,
				value1: Number(new Date()),
				// 验证
				rules: {
					'userInfo.name': [{
							type: 'string',
							required: true,
							message: '请填写姓名',
							trigger: ['blur', 'change'],
							min: 2,
							max: 50,
						},

					],
					'userInfo.id': [{
							type: 'number',
							required: true,
							message: '请填写身份证号',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.idCard(value);
							},
							message: '身份证号不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					'userInfo.phone': [{
						type: 'number',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过\
							// this.$u.test.mobile()就是返回true或者false的
							return uni.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					'userInfo.email': [{
							type: 'string',
							required: true,
							message: '请填写邮箱',
							trigger: ['blur', 'change']
						}, {
							validator: (rule, value, callback) => {
								return uni.$u.test.email(value);
							},
							message: '邮箱不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}

					],
					'userInfo.birthday': {
						type: 'string',
						required: false,
						message: '请选择生日',
						trigger: ['blur', 'change']
					},
					"userInfo.address": {
						required: false,
						message: '请选择所在地区',
						trigger: ['blur', 'change'],
					},
					"userInfo.emergencyPeople": {
						required: false,
						message: '请填写紧急联系人',
						trigger: ['blur', 'change'],
					},
					"userInfo.emergencyPhone": {
						type: 'number',
						required: false,
						message: '请填写紧急联系人手机号',
						trigger: ['blur', 'change'],
					}
				},
				radio: '',
				switchVal: false,
				planLocate: '请选择地址',
				// 生日数据 
				birthdayData: '',
				// 返回的数据
				newObj: {}
			};
		},
		methods: {
			sexSelect(e) {
				// this.model1.userInfo.sex = e.name
				// this.$refs.form1.validateField('userInfo.sex')
			},
			// 取消遮罩层
			cancel() {
				this.show = false
			},
			// 确认
			confirm(e) {
				const timeFormat = uni.$u.timeFormat
				// 返回'yyyy-mm-dd'格式的时间戳
				this.birthdayData = timeFormat(e.value, 'yyyy-mm-dd')
				console.log(this.birthdayData)
				// 退出
				this.cancel()
			},
			// 三级联动
			//父组件的获取子组件传递的值， 在为josn 有code和name 
			change(result) {
				console.log(JSON.stringify(result.data));
				this.planLocate = '';
				result.data.forEach((item, index) => {
					if (index === 0) {
						this.planLocate += item.name
					} else {
						this.planLocate += '-' + item.name
					}
				});
				let arr = this.planLocate.split('-');
				console.log(arr);
			},
			// 上传图片
			handleUpload() {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success: (file) => {
						this.blobToBase64(file.tempFiles[0]).then((res) => {
							uni.showLoading({
								title: "上传中",
							});
							let compressBase64Img = "";
							new Promise((resolve, reject) => {
								compressBase64Img = compress(res, 500, 0.9); //compress封装的压缩方法
								resolve(compressBase64Img);
							}).then((response) => {
								this.avatarUpload(response); //上传图片接口

							});
						});
					},
				});
			},
			//blob转base64
			blobToBase64(blob) {
				return new Promise((resolve, reject) => {
					const fileReader = new FileReader();
					fileReader.onload = (e) => {
						resolve(e.target.result);
					};
					fileReader.readAsDataURL(blob);
					fileReader.onerror = () => {
						reject(new Error("文件流异常"));
					};
				});
			},
			// 
			avatarUpload(avatar) {
				let that = this;
				var res = {
					"avatar": avatar //转化成功的base64
				}
				uni.request({
					url: "http://localhost:8080/demo/image", //传到后端
					data: JSON.stringify(res), //要传输的数据
					method: "POST",
					success(r) {
						if (r.data.msg == "请求成功") {
							that.src = r.data.data.avatar
							uni.showToast({
								title: "设置成功",
								icon: 'success'
							});

						} else {
							uni.showToast({
								title: "设置失败",
								icon: "error",
							});

						}
					},
					fail() {
						uni.showToast({
							title: "网络错误",
							icon: "error",
						});
					},
				});
			},
			//提交
			async submit() {
				this.$refs.form1.validate().then(async (res) => {
					uni.$u.toast('校验通过')
					const {
						name,
						email,
						id,
						phone,
						address,
						emergencyPeople,
						emergencyPhone
					} = this.model1.userInfo

					let res1 = await submitFn({
						"name": name,
						"email": email,
						"id": id,
						"phone": phone,
						"emergencyPeople": emergencyPeople,
						"emergencyPhone": emergencyPhone,
						"birthday": this.birthdayData,
					})
					// 返回的数据
					// this.newObj = res1
					// 清空页面
					this.src = ""
					this.model1.userInfo = {}
				}).catch(errors => {
					console.log(errors, "err");
					uni.$u.toast('校验失败')
				})
			},
		},
		onReady() {
			this.$refs.form1.setRules(this.rules)
		},
		components: {
			AddressPicker
		},
	};
</script>


<style lang="scss">
	.Main {
		background-color: #fff;
		width: 750rpx;
		height: 100%;
		border-top: none;
		padding: 20rpx 0 0 35rpx;

		.inpIcon {
			padding: 0 50rpx 0 0;
		}

		.address {
			width: 100%;
			height: 100%;
			font-family: '微软雅黑';
			color: #C0C9DB;
		}

		.toast {
			color: red;
			font-size: 24rpx;
		}

		// /deep/
	}
</style>
