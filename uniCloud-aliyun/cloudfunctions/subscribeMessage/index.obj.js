// 引入uni-subscribemsg公共模块
const UniSubscribemsg = require('uni-subscribemsg');

module.exports = {
	_before: function() { // 通用预处理器

	},
	sendSubscribeMessage() {
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__C420FBA",
			provider: "weixin-mp",
		});
		// 发送订阅消息
		let res = await uniSubscribemsg.sendSubscribeMessage({
			touser: "用户openid",
			template_id: "MUpCSIdE753RDOqG0XQP07nYAQECCYB5Wd8ChwQbleE",
			page: "pages/index/tool", // 小程序页面地址
			miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			lang: "zh_CN",
			data: {
				thing2: {
					value: "张三"
				},
				character_string1: {
					value: "2023-12-21 15:30:20"
				}
			}
		});
	}
}