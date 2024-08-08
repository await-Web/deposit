<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	const uniIdCo = uniCloud.importObject('uni-id-co')
	onLaunch(() => {
		console.log('App onLaunch')
		// 你课程没看完妈，我没有采用这种方式 开始是这种方式  这种不合理 那怎么改  改成我哪种独立登录页的，不要隐式登录，这种微信不运行允许好的 回去改  展示数据你用的是云函数嘛
		let expired = uni.getStorageSync('uni_id_token_expired')
		// if (expired - Date.now() > 1000 * 60 * 60 * 1) return
		uni.login({
			success: (res) => {
				uniIdCo.loginByWeixin({
					code: res.code
				}).then(res => {
					uni.removeStorageSync('uni-id-pages-userInfo')
					let data = {
						...res,
						showToast: false
					}
					userStore.loginSuccess(data)
				})
			}
		})
	})
	onShow(() => {
		console.log('App onShow')
	})
	onHide(() => {
		console.log('App onHide')
	})
</script>

<style lang="scss">
	@import "@/uni_modules/vk-uview-ui/index.scss";
	@import "@/assets/scss/common-style.scss";
</style>