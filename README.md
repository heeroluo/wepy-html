# WePY HTML

## 简介

「WePY HTML」是基于「WePY」小程序框架所开发的富文本内容组件。与小程序原生的「rich-text」组件相比，本组件能实现更多交互效果；与「wxParse」相比，本组件的解析性能更高、灵活性更强。

（注意：本组件目前仅支持基于「WePY」开发的微信小程序项目）

## 安装

在小程序项目目录下运行安装：

``` bash
npm install wepy-html
```

## 调用

在页面（page.wpy）中调用组件的Demo：

``` html
<template lang="wxml">
	<wepy-html />
</template>

<style>
/* 可以覆盖默认样式 */
.wepyhtml-tag-p {
	margin: 1em 0;
}
</style>

<script>
import WepyHTML from 'wepy-html';

export default class Page extends wepy.component {
	components: {
		'wepy-html': WepyHTML
	},

	onLoad() {
		// 调用组件接口，传入HTML内容和相关参数
		this.$invoke('wepy-html', 'updateContent', htmlCode, {
			// 是否使用图片代替视频（点击时全屏播放视频），
			// 主要用于防止视频组件遮挡其他元素
			imgInsteadOfVideo: true,

			// 可以在此函数中处理链接点击
			onHyperlinkTap(e) {
				// e.href 为链接地址
			},

			// 可以在此函数中修改属性
			onNodeCreate(nodeName, attrs) {
				// nodeName 为标签名
				// attrs 为属性集合
			}
		});
	}
}
</script>
```