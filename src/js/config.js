//TODO remove all ft.com specific stuff so we can remove this as a global
// currently all FT specific stuff is wrapped in an if window.FT

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

/**
 * The FT.ads.config object holds the confiuration properties for an FT.ads.gpt instance.
 * FT.ads.config对象存储着gpt实例所需要的属性
 * There are four tiers of configuration; cookie level config, default config (set within the constructor), metatag config and global (env) config.
 * 有四种配置层级：cookie层级配置, default配置(在constructor中设置), 元标签配置，global(env)配置
 * Global config, (set in the page FT.env ojbect) takes priority over meta followed by default config with cookie config having the least priority.
 * Global配置，在页面中的FT.env对象中设置，其优先级高于元标签配置，低于default配置，cookie配置是最低。
 * wycNote:即优先级：default > global > meta > cookie
 * The FT.ads.config() function acts as an accessor method for the config; allowing getting and setting of configuration values.
 * FT.ads.config()函数是作为config的存取器方法；允许获取和设置配置值
 * Calling config() with no parameters returns the entire configuration object.
 * 不带参数调用config()会返回完整的配置对象
 * Calling config passing a valid property key will envoke the 'getter' and return the value for that property key.
 * 调用config时传递一个有效属性名会调用getter并返回该属性的值
 * Calling config passing a valid property key and a value will envoke the setter and set the value of the key to the new value.
 * 调用config时传递一个有效属性键值对会调用setter并设置新属性
 * Calling config passing an object of keys and values will envoke a setter that extends the store with the object provided.
 * 调用config时传递一个具有多个键值对的object会调用setter,y用该object扩展配置对象
 * @name config
 * @memberof FT.ads
 * @function
*/
const utils = require('./utils');
/**
* Default configuration set in the constructor.
*/
const defaults = {
	formats: { //规定各广告位的尺寸
		MediumRectangle:  {sizes: [300, 250]},
		Rectangle:  {sizes: [180, 50]},
		WideSkyscraper:  {sizes: [160, 600]},
		Leaderboard:  {sizes: [728, 90]},
		SuperLeaderboard: {sizes: [[970, 90], [970, 66]]},
		HalfPage: {sizes: [300, 600]},
		Billboard:  {sizes: [970, 250]},
		Portrait:  {sizes: [300, 1050]},
		AdhesionBanner: {sizes: [320, 50]},
		MicroBar: {sizes: [88, 31]},
		Button2: {sizes: [120, 60]},
		Responsive: { sizes: [2,2] }
	},
	responsive: {
		extra: [1025, 0], //Reasonable width to show a Billboard (desktop)
		large: [1000, 0], //reasonable width to show SuperLeaderboard (tablet landscape)
		medium: [760, 0], //reasonable width to show a leaderboard (tablet portrait)
		small: [0, 0] //Mobile
	},
	flags: {
		refresh: true,
		inview: true
	}
};

function fetchDeclaritiveConfig() { //获取声明式的配置
	let results = {};
	const scripts = Array.from(document.querySelectorAll('script[data-o-ads-config]'));//获取具有属性data-o-ads-config的script标签
	scripts.forEach(script => {
		results = (window.JSON) ? utils.extend(results, JSON.parse(script.innerHTML)) : 'UNSUPPORTED';
	});//将每个script元素的innerHTML解析为对象，扩展utils的results

	return results;
}

/**
* @private
* @function
* fetchCanonicalURL Grabs the canonical URL from the page meta if it exists.
*/
function fetchCanonicalURL() {//获取标准URL
	let canonical;
	const canonicalTag = document.querySelector('link[rel="canonical"]');//获取第一个rel为"canonical"的link标签
	if (canonicalTag) {
		canonical = canonicalTag.href;
	}

	return { canonical: canonical };
}

/**
* Defines a store for configuration information and returns a getter/setter method for access.
* 定义了一个store来存储配置信息，并返回getter/setter方法
* @class
* @constructor 
* wycNOTE:Config类的创建：组合使用了构造函数模式和原型模式
*/
function Config() {
	this.store = {};
}


/**
 * 
 * @param {String} k store的键
 * @param {*} v 键k对应的值
 * @example 
 *    let config = new Config(); 
 * 		config.access("a"); //获取config中属性a的值
 * 	  config.access("a": 1);//设置config中属性a的值为1
 */
Config.prototype.access = function(k, v) {
	let result;
	if (utils.isPlainObject(k)) { //如果k是一个
		utils.extend(true, this.store, k);
		result = this.store;
	} else if (typeof v === 'undefined') { //如果没有定义v，那么就是获取属性k的值
		if (typeof k === 'undefined') {
			result = this.store;
		} else {
			result = this.store[k];
		}
	} else {//如果定义了k、v, 设置属性k的值为v
		this.store[k] = v;
		result = v;
	}

	return result;
};

/**
 * 
 * @param {} key 
 */
Config.prototype.clear = function(key) {
	if (key) {
		delete this.store[key];
	} else {
		this.store = {};
	}
};

Config.prototype.init = function() {
	this.store = utils.extend(true, {}, defaults, fetchCanonicalURL(), fetchDeclaritiveConfig());
	return this.store;
};

const config = new Config();
module.exports = config.access.bind(config);
module.exports.init = config.init.bind(config);
module.exports.clear = config.clear.bind(config);
