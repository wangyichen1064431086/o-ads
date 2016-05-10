const utils = require('../utils');
const config = require('../config');

function Moat() {

}

Moat.prototype.init = function() {
	this.config = config('moat');

	/* istanbul ignore else	*/
	if (this.config && this.config.id) {
		const src = "https://z.moatads.com/" + this.config.id + "/moatcontent.js";
		/* istanbul ignore else	*/
		if (!utils.isScriptAlreadyLoaded(src)) {
			utils.attach(src, true);
		}
	}

};

module.exports = new Moat();