<template>
	<view class="Main">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<view class="">
			<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple size="80"
				style="margin-left:260rpx" :maxCount="1">
				<image
					src="https://ts3.cn.mm.bing.net/th?id=OIP-C.IDxFlKB5u5mwl2kvl9W-jgAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
					mode="widthFix" style="width: 80px; height: 80px;  overflow: hidden; border-radius: 10%;">
				</image>
			</u-upload>
		</view>
		<view class="toast">
			提示: * 皆为必填项
		</view>
		<u--form labelPosition="left" :model="model1" :rules="rules" ref="form1" labelWidth='100px'>
			<u-form-item label="姓名" prop="userInfo.name" ref="item1" :border-bottom="false" required>
				<u--input v-model="model1.userInfo.name" border="none" placeholder="请输入姓名"> </u--input>
			</u-form-item>
			<u-form-item label="身份证" prop="userInfo.id" ref=" item1" :border-bottom="false" required>
				<u--input v-model.number="model1.userInfo.id" placeholder="请输入身份证号" border="none"></u--input>
			</u-form-item>
			<u-form-item label="手机号" prop="userInfo.phone" ref=" item1" :border-bottom="false" required>
				<u--input v-model.number="model1.userInfo.phone" placeholder="请输入手机号" border="none"></u--input>
			</u-form-item>
			<u-form-item label="邮箱" prop="userInfo.email" ref=" item1" :border-bottom="false" required>
				<u--input v-model="model1.userInfo.email" placeholder="请输入邮箱" border="none"></u--input>
			</u-form-item>
			<u-form-item label="生日" prop="userInfo.birthday" ref=" item1" @click="show = true" :border-bottom="false">

				<u--input disabled disabledColor="#ffffff" placeholder="请选择您的生日" border="none"></u--input>
				<u-icon class="inpIcon" slot="right" name="arrow-right"></u-icon>
				<u-datetime-picker :show="show" mode="datetime" @cancel="cancel" @confirm="confirm" @close="cancel">
				</u-datetime-picker>
			</u-form-item>
			<u-form-item label="所在地区" prop="userInfo.address" :border-bottom="false">
				<view class="address" @change="change">
					<AddressPicker :level="3">{{planLocate}} </AddressPicker>
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

	</view>
</template>

<script>
	import AddressPicker from "@/components/lingdang-AddressPicker/AddressPicker.vue"
	export default {
		data() {
			return {
				showSex: false,
				fileList1: [], //头像
				model1: {
					userInfo: {
						name: '',
						email: '',
						id: "",
						phone: '',
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
						required: true,
						message: '请选择生日',
						trigger: ['blur', 'change']
					},
					"userInfo.address": {
						required: true,
						message: '请选择所在地区',
						trigger: ['blur', 'change'],
					},
					"userInfo.emergencyPeople": {
						required: true,
						message: '请填写紧急联系人',
						trigger: ['blur', 'change'],
					},
					"userInfo.emergencyPhone": {
						required: true,
						message: '请填写紧急联系人手机号',
						trigger: ['blur', 'change'],
					}
				},
				radio: '',
				switchVal: false,
				planLocate: '请选择地址',
				// 生日数据 
				birthdayData: ''
			};
		},
		methods: {
			sexSelect(e) {
				this.model1.userInfo.sex = e.name
				this.$refs.form1.validateField('userInfo.sex')
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
				console.log(arr)
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					console.log(result);
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://localhost:8080/demo/image', /// node服务器
						filePath: url,
						name: 'filePath',
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
								console.log(res);
							}, 1000)
						}
					});
				})
			},
			submit() {
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			}
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
