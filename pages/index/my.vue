<template>
	<view class="self">
		<view :style="{height:system.getNavBarHeight()+'px'}"></view>
		<view class="userinfo">
			<view class="left">
				<view class="avatar">
					<view class="box">
						<view class="inner">
							<image :src="avatarUrl || '../../static/image/defAvatar.png'" mode=""></image>
							<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="btn">按钮</button>
							<view class="mask" v-if="uploadState">
								上传{{percentCompleted}}%
							</view>
						</view>
						<view class="icon">
							<uni-icons type="camera" color="#fff" size="16"></uni-icons>
						</view>
						<view class="text">点击更换头像</view>
					</view>
				</view>
				<view class="info">
					<view class="username">{{userName}}</view>
					<view class="text"> {{ `存钱的第${register_date}天`}}</view>
				</view>
			</view>
			<view class="right" @click="jumPage('/pages/my/personalDetails')">
				<view class="text">编辑资料</view>
				<view class="icon">
					<uni-icons type="right" size="20" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="cardLayout">
			<view class="list block">
				<view class="item">
					<view class="left">
						<view class="icon"
							style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons custom-prefix="iconfont" type="xxm-pushpin-fill" size="18"
								color="#fff"></uni-icons>
						</view>
						<view class="name">偏好设置</view>
					</view>
					<view class="right">
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
				<view class="item">
					<view class="left">
						<view class="icon"
							style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons custom-prefix="iconfont" type="xxm-api-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">退出登录</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	const userInfo = userStore.userInfo
	export default {
		data() {
			return {
				uploadState: false,
				percentCompleted: 0,
				avatar: ''
			}
		},
		computed: {
			userName() {
				return userInfo.username
			},
			avatarUrl() {
				return userInfo.avatar
			},
			register_date() {
				return this.tools.daysFromTimestamp(userInfo.register_date)
			}
		},
		methods: {
			/* 上传头像 */
			onChooseAvatar(e) {
				this.uploadState = true;
				this.avatar = e.detail.avatarUrl;
				uniCloud.uploadFile({
					filePath: this.avatar,
					cloudPath: `userAvatar/${this.tools.formatDate(Date.now(), "yyyyMMdd")}/${Date.now()}.jpg`,
					cloudPathAsRealPath: true,
					onUploadProgress: (progressEvent) => {
						this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					}
				}).then(res => {
					this.avatar = res.fileID
					let data = {
						avatar: this.avatar
					}
					userStore.updateUserInfo(data)
					this.uploadState = false;
				})
			},
			/* 跳转详情页 */
			jumPage(path) {
				if (!path) return
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.self {
		background: $page-bg-color;
		min-height: 100vh;
		padding-bottom: 20rpx;

		.userinfo {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			background-color: #fff;
			margin-bottom: 20rpx;

			.left {
				display: flex;
				align-items: center;

				.avatar {
					padding: 60rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;

					.box {
						height: 100rpx;
						width: 100rpx;
						position: relative;

						.inner {
							width: 100%;
							height: 100%;

							image {
								width: 100%;
								height: 100%;
								border-radius: 50%;
								border: 1px solid #eee;
							}

							.btn {
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
								opacity: 0;
							}

							.mask {
								position: absolute;
								background: rgba(0, 0, 0, 0.6);
								color: #fff;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 22rpx;
							}
						}

						.icon {
							width: 40rpx;
							height: 40rpx;
							background: #FE9468;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							border: 2px solid #fff;
							position: absolute;
							right: 0;
							bottom: 0;
							pointer-events: none;
						}

						.text {
							font-size: 25rpx;
							color: #999;
							white-space: nowrap;
							padding: 20rpx 0;
							text-align: center;
						}
					}
				}

				.info {
					padding-left: 20rpx;

					.username {
						font-size: 38rpx;
						font-weight: 600;
						color: #111;
					}

					.text {
						font-size: 26rpx;
						font-weight: 100;
						color: $text-font-color-3;
						padding-top: 10rpx;
					}


				}
			}

			.right {
				display: flex;
				align-items: center;

				.text {
					font-size: 28rpx;
					color: #999;
				}
			}
		}

		.block {
			margin-top: 20rpx;
		}

		.cardLayout {
			background: #fff;
			border-radius: 20rpx;
			padding: 0 20rpx;
			margin: 0 20rpx;

			.list {
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 34rpx 0;
					border-bottom: 1px solid $border-color-light;

					&:last-child {
						border: none;
					}

					.left {
						display: flex;
						align-items: center;

						.icon {
							width: 50rpx;
							height: 50rpx;
							background: #fff;
							border-radius: 50%;
							overflow: hidden;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.name {
							font-size: 28rpx;
							padding-left: 20rpx;
							color: #333;
						}
					}

					.right {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #999;
					}
				}
			}
		}
	}
</style>