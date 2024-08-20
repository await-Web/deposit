<template>
	<u-popup ref="popup" width="100%" v-model="show">
		<view class="statusBar" :style="{height:system.getStatusBarHeight()+'px'}"></view>
		<view class="title-box">
			<uni-icons type="closeempty" style="float: left;margin-left: 20rpx;" size='24' @click="close"></uni-icons>
			<view class="title">提取完毕</view>
		</view>
		<view class="u-flex-col content  u-p-l-20 u-p-r-20">
			<u-alert-tips :show="true" type="error" @close="showTips = false"
				title="视频无法下载或保存点击下方,'复制无水印视频链接'使用手机自带浏览器下载" :close-able="true"></u-alert-tips>
			<view class="u-m-t-20 video-box">
				<video id="myVideo" :src="analysisData.videoSrc" controls></video>
				<view class="u-flex-col u-m-t-10">
					<text class="u-font-30 u-m-b-10">{{analysisData.title}}</text>
					<text>{{analysisData.description}}</text>
				</view>
			</view>
			<view class="u-flex btn-box">
				<u-button type="primary" size="medium"
					@click="handleVideo(analysisData.videoSrc,'video')">下载视频</u-button>
				<u-button type="primary" size="medium"
					@click="handleVideo(analysisData.imageSrc,'image')">下载封面</u-button>
				<u-button type="success" size="medium" @click="copy(analysisData.videoSrc)">复制无水印视频链接</u-button>
				<u-button type="success" size="medium" @click="copy(analysisData.imageSrc)">复制无水印封面链接</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			modelValue: {
				type: Boolean,
				default: false
			},
			detialData: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				show: false,
				showTips: false
			}
		},
		watch: {
			modelValue: {
				immediate: true,
				handler(val) {
					this.show = val
				}
			}
		},
		computed: {
			analysisData() {
				return this.detialData
			}
		},
		methods: {
			close() {
				this.$emit("update:modelValue", false);
			},
			//处理解析后的数据
			handleVideo(src, type) {
				if (type === 'video' && !src) src = this.analysisData.imageSrc
				let save = 'saveVideoToPhotosAlbum'
				if (type === 'image') save = 'saveImageToPhotosAlbum'
				if (type === 'video' && !this.analysisData.videoSrc) save = 'saveImageToPhotosAlbum'
				var downloadTask = uni.downloadFile({
					url: src,
					success: (res) => {
						if (res.statusCode === 200) {
							uni[save]({
								filePath: res.tempFilePath,
								success: () => {
									uni.showToast({
										title: '保存成功',
										icon: 'none',
									});
								},
								fail: (err) => {
									this.showTips = true
									uni.showToast({
										title: err + '--无法保存到手机,复制无水印视频链接',
										icon: 'none',
									});
								}
							});
						} else {
							uni.hideLoading()
						}
					},
					fail: (err) => {
						uni.showToast({
							title: err + '--下载失败',
							icon: 'none',
						});
					}
				});
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: '正在下载' + res.progress + '%'
					})
					if (res.progress == 100) uni.hideLoading()
				});
			},
			//复制
			copy(text) {
				uni.setClipboardData({
					data: text,
					showToast: false,
					success: () => {
						uni.hideToast(); // 隐藏弹出提示
						uni.hideKeyboard(); //  隐藏软键盘
						uni.showToast({
							title: '已复制'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-box {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0 16rpx !important;

		.backIcon {
			font-size: 40rpx;
			color: #000;
		}

		.title {
			flex: 1;
			text-align: center;
			padding-right: 40rpx;
			font-size: 32rpx;
		}
	}

	.content {
		.notice-bar-box {
			border-radius: 40rpx;
			margin-top: 20rpx;

			::v-deep uni-notice-bar {
				.uni-noticebar {
					border-radius: 80rpx;
				}
			}
		}

		.video-box {
			width: 100%;

			::v-deep video {
				width: 100%;
			}
		}

		.btn-box {
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 20rpx;

			::v-deep button {
				width: 340rpx !important;
				margin-bottom: 20rpx;
			}
		}
	}





	.content {}
</style>