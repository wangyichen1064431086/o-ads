/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function GPT() {
        var self = this;

        return this;
    }

    if (!FT) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {gpt: new GPT()});
}(window, document));
