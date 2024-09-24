<template>
	<view class="page_v">
		<uni-section title="个人资料" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="form" :modelValue="formData" label-position="top" :rules="rules">
					<uni-forms-item label="昵称" required name="username">
						<uni-easyinput v-model="formData.username" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="年龄" required>
						<uni-easyinput v-model="formData.age" placeholder="请输入年龄" name="age" />
					</uni-forms-item>
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="formData.gender" :localdata="genderList" name="gender" />
					</uni-forms-item>
					<!-- <uni-forms-item label="选择存钱类型" required label-width="200">
						<ZjfSelect :options="depositTypeList" v-model="formData.depositType" @change="selectChange"
							name="depositType">
						</ZjfSelect>
					</uni-forms-item> -->
				</uni-forms>
				<!-- <view
					style="width: 100%;height: 100%;border-radius: 8rpx;background-color: #d9d9d8;margin-bottom: 20rpx;padding: 20rpx;">
					<text style="color: #333;font-size: 36rpx; font-weight: 600;"
						class="title">{{depositValue+'说明'}}</text>
					<view class="" style="margin-top: 20rpx;letter-spacing: 2px;line-height: 56rpx;font-size: 32rpx;">
						{{this.illustrate}}
					</view>
				</view> -->

				<view class="adContainer">
					<ad unit-id="adunit-4a528e994a5a03c9" ad-type="video" ad-theme="white"></ad>
				</view>
			</view>
			<view class="" style="position: fixed;bottom: 0;width: 100%;">
				<button type="primary" @click="submit()" :loading="loading">提交</button>
			</view>
		</uni-section>
	</view>
</template>
<script>
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	export default {
		data() {
			return {
				formData: {
					username: '',
					age: "28",
					gender: 0,
					depositType: "0"
				},
				show: false,
				depositValue: '',
				loading: false,
				genderList: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '保密',
					value: 2
				}, {
					text: '其他',
					value: 3
				}],
				rules: {
					username: {
						rules: [{
							required: true,
							errorMessage: '请填写姓名',
						}]
					},
					age: {
						rules: [{
							required: true,
							errorMessage: '请填写年龄',
						}, {
							validateFunction: (rule, value, data, callback) => {
								// 异步需要返回 Promise 对象
								return new Promise((resolve, reject) => {
									setTimeout(() => {
										if (value >= 18) {
											// 通过返回 resolve
											resolve()
										} else {
											// 不通过返回 reject(new Error('错误信息'))
											reject(new Error('年龄必须大于18岁'))
										}
									}, 2000)
								})
							}
						}]
					},
					gender: {
						rules: [{
							required: true,
							errorMessage: '请选择性别',
						}]
					}
				}
			}
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.wxAd()
		},
		onShow() {
			this.init()
		},
		computed: {
			userInfo() {
				return userStore.userInfo
			}
		},
		methods: {
			wxAd() {
				// 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
				// 在页面中定义激励视频广告
				let videoAd = null

				// 在页面onLoad回调事件中创建激励视频广告实例
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-61b3b48b7c3d1760'
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {
						console.error('激励视频光告加载失败', err)
					})
					videoAd.onClose((res) => {})
				}

				// 用户触发广告后，显示激励视频广告
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}
			},
			/* 初始化 */
			init() {
				this.formData = {
					'username': this.userInfo.username,
					'age': this.userInfo?.age || "28",
					'depositType': this.userInfo?.depositType || "0",
					'gender': this.userInfo?.gender || 1
				}
			},
			/* 选择存钱类型 */
			selectChange(e) {
				this.formData.depositType = e.id
				this.depositValue = e.fullName || ''
				this.illustrate = e?.illustrate || ''
			},
			/* 更新信息 */
			submit() {
				this.$refs.form.validate().then(res => {
					userStore.updateUserInfo(this.formData)
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				})
			}
		}
	}
</script>

<style lang="scss">
	.page_v {
		display: flex;
		flex-direction: column;
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: calc(100vh - 2.85rem);
		/* #endif */
		background-color: $background-color
	}

	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		margin-left: 10px;
	}
</style>