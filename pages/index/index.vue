<template>
	<view class="tool-v">
		<view class="statement u-text-center u-m-t-20">所有视频,图片归平台及作者所有，本应用不储存任何内容</view>
		<view class="u-m-b-20 u-m-t-20">
			<ad-custom unit-id="adunit-82d9c74417201fca" ad-intervals="30"></ad-custom>
		</view>
		<u-toast ref="uToast" />
		<view class="tool-content">
			<view class="u-m-t-20 url-input">
				<kxSwitch @change="switchChange"></kxSwitch>
				<kxInput v-model="url" placeholder="此处粘贴视频分享链接" addonAfter="主页解析" @afterClick="authorWorkWatermark"
					v-if="isBach" />
				<kxInput v-model="url" placeholder="此处粘贴视频分享链接" addonAfter="解析" @afterClick="watermark" v-else />
			</view>
			<view class="apply-list">
				<view class="part">
					<view class="caption u-line-1">
						更多功能
					</view>
					<view class="item-box">
						<view class="u-flex u-flex-wrap">
							<view class="item u-flex-col u-col-center" @click="jumWebview('1')">
								<text class="u-font-40 item-icon icon-kx icon-kx-check-circle"
									:style="{ background:  '#00ff00' }" />
								<text class="u-font-24 u-line-1 item-text">无广告版</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('2')">
								<text class="u-font-40 item-icon icon-kx icon-kx-bizhi3"
									:style="{ background:  '#55ffff' }" />
								<text class="u-font-24 u-line-1 item-text">更多壁纸</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('3')">
								<text class="u-font-40 item-icon icon-kx icon-kx-MD51"
									:style="{ background:  '#008cff' }" />
								<text class="u-font-24 u-line-1 item-text">修改MD5</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('4')">
								<text class="u-font-40 item-icon icon-kx icon-kx-jilu_"
									:style="{ background:  '#f2b0ff' }" />
								<text class="u-font-24 u-line-1 item-text">使用教程</text>
							</view>
							<view class="item u-flex-col u-col-center">
								<button class="shareBtn" open-type="share">
									<text class="item-icon icon-kx icon-kx-wechat-fill"></text>
								</button>
								<text class="u-font-24 u-line-1 item-text">分享</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-3d5d8bfadac4e954" ad-intervals="30"></ad-custom>
			</view>
			<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-4a47ba5eacd6fa5d" ad-intervals="30"></ad-custom>
			</view>
		</view>
		<button class="com-addBtn" open-type="contact">
			<u-icon name="kefu-ermai" size="48" color="#fff" />
		</button>
	</view>
</template>
<script>
	const db = uniCloud.database();
	const analysisTable = db.collection('analysis-dataLog')
	import {
		getVoucher,
		watermark,
		authorWorkWatermark
	} from "@/api/external.js";
	const subscribemsg = uniCloud.importObject('subscribeMessage')
	export default {
		data() {
			return {
				// url: "5 365去水印助手发布了一篇小红书笔记，快来看吧！ 😆 tfV4QR6Wqo0X0LZ 😆 http://xhslink.com/a/tyU2rTEncSiW，复制本条信息，打开【小红书】App查看精彩内容！",
				// url: 'https://v.kuaishou.com/X8x7xF 出租半边床位"你附近100米的人 "你的女神已上线 "夸她就行 该作品在快手被播放过2.2万次，点击链接，打开【快手】直接观看！',
				// url: '58 365去水印助手发布了一篇小红书笔记，快来看吧！ 😆 aCBhfKrXNijYQME 😆 https://xhslink.com/a/2bcRfA1WOyjW，复制本条信息，打开【小红书】App查看精彩内容！',
				url: '5- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ik4XMwp7/ 7@1.com :7pm',

				todayCount: 0,
				allCount: 0,
				detialData: {},
				subscribeId: ['UU3SfNdbK8zevjVTLyDd43aqeGvdO4V6ND-VcoIRTYk'],
				isBach: false
			}
		},
		onShareAppMessage() {
			return {
				title: '免费去水印,不限次数',
				path: '/pages/index/index'
			}
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo
			}
		},
		onLoad() {
			this.share()
			this.getVoucher()
		},
		methods: {
			share() {
				//分享
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: false,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif
			},
			//获取接口调用凭据
			getVoucher() {
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST'
				}
				getVoucher(data).then(res => {
					uni.setStorageSync('externalToken', res.data.token) || ''
				})
			},
			//获取次数
			getWatermarkCount() {
				uniCloud.callFunction({
					name: 'getWatermark',
					data: {
						user_id: this.currentUser._id
					},
				}).then(res => {});
			},

			//批量解析开关
			switchChange(e) {
				if (e) {
					this.$refs.uToast.show({
						title: '主页解析目前仅支持抖音',
						type: 'warning',
						duration: 2500
					})
				}
				this.isBach = e
			},

			//短视频解析
			watermark() {
				//订阅
				if (!this.url) return this.$u.toast("分享链接不能为空")
				watermark({
					link: this.url
				}).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					let imgUrl = this.ensureHttps(data.imageSrc)
					let videoUrl = this.ensureHttps(data.videoSrc)
					let imageAtlas = data.imageAtlas.map(o => this.ensureHttps(o))
					this.detialData = {
						...data,
						imageSrc: imgUrl,
						videoSrc: videoUrl,
						imageAtlas: imageAtlas
					}
					console.log(this.detialData);
					this.setDataLog()
					uni.navigateTo({
						url: '/pages/analysis/analysisDetial/index?config=' + encodeURIComponent(JSON
							.stringify(this.detialData))
					})
				}).catch(err => {})
			},
			/* 添加解析记录 */
			async setDataLog() {
				let todayCount = ++this.todayCount
				let allCount = ++this.allCount
				await analysisTable.add({
					dateTimestamp: this.tools.getCurrentDateTime('timestamp'),
					date: this.tools.getCurrentDateTime(),
					watermarkObj: this.detialData,
					todayCount,
					allCount
				})
			},
			/* 跳转相关 */
			jumWebview(type) {
				if (type == '1') {
					uni.navigateToMiniProgram({
						appId: 'wx51f6121324b84fa8', //目标小程序appid
						path: '/pages/index/index', //需要打开的目标路径
						envVersion: 'release', //小程序版本：develop（开发版），trial（体验版），release（正式版）
						success(res) {
							// 打开成功
						}
					})
				} else if (type == '2') {
					uni.navigateToMiniProgram({
						appId: 'wx51f6121324b84fa8', //目标小程序appid
						path: '/pages/index/wallpaper', //需要打开的目标路径
						envVersion: 'release', //小程序版本：develop（开发版），trial（体验版），release（正式版）
						success(res) {
							// 打开成功
						}
					})
				} else if (type == '3') {
					uni.navigateTo({
						url: '/pages/analysis/mdFive/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/analysis/tutorial/index'
					});
				}
			},
			//批量解析
			authorWorkWatermark() {
				if (!this.url) return this.$u.toast("分享链接不能为空")
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: this.url
				}
				authorWorkWatermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					if (res.code == '1') {
						uni.navigateTo({
							url: '/pages/analysis/batch/index?config=' + encodeURIComponent(JSON
								.stringify(data))
						})
					}
				})
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.tool-v {
		width: 100%;
		height: 100%;
		padding: 0 20rpx;

		.statement {
			width: 100%;
			color: red;
		}

		.wrap {
			padding: 20rpx 0;
		}

		.tool-content {
			padding-bottom: 20rpx;

			.url-input {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 2rpx 1rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
</style>