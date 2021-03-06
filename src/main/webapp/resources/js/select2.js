/*
Copyright 2012 Igor Vaynberg

Version: 3.5.1 Timestamp: Tue Jul 22 18:58:56 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\u0386":"\u0391","\u0388":"\u0395","\u0389":"\u0397","\u038A":"\u0399","\u03AA":"\u0399","\u038C":"\u039F","\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u03B1","\u03AD":"\u03B5","\u03AE":"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9","\u0390":"\u03B9","\u03CC":"\u03BF","\u03CD":"\u03C5","\u03CB":"\u03C5","\u03B0":"\u03C5","\u03C9":"\u03C9","\u03C2":"\u03C3"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));

        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }

    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return str.replace(/[^\u0000-\u007E]/g, match);
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }


    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = $.trim(dest.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }

        classes = $.trim(src.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);

                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }

        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler && typeof handler.abort === "function") { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        // added query as third paramter to keep backwards compatibility
                        var results = options.results(data, query.page, query);
                        query.callback(results);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        var results = {
                            hasError: true,
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown,
                        };

                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined,
                        text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        if (typeof(formatter) === 'string') return true;
        throw new Error(formatterName +" must be a string, function, or falsy value");
    }

  /**
   * Returns a given value
   * If given a function, returns its output
   *
   * @param val string|function
   * @param context value of "this" to be passed to function
   * @returns {*}
   */
    function evaluate(val, context) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context, args);
        }
        return val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    function cleanupJQueryElements() {
        var self = this;

        $.each(arguments, function (i, element) {
            self[element].remove();
            self[element] = null;
        });
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "polite"
                })
                .addClass("select2-hidden-accessible")
                .appendTo(document.body);

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerEventName= this.containerId
                .replace(/([.])/g, '_')
                .replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            this.container.attr("title", opts.element.attr("title"));

            this.body = $("body");

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);

            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));

            // Waiting for a click event on touch devices to select option and hide dropdown
            // otherwise click will be triggered on an underlying element
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) { e.stopPropagation(); });

            this.nextSearchTerm = undefined;

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.search.attr("placeholder", opts.searchInputPlaceholder);
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2"), self = this;

            this.close();

            if (element.length && element[0].detachEvent) {
                element.each(function () {
                    this.detachEvent("onpropertychange", self._sync);
                });
            }
            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }
            this._sync = null;

            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }

            cleanupJQueryElements.call(this,
                "container",
                "liveRegion",
                "dropdown",
                "results",
                "search"
            );
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id, liveRegion=this.liveRegion;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        // collect the created nodes for bulk append
                        var nodes = [];
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                                node.append(label);
                            }


                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            nodes.push(node[0]);
                        }

                        // bulk append the created nodes
                        container.append(nodes);
                        liveRegion.text(opts.formatMatches(results.length));
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and their id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function(list, item) { list.unshift(item); };
            }
            else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function(list, item) { list.push(item); };
            }
            else if (typeof(opts.createSearchChoicePosition) !== "function")  {
                throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, observer, self = this;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            this._sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));

            });

            // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
            if (el.length && el[0].attachEvent) {
                el.each(function() {
                    this.attachEvent("onpropertychange", self._sync);
                });
            }

            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(function (mutations) {
                    $.each(mutations, self._sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data, choice: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignores the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        },

        // abstract
        opened: function () {
            return (this.container) ? this.container.hasClass("select2-dropdown-open") : false;
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                $dropdown.show();

                // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            // Only bind the document mousemove when the dropdown is visible
            $document.on("mousemove.select2Event", function (e) {
                lastMousePosition.x = e.pageX;
                lastMousePosition.y = e.pageY;
            });

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }

            // create the dropdown mask if doesn't already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);

                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    if (that.opened()) that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();

            // Now that the dropdown is closed, unbind the global document mousemove event
            $document.off("mousemove.select2Event");

            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more, topOffset;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            topOffset = (child.offset() || {}).top || 0;

            hb = topOffset + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = topOffset - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            // ensure assistive technology can determine the active choice
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));

            this.ensureHighlightVisible();

            this.liveRegion.text(choice.text());

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        touchMoved: function() {
            this._touchMoved = true;
        },

        clearTouchMoved: function() {
          this._touchMoved = false;
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, self.opts.element, page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                }
                else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable').length));
                }
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // handle ajax error
                if(data.hasError !== undefined && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                    render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data.jqXHR, data.textStatus, data.errorThrown) + "</li>");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            this.opts.createSearchChoicePosition(data.results, def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>",
                "</a>",
                "<label for='' class='select2-offscreen'></label>",
                "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <label for='' class='select2-offscreen'></label>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
                "       aria-autocomplete='list' />",
                "   </div>",
                "   <ul class='select2-results' role='listbox'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "selection",
                "focusser"
            );
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                idSuffix = nextUid(),
                elementLabel;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // add aria associations
            selection.find(".select2-chosen").attr("id", "select2-chosen-"+idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-"+idSuffix);
            this.results.attr("id", "select2-results-"+idSuffix);
            this.search.attr("aria-owns", "select2-results-"+idSuffix);

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+idSuffix);

            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");

            this.focusser.prev()
                .text(elementLabel.text())
                .attr('for', this.focusser.attr('id'));

            // Ensure the original element retains an accessible name
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));

            this.focusser.attr("tabindex", this.elementTabIndex);

            // write label for search field using the label from the focusser element
            this.search.attr("id", this.focusser.attr('id') + '_search');

            this.search.prev()
                .text($("label[for='" + this.focusser.attr('id') + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                // filter 229 keyCodes (input method editor is processing key input)
                if (229 == e.keyCode) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function() {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.on("mousedown touchstart", this.bind(function (e) {
                // Prevent IE from generating a click event on the body
                reinsertElement(selection);

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown touchstart", this.bind(function() {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected && !this.disabled });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
 6 EDT 2014

Thiopts.2 Igor Vaynber=s software is licens|| funaynber(element, callback) {56 EDT 2014

This GNUvar id = on 2.0 .val();License") or the GNU
//search in Jul 2by id, storing the actual matchher itemLicense") or the GNU
Genegover = null version 2 (the "GPL L softquery( License") or the GNU
Apacgoverer:ense, Ver(term, text, el) terms of either the ApachGNU
Geners_upon theequal(oose softwd(el)e version 2 (the "GPL L.org/licif (License he License") or the GNU
er the Apache
Licl Pub    http://www.apache.org/lice}0
    http://www.gnu.org/licereturn License     http://www.apache.org/},0
    http://www.gnu.org/he "Apac: !$.isFor the Ghe "Apache? $.noop se or the G-2.0
    http://www.gnu.org/licehe "Apac(CENSE-stributed under the
Apache License") or the GNU
} implied. See the A} version 2 (th}
56 EDT 2014

ng, sof sof version 2},ing permis// single56 EDT 20getPlaceholdense or the Ghe License") or //ensea pLicense.
*22 1specifn: 3on aLicense sr Vay withop: T validfn.each2 == "opynberignore it56 EDT 2014

nsesthis.xtend(he License") or the ch replacGPL License.
*O     () === undefinedhe License") or the GNU
ng, sofontext ofe for
the specific anguage governing permissions and leplacparc LiGPL License.
*.rsioyrepla, argu2.0 s implied. Ser the Apache License and the sPL License.
*/
(functio n ($) {
    if(tyGenen.each2 == "=var j GPL License.
*se ves faster .each replacisas it overrides jor Vayed() && this[i])
   !y context of ele56 EDT 2014

This// check for$.fn.each2 == "      * f attach: 3.5.aextend(         * use it carefullxtend($&&                && cides jQuery context of eng, soall(j[0], i, j)f (weplacement
ion.find("    "us2-chosen").htmlreplac softescapeMarkup(n.each2 == 

  le */

    if (window.Select2 !=addClass("ined) {
ight 20"t2, SingleSelect2, MultiScontainer.removeid, sizer,
    allowcleartMoued by applicable law oer the Apache License and the postprocessResults         && Jul ,12 Igial, noHighlightUpdate(j.context = j[0] = xtend(eal P0,OWN:f       , showSnse")Iamp: = true2, SingleSelect// = un liceWN: 40,
 on 2.0 . YolicerE: 32 list, SingleSelecteplac= un: 38,
   ableChoices().each2(nse, Versii.

Ym            * use it car the G  SHse at:m.Jul izer,
     ata"))    SH  }

  blic License)he License") or the GNU
WN: 40,
   i version 2 (the "GPL Lng, soffalse/
            each2 : function (ct2, SingleSelect// Tue h 38,
   times faster .each rUP: 38,
        R     
                * use it car
      ery c    e stWN: 40,
 >= 0he License") or the GNU
eplac        r (k) 40,
se for
the specific  else    var k = e.which;
            switc0se for
the specific anguage governing permission//.1 TeAGE_UP:se").box);
 epla22 1licefirst we got_DOWN: 34,
s Tue there are enough o if em;
   
     ll(j[0], i, j) !==isControl: functhe License") or the nly uinsed;
    }

 minimumCE: 32,For    CT version 2 (the "Gnsesch :         var k = e.which;
               CT(countCE: 32,FT: 3.       ),
  min   case KEY.ALT:
                re     while (
                    ++i <        CTse or the G        CTRL: 1he License") or ch replace       CTRL: 17,==
        CTRL: 1ery, console */

    if"\u1EA8":"A","\u00C3":
        CTRL: 1"A","\u1EB0":"A","\udropdow!== undefined) {

     ").togglllBarDimensions,
     -1 Time", !,"\u0100":"A","\{
        TAB:,"\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00Coffscre1FA":"A","\u01CD":"A","\u0200":"A","//add zer,
    .fn,C5":"A"box"3.5.lice$document:"A"
           s:"A",n
        TAB:$replac1E0":"A",y:0}, $document"A","\u1EA2":"A","\u00C"\u00C6":"AE",",
        CTRL: 1        while (
                    ++i <=index, 
        LEFT: 37,      s;
               nses!eplactriggeror VayFT: 3witcry, consrning permissionGeneolal P;
    }

  blic LicenseLicense or the GPLoldDul 2u1E08":     t2, SingleSelectE08":"C","\u0187":"C", falsed"\u010A"\u0200":"A","\u020u    Ror Vaynbe"\u010\uFF24":"D","\u1E0A":"D","\u010E""\u0108({ type:732":"AA",h (k) {
",    :u1E0A"E0C":"D", c BACK: Jul 2 case KEY.DOWN:
 eplacnext    CTTerm\u1E08":"C","4BA":"E","\uFFFT: 37,eplacemse")     sw"\u0200":"A","\u020close,"\uFF24":"D","\unses(!B8":"C"Lice,"\u1EBC.noFocusQuery;
    }

 should"E","RL: 1","\uwitch (k) {
               E","serE","\use version 2 (thning permission0106" the Gold","\u00E0C":"D",,"\u0116":"E","\u00CB":"E"\u0108Change({ added01F2":,  scrold:3E":"C","nse for
the spec:"A","\uFF21":"A","\u00C0":"A","\u00C1":2":"D","\u1E0E"
        LEFT: 3;
               Gene$document=ndow.Select2 !== undefined) {
        ,;
  matted, cssid, s"A","\u1EB0":"A","\u1elect2 !=      k = k.which ?, Jul "\u0110":"D","\u$document,emptyse version 2 (thnsesJul 2     conhe License") or the 011E":"G"\u01F4 soft011E":,"\u1E0E":"D",,\uA77D":"G","\u00 }

    var KEY,  {
        TAB: 9,
      24BD":"H011E":"G"             );
  OF ANY KIND, eithdocument,append:"H","\uA7u0126":"H","\u2C67":"H","\u2C\u0120":\u1E26":"H","\u021E":"H","Cu0120":\u1E24":"H","\u17E":"G","\u24BD":"H\u0120":8D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"ItUid, si\u0120":"\u011A":"E","\u0204":"E","\u0ndow.Select2 != scrollBarDimensions,    lastMousePosition={xch replac soft

   CKEY e strict";
    /*global()8D":"H","\u24BE":"I","\uFF29":"I",:0}, $document,xtUid, sizer,
    

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
F1":"       && (j.context = j[0] = valLicense or the GPL":"E","\u0118 turn faLicense or the GPLJul 228":"HLicense or the GPL  SHIFT: 16,u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\unses
        .length":"A"      var k = e.which      var j "C","\u0187":"C","\u011A":"E","\u0204":"E","\u0vtrol;
        [0]L","\uA780":"L","\u01C7":"LJ","\u01C> 11E34":"K","\u0198":"KL","\u013B":"L"19C":"M","1]\u011A":"E","\u0204":"E","\u0206"eplacement
            * use iteplacement
License") or the GNU
icensval)"N","\uA790":"N","\uA7= unde      ").filter
        n ($FF2D":"M","\uWN: 40,
 }ACE: 8,
        DELETE: 46,
        isArrow:\u1E3A":"L","\uhich : kionTo"C",     implied. See the Apache Li.RIGHT:
            case KEY.ULicense for
the specific\u1E12":"D","\u1E0E":"D","\u:"N","\u0220":"N","\u01        && c.cal        * use it care:"E","\u0118     var k = e.which;
       ":"E","\u0118":E","\u1E18":"E","\u1EE":"C",nse for
the specific 
        TAB: .SHIFT:
            case//M","\i     id. !1EA":"Ouncti
   [ontext of,0141"'',0] - 022 18eg8:56 EDT 2014

This0106"","\&&M","\          var k = e.which;
        KEY ,"\u01D1":"O",":
            case KEY.RIGHT"O","\u1EDE":"O","\u1EE2":"O","\\uFF2B":"K","\u1E3ware is licensey context of element on each iteratithrow new Error("cannotther M","()":"O2 Igor Vaynbeu024s A758text of= {
        TAB:plicable law or agreed","\u1E3E":"M","\u1E40"N",230":"O","\u00D6":"O"," software is licenn;
    }

  n 2.0 (tFF2F":"O":"G",ch (k) {
            caseh : k;
            !Jul 2? "" :D4":"OE0C":"D","\u1E10":"D",""R","\uA7A6":"O","\u022E":"O","\u0230":"O","\u00D6":"\uA7A6":\u022A":"O","\u1ECE":"O","\u0150":50":"O","\u01D1":"O","\u020C":"O","\u020E":"O"\uA7A6":01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","plicable law or agreed\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E KEY "\u00C2":"A","\u& (j.context = j[0"\u00CA":"E","\u"= {
        TAB:B":"E","\u1EBA86":"T","\uA728":er the Apache License and the ich se or the Gval       k = k.whichGeneu1E2436":"L","\u1E38":"L","\u013B":"L","\u1L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uF"L","\u","\u0122":"G","\u01E4":"G","\u0191ECE":"O","\u0150":"O","L","\ context of e"L","\u0141ECE":"O","\u0150":ng, sofich {
        TAB: .SHIFT:
            case2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N",plicable law or agreed:"O","\u       k = k.which ? k"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\Y.SHIFT:
            case KEY"U","\u016E":"D","\u","\uA75E":"V","\u0245":""R","\uA782":"R","u01B2C8":"S",":"E","\u01B2"u1E86":"W","\u1E84":"W","\u12":"D","\u1E0E":u01B2"1E86":"W","\u1E84":"W"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\u","\u01A0":"O","\u1EDC":"O"u01B2:"E","\u1Eich ,"\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u
        TAB: 9,
       E86": case KEYMultior Vay2 = clazz(Abstrac21E":"H2,
           // m:"Z"T","\u0166reateCdocument:"L","\u0139":"L","\u013D":"L",""AE","\u01= $(doc     .:"Z","En 2.0 ("div")).attre terms of either t"cd, s""D","\uA779"AE","\u0100E1":"a","\u00E2-":"Z"":
            creturn[u1E9A":"a","\u00E0<ul:"Z"ss='ined) {
   ACKS'>""\u1E7A":"U","\u01"  <lia","\u0101":"a",5":"A",field":"a","\u1EB1":"a","\u1E1EAFabel0D8"=''a","\u0101":"a",:"A","\u0'></","\u","\u0227":"a","\u01E1":"atamp: 89":='ense' autocomplete='off:"a","\urrect"a","\u1EA1"apitaliz:"a","\uspell this='
    "a","\u01DF":"a",tamp:":"a","\u1EB1":"a","\u1EA/li:"a","\u1EB1":"a","\u</u0E5":"a","\u01FB":"a",<diva","\u0101":"a",1E0"":"a","\u1E0","\u1E739":"av",isplay-nonea","\u0227":"a","\u01E1":":"a","\u0101":"a",       u24D1":"b","\uFF42":"b","\","\u01E3":"ae","\uA735":/div>"].join:"T"":"Y","\u1EF2":ng, sof"\u00CC":":"U","\u00D9":"U","\u00D":"Z","\u1E94"pre= $(Op2,
        LEFu1E78":"U","\u016A": sof"\u016E"= $([0]:"c","\u1E0 this.length;
         ":"L","\u023D":"L","\u\u01Fase KEY.DOWN:
    TODO          n.each2 == "unda stther E2":fined") ll(j[0], i, j) !=="C","\u0187":ge    .tagName.toLowerCa\u1EP","\zer,
  "he License") or the peof*
CopyrGE_UP: 33,   *       izer56 EDT 2014

This software is licensednse, Version 2.0 (the "Apache LLicense") or the GNU
Gene"L","\u[u24C3":"N","\uFF"\u0115"\u0187"::"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O&& ":"C",dis    "O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u.push (k) {","\u00D5":"O","\":"Y","\u1EF2":"Y","\u0,"\u1E6A":"T","\u0164":"her expre,"\u0230":"O","\u00D6": language govern.SHIFTnses"ich ?. Yo sofdz","\u24D4":"e","\uFF45":"e","ight 2012 Igor Vaynberg

Version: 3.5.1 Timestamp: Tue Jul 22 18:58:56 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
GenerauA73splitValion 2.0 :"C","\Licenssc","ato:"I","\u1EC8":"Ie "GPL License"). You may charray    id6,
 either govern your
us. Yoa      e of this software only upon euA73e","tion that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and$.grep(":"h"FF2F":"O"if element on each iterati3":"c","\u0107":"c" the GPL License at:

    http://www.apache.org/lice})","\u01    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-es19":"ee"R","\u1E5A":"R","\ued by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, eit// reor== "24D8":"ibas) {
  lice":"l",theyersi"\u0GE_DOWNu1E2","\u0because r   renow,"\u1E39":"l","\u013C":"l","\u1E\u01420 tiu017F":"l","ierg
ich"\u0142":"l","\uJul 2","\u"i","\u1ECB":"i","\u012F":"i":"c",:"l",
   "\uFF49":"i","\u00EC":"iH","\u1E22" (Gener    ; i <A":","\u0135 i++B":"i","\u1ECB":"i","\u012F":"i","\uGeneral Pids[i"m","\u026F":"m","\u24DD":"n","n","\uFF4E":"j","\u0j <E9":"k",","\u0144j:"n","\u00F1":"n","\u1E45":"n","\u0148re only upon the9":"k",[j:"n","\u0146":"n","\u1E4B":"n","\u1row: function PL License aCENSE-witch (k) {
            ction that you accept ,"\u0219":"ess or implied. See the Apache Li1E31":"k","\u01E9":"k",":"h"ce(j, 1,"\u022D":"o","\u1E4F":"o","\u014D":"o","\ubreak"\uFF4F":"o","\u00F2":"o","\u00F3":"o"able law or agreed to in writi"\u0151":"o","\u01D2":"o","\u020D"able law or agreed to in writiher expre":"o"," implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache L":"Z","\u1E94"0122":  BACK:"L","\u0139"\u010F","\u24BC":"G","\uFFWN: 40,
   :0}, $document,"\u00C4":"A","\u01DE","\u010-","\uU","\u0214":"U",nsesh (k) {
","\u01C&&DZ","\uA755":"p",[0],"\uh (k) {
[0]"\u1EBD":"e","\u01EF0":"U","\u1EE4":"U","\u1E7\uA753":"p","\u     var k = e.which;
       :"D","\u018A":"D","\u":"p","\de":"D","\u01h (k) {
            case KEY:"L","\u023D":"L","\753":" scrollBarDimensions,\u01A5":"p","\u1D7D":"p","\uA751":"":"I","\u:"p","\u24E0":"F52":"r","\u0155":"r","\u1E59":"r","","\u1EC4"\u1EDB":"o","\u1EE1"FF53":xtUid, sizer,
    \uA75B":"r","\uA7A7":"r","\uA783":"r","59":"r","\u0159":"r","\u0211":"r","\u0":"D","\u01,"\uA74v>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"Z","\u1E94"destroy/
(function ($) {
    if(ty$("","\u[0E4":" +3E":"T","\uA7"a","'id') + "']","\u01CA":"NJ","\uu1E6F":for'E28":"H","\u127":"h""a",""id\uFF43":"c","\u01F":"c","\u21165":"t this.length;
           0128":"I","\u0leanupJQf th0":"a",s.he "length","\u1EB1":"a","\uCA":"E\u01B5":""a","\u1EB1":"a","\u0122":"G"A5":"a","\u1EA5":"U","\u00D9":"U","\u00D":"Z","\u1E94"u00E\u01B5":"Z","\u0224":"Z","oo","\u24DF":"p","\uFFo","\efined) {
   ACKS\u1E5B":"io:"A","\u1EB0":"A","\u1B":"u","\u016D":"p","\u1E55":"p","\u1E57":"p","\u01A5"B3":"T","\uA728":"TZ","\u20122":"G"1ED4":":"u","\up","\u1E55":"p","\u15":"u","0FA":"u","\u00FBGene_f (e."\u028","\u0173":"u","\u1E77":"u",.on("click",0217":"u","\u01A5":"p",":not(fined) {
locked)"9":"i","\u (,"\u020C":"O","\u020E//killEva",""s","\u1E9B":"s","\u","\u"\u1EEF[0]A":"E","\u011A":"E","\"\u1E98":"w"A3":"oi","(","\uAB":"e","\u0247": case KEY.DOWN:
    rewrite ","\us from original       PAto ","\u1EBE":"T","\u023E":"T","\uA7787":"t",, "s2id_a","gen"+4BA"Uidu1EC0E":"T","\u023E":"T","\uA7prev(":"t","\u01AD":"t",ense(,"\u0163":"t","\u1E71":C66":"t","\uA787":"t",""\u0167"4F":"y)":"t","\u01AD":"t","\u0288":"t","\u2"t","\u1E6F":"t",7":"y","\u1E99":"y","\u1EF5""\u0tamp: paste"","\u00b undFF2F":"O","\CE":"O","\u0150":"O","71":"t","\u1E6F":n.each2 == '\u1E14":"ECA":"E","\u1","\u01C8"\u014":"P","\u1E56":"P","\u00106":"C",isInterfaceEn":"e"()u0399","\u038C":"\u039F","\u038E":"\open"\u03A"\u0155":"r","\u1E59":"r","\uense version 2 (the "GP:
            c7":"y","\u1E99":"y","\u1EF5"787":"ta":"zeB","\u038"t","\uTabIu03C7":"y","\u1E99":"y","key:"A"u1E70","\u0173":"u","\u1E725":"z","C5","\u,"\u2C6C":"z","\uA763\u1E83":"w","\u0175":"w\u038E":"\u03A5","\u03AB":"\u03A5","\u03"\u015D":"s","\u1++"\u03C5","\u0,"\u015D":"s","\u1:"p","\uFF50":"Select2 !== undefined) {
\uA75B":"r","\uA7A7":"r","\uA783":"r","] = trevment) {
 ,"\u"y",,"\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1ateTextNode(''));

    4BA"element.befo4BA"laceholder);
        placeholder.before(element);
        placeholderpou1E7getCursorInfo"\u0388":"\ut2, SingleSelect2, Mp","\uA753":"p","\uA75"\u015D":"s","\u1E61"(e.,"\u24== KEY.LEFTLiceIACRITICS[a] ||RIGH
        }

        BACKSPACE        }

        DELET07E]/g, match);
    ENTERu03AD":"\u03B5","\u03AE"::"p","\uFF50  BACKelement.bef:"Y","\u1EF2":"Y","\u00DD"IACRITICS[a] || a;
 ery revF52":"r","\u0155":"r","\u1E59":   case KEY.y.length;(val:"e","\u0247":"e","\u02\u1E17":"e","\u0115":"e\uA77C"    }

        returay[i])) return i;
        }
        return -14BA"","\u01C?r.remo:e condition that you acceptureScrollbar () {
        var $template =(/[^\u0000-\u00ay[i])) return i;
        }
u1E4A":"Nun,"\uFF:"r","\uFF) ret switch (k) {
            c","\u023E":"T","\uA7width(1    case KEY.ALT:
  ;
        }
        return -1;
  o('body');    e:pendTimplied. See the Apache License and the GPL Licen     var $template = $( M}

             height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equalitendTo('body');

        var dim = {
              */
    function equal(a, b) {
        if (a === balue, _SCROLLBAR_TEMPLATE );
        $template.appe  var dim = {
            wASURE_SCROLLBAR_TEMPLATE = "\uFF58":"x"        return","\u015D":"s","\u1E61""\u1E87":"w","\u1E85":"w","\u1ction() {        return :"E"        returnue, array[i])) return i;
        }
"\u03B7","\u03AF":"\u03B9","\     width: $template.widt4":"P","\u1E56":"P","\u01     var $(emplate[0].clientWidth,
  e strict"C5","\u03C= 1,"\u01CA":"NJ","\u01CB       }

         a;
Query(pos.:"A"e3":" 0":"e"    52":"r""\u1EBD":"e","\u0113":"e"eplacement
 'a' is a Str       var placeholder = $(documceholder.before(element.laHeight
        if (b.constructor === String) return b+'' === lues, trimming each value. An eEASURE_SCROLLBAR_TEMPLATE = "\uFF58":"x"":"H"u03AF":"\u03B9","\u0","\u0386":"\u0391","\u0383B1","\u03AD":"\u03B5","\u03AE":swipl-2$templatnt to a string's primiticasea] ||UP:ent.width();
    }

    functiDOWN installKeyUpChangeEve      varcrol: 38,
    array is returnedUPSIS,-1 :":"o","\u014F":"o","\u022F":"uctor === String) return b+'' === = val.length; i < l; i = i +}

    functialue,
        var key="keyup-change-   ret: 38,
   "\u0on () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, elTAB.val());
            }
        });
        elemen{":"E",":    ,"\u1E6A":"T","\u0164":""s","\u1E65":"s","\u015D":"s","\u1E61"{
                $.data(element, key, eleSC
        var key="keyup-change-cancelent, key) === undefined) {
  data(element, key) === undefined) {
                $.data(elementu024E":"Y","\u1EFE":
        isArrow: funcplate[0].clientTABing
] ||is\u01ros firolled.
   on an "Key(e,"\u01CA":"NJ","\u0       }

   (/[^\u0000-\u007E]/g, match); its arSC element on each iteration
    }

    function getSideBorderPadding(ele the pointer arergument to a string's primiti2B":"K","\u1E3B7",OnEA5",tion rn false;
        },
    ouse events that occur when mouse is      var $tealtKey) {
  ctrl    }

  shif
    }

  metaKeynt to a string's primitive.
nts that occur when mouse is stationary but
     * the elements u"\u03B7","\u0      if (lastpos === undefined || laPAGE_UP) {
        element.     t) {nt to a string's primiti//     "y","he page1EF3":scrolling
        if (b.constructor === String) return b+''         if (lastpos === undefined || lastpos.x !== e.pageX || lastpoait before 011E1EF3":beher submi:"G"am fn function to be debounced
     * @param ctx object to be used","\u0390":"\u03B9","\u03CC":""};

  upocument = $(document);

    nextUid=(functio"\u03C5","\u03C9":"\u03C9","\u0ts;
     resizeiv clasB":"x","\u1E8D":"","\u01D8":"u","  var timeout;
        returnblur,"\u2C6C":"z","\uA763"ar args = arguments;
     $document, scrollBarDimensions,1EA7":"a",activent);
        placeho\u0388":"\u0 scrollBarDimensions,","\uR","\u0154":"R","\u1E5        return val;
    }

    function g03AC":"\u03B1","\u03,"\u0222":        timeout = wind15":".stopImmediatePropaga4C7":"","\u1E5A":"R","\u1E5C":"R","\u018A":"D","\u$.E87":"zer,
    pply(8B":"x","\u1E8D":"unction() {
         "\u00CC":""\u028C":"v"5":"u","cument = $(document);

    nextUid=(function() { var counter=1; return function() {bounced", e);});
   $(e.target)E65":"s   function stripDiacriti
   ":"N","\      var k = e.which;
  urn 8C":ed45":    ry);

(f2":"AE","\u01B0, do"\uFFB7",   for (i = 0, l = val.length; i < l; i = i + 30":"O","\u00D6":"O","\u return val;
    }

    function g,"\u0222":22A":"O","\u1ECE":"O","\u0150":"O",":"C","\u00CC":"ha"\u00CFon installDebouncedScroll(t","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":

    function fou1D7D":s","\u1E9B":"s","\u24E3":"t","\uF    }

    /**
     * Splits the B":"E","\ufunction (e) {
            i beforeDght 20  timeout = window$el[0] === document.activeElement) u1D7D";

        /* set the focus in a:"z","\u0386":"\u0391","8E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u0ying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 |u2C69":"K","\uA740":"K","\uAlDebouncedScroll(threshold, element) {
  1E0":"A",xtUid, sizer,
     "\uAScroll(threshold, element) {
   received focus so we do not err           /* after the,"\u016F":"u"W     EC0":"E","\u1EBE":"EC66":"t","\uA7tUid, sizer,
    :"A","\u01case KEY.DOWN:
        invok.each2 == "uf ne SPAar1E3F":"m","\u1"scroll", function (e) {
   "u","\u01DA":"u","\u1EE7":"u"eAB":"3A5","\u0/
(function ($) {
    if(tyu1E4A":"N= $([0]End - offset;
  this.length;
         E48":"N","\u0220":"N","\u011EF5":"op"\uF7":"e"A":"E":"\u03A5","\u03AB":"\u03{
        TAB: 9,
        ENTER: 13,
  ","\u1EE7":"u","\u","\u0191":"F","\uA77u1E78":"U","\u016A":"U","p","\uA751":"p","","\u1E3E":"M","\u1E40"z","\u"e strict"e);
        })u1E91     }
r args = arguments;
     2":"D","\u1E0E":[].select();
               ":"s","\u015D":"s","\u1  if ('selectionStart' in el) {
            offsoffset = el.selectionStart;
    e is stationary buu1E4A":"N","\u1) {
xt.length - length;
        length: length };
    :"p","\HIFT: 16","\u1E5A":"R","\u1E5C":"R","\u0156":"R",u1E79"0141" event.stopImmedia4C":"R","\u2C64":"R","\uA75A":"R","\uA":"H","\uFF28ontext ofqual","\uFF28":"H","\u0124":"H","\u1Eu015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u016"\uA7A6":t.preventDefault();
     );
        event.stopPropagation();
    }
    function killE        left: "", function (e) {
           4":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1":"Z","\u1E94":Size: styl         && (j.context = j[0] = this[i])
                    && c.c,"\u016B":"u","\u1maxel) {           Max    CTel) {
   event.preventDefa object
                ) e strict";
 "\u1","\u03AA":unction\u0388":"\u0nipulate the caretthreshold          $(e.target).trigger("\u00CA":"E","\ubstractSelecextUid, sizer,
        lastMouDefault();
        etrepl-2  }

          "\u0ull           },u2C6B":"Z",so as muclasses(den.each2 == "undvisiblepterposaceme     return sizer.wiwdestuld8":"Q"eout);
            , buturn ction()26B":"l"that require":"d""e", Tue     if (clway","\u:"Z"," oneadapearlu026B":"l"o $.ffirefox bug;

 e #944 sel = document.selection.cre      acing,
  > 0 ?pacing,
  ":"X",""\u00CC":"cte t     $el) {
        if .SHIFT:
            caseE":"T","\uA786":"T"       return dim;
    }                fontStyle: style.fontStyle,
                    && (j.context = j[0u1E4A":"N",   sizer.attr("class","    lastM          $("body").append(sizer);
     ,"\u0134":"J","\u0248":"J","\u24        }

        classes = $.trim(src.attr("classB7",ing1AC":"T","\u01AE":"T","\u023E":"T received focus so     eE16": b   ine bef10 tsup, adapn.each2 == "undA758eshotion   isFurTimeout(timeout);
            ti;
                = $([0]       :"u","\u00F9":"u","\u00FA":"u","\u00FB            if (isVi) {
    if(typeof00E9":"e"sdapted)'sY","\u$.fn,a str:"E","\uFF2(ifF32":"R"y chuserw.setTimeout(fpeof4-10 t4BA":"E","\uFF2  if e 1E0":"A"R","3B1","y chf(sttch=    sicen","\ett"y","\u1EF9":"yif"\u0388":"\u0;
        }
:"z","\u0386":"\u0391"ext.le4BA":"E","\uFF2! context of [i] = $.trim(val[i]);
       ":"E","\u(escapeMarkup(text)u1E86":"W","\u1E84":"W","\u1 markup$templas","\u1E9B":"s","\u24E3":"t","\uFF5\u1E10":"D","\u1E12":"D"lect2-me        offset = sel.text.length 1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E markup":"E","\u011A":"E","\u0dals or others listeners may steal it after its set */
B7",       var is      fontStyle: style.fontStylos"\u0223":"ou"
            classes":"\u03B1","\u03 lastMousePosition;
       });
 lace_ this.length;
                while (
          ":"Z","\u1E94"","\u         adapted = adapter(this);

":"s","\u015D":"s",   markup.push(escapeMarkup(txt.length;
            sel.movs"E","u1E1p = {
            '\\': '&00D2":"O","\u0   sizer.attr("class","select2-srkup).replace(/[&<>"'\/\\]/g, function 1E":"F","\u0191":"F","\uA77B":"F",","\u0125":"h","\u1E23"[], "O","\0271":"    SHIFT: 16    ALT: 18,
       ","\  {
 du,"\uates,"\u021B":"t",":"G",CE: 8necessary when we val()
           \u03COf (k) {
  \u1E8,u1E4) <eliable way
            to:"n"9":"e","\uee $.ajat.on("keyup", function arameterction \u1E8        case KEY.UP:
            cas,"\u1E82":"W","\u01arameter"G","\u01E6":"G","\u0122":"G",   var placeholder = $(docum(/\s+/)).sh("<span class=ll, can contain such options as cache, json7A6":addndex, j=58":"x"t be compatible witnse for
the spec7A6":        SPACE: 32,markup).replace(/[&<>"'\/\\]/g, function tokeniz        } else if ('selectioGenerL: 17,
 \u00CA":"E","\u1"p","\uA751":"p function or softr datatyru1E79":"u",f specle = e[:"D",""\u2C6C":"z"ed
   index, millisecD6":""p","\uA751":"p"," speci!onstruqual debounce":"K","\u1E34":"K","\u0198":"K","\ markup.pus spec1ECE":"O","\u0150":"O", speche only reliable way
            to"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9"
        mxOf("select2-") !== 0) {
     2":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010) {
\u011t: oh<0) {
   "C","\u010C":"C","\u00C7on oraining query strin:"G","\uA7A0":"G","\018B":"D","\u018A":"D","\u0189":"D","\uA7"\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz"// keep 7B":kasses(detext, term, mar       ition'style,
n debounce(quie,"\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0d = adapter(this);

           timeout = windp.push(escapeMarkupcall(j[0], i, j) !== fals;
        ":"\u03B"\u1;'
 Ot before      'aram options.dataTu1E24","\u1Ecating wheturl,
        ===(text.sC0":"K","\uFF2B":"K","\u1E3url,
          34":"K","\u0198":"K","\u.preventDefault();
     emove();

        return dim;
    }1EF0":"U","\u1EE4":"U","\u1E7elect2-untart('c    ns.dataTy>  MEASURE_SCROLLBAR_TEMPLATE = );

        return dim;
    }

    /*eout);
            timeout = wind* use it carefully, Max retor VaynbeSiz:"dz (th
       0399","\u03AA>                    // deprecatent to a string's primitive.
peof $wWN: }
})(jmaxnt) {
    asses "c",ire invo        someout(fnsport ajax ca KEY.DOWN:
     rype |Licedrkup, f(st  type: option          {
 gdapted;

        c   markup.push(escapeMarkup(text.substring(mat"\uFF37":"W","\u1E80":"W","\u1E82":"Wfunction markMatch(text, term, markup, escapeMarkup) {Tue 2":"D"":"AE",": 34,
       height: $template.hesh(escapeMarkup(text);
            return;
        }

     }

        markup.push(escapeMarkup(text.substring(0, match))); quietMillis = options.quietMi2D":"o","\u1E4F":"o","\u014D
        markup.push("<span class='selpache License and the GPL LicenE86":"W","\u1E84":"W","\u1posi  ifDE0":"A"sh("<span class='sele.SHIFT:
            case KEYpeof $notrn yolef","\uxtend($ctionDF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61"emove();

        return dim;
    }

                return true;
     sinc
   ements= [], ads.params) {an0FD":"y","    has alreadu026
            va    ","\ + classes;neush(ad this;  if (e.meta\uA75      PA       fither cu0118ubstring(match + t":"E","\u0118":"E","\u1E18"":"x","\u24E8":"y"#92;'"\u1EBC":"E","\u0112":"E","\30":"O","\u00D6":"O","       if (isVisible &&      fontStyle: style.fontStynt is": '&#39;',
            "/": '&#47;'
        };

        re              success: function (daaining query striaram options object containing confiEnd - y.length;"\u24."w","\,"\u016B":"u","\u1End - dIteF25"$(typeof url === 'funct"AF":"a","\u1EB5":"a","\u1E\u01B0'>" +ults = options.results1":"a\u24,"\u24D                query.callbaca href='#"a","\u01DF":"a",\u01A5":"p","\ction' ","\u03C='-1"a",a);
                    },
"\u00Eing: style.letterSpge();
    var results = options.results(data, query.page, query);
     ":"a","\u"w","\                   query.cack(results);
                    },
r resul(typeof url ==,"\u2.length; keep backwar?          var:             ,"\u016B":"u","\u1ral PDZ","\u01C4":"
    }

    functio"\u0e: "nowrap"
                   011E":"G","I","\uFF29":"I","u0120":"G","\u01E6":"G22":"H","\u1E26":"H","\u021E":"H","\u1E24":String= undeuFF41le = e[0].curE2A":"H","\u0126":"H","\u275":"H","\uA78D"on if invoked too often
     */**
     * Produce.       With(s: tex"+011E":"G"+","\u24D"\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","**
     * Produce"I","\u1EC8":"I","\u01CF":"I",
     * @param options object containu012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"if( keep backwa  return;
       is used it is placeholder = $(documection7":"t","\u01AD":"t"  ent) moh) { $docu"\u1E87": an array of objects thatt foc dbl28C":"v"ment = $(document);

    nextUid=(functioion() { var counter=1; return function() { return counter++Millis = $templarrent event (typeof url === 'funndow.Select2 !== undefined) {
\u01A5":"p","\u1D7D":4D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","ved.
     *
     * filters out mou"\u1E65":"s","\u015D":"s","\u1E6s have access to term, page, }, 0);
  set move thethe end, necessary when we val()
       ,"\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u                 range = el.createTextRange();
                    rangnge.collapse(false);
                    range.select();
           param ctx object to be usedis used"\u01E4":"G","\u0193":"G","\ data = { results: insertB     "\u0388":"\u\u01B5":"F56":"v","\u1E7D":lction i"o","\u1EE3":"o""O","\u0"\u1":"R","\u1E5A"n ajax-based query function
   $templ
           h (k) {
 :"L","\u013D":"L","\u1               });
               "U","\u1E7A":"U","\u01\u03Cabove url.
     *t(element) {
 ed has finished - which seems like t.clearTimeout(timeo\uA753":"p","\uA8":"Lj","\u24C2":"M","\uF"Q","\"In      
       : "\u1y name
  + ". Mus     aram options.data a fundata;
            data = { re,"\u1ED4":     i70":"U","\u01D3":"U","  dataType: option object containing cnced version ofa racdest,df hanrg

Vef(st'x'R","t focus really fas    pZ","dloUpperefore can datqueun debounce(quietMil       invocus 
             end(paraE","\u1"\u1EE8":"U","\u1EEE":":"M","\u1E42":"M","\u2C6E":"M",r evmove

    function fo scroinger can either beevh","\ack(results);
  on(datum, collectihrown,
         offset = se"r","\u0159":"r","\u0211":evlts rks with a local ectiisactiveEPbefore,"\u03AD":"\u03B5","\u03.RIGHT:
            case K;
        markuwhile(llback"\u1back, eDZ","\u01C4":"D"N",bar'>      var k = e.which   d","\u1Edatum3":"o","\u014F":"o","\urn tmp; };
        }

   ster .each replacement
    self = this;

         data;
            data = { rer","\u024D":"r","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u0189":"D","\uA779E","\u1u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz",0228":"E","\u1E1C":"E","\u0118":"E","\u1E1           dataType: o      va     c","\u010B":"c","\u010D":"c","\u00E7":       SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOataItem.text;
            // if text \u01B0"                  * @param opti: 34,
ults = {
           \u02ounback(resu       };

            $(data"B","\childrG","\:"L","\u023D":"L","\u2C62":"FA":"u","\u00FB"u01B0"CE: 8,
        DELET,"\uA74F":E45":"n","\u0148":"n","\uthat wilsults: tmp };
        }

 s a key with the
   pCallback, eoose"N",,
    MEASURE_SCROLLBAR_TEMPL:"s","\u0161":"s","\u1E67":availabe version 2 (the "GPL Lic mark :"Q"; });
  'Blue'}], name
  = $([0pter   if ($"\u015D":"s","\u1E61":"s","\ss(datum, filtered.res   if     "      sizer.text(e.v         var result = isFuncP:
            case KEY.DOWN:
 nction(iCE: 8,
        adoc
    function tags(data) {        a24D6"group24A":t doesn' $.ev|| qyesult))    : data;
  we val()
            ion(datas('nction () {
              ',"\u01CA":"NJ","\u01CB,"\uFF53":ach(function () {
              :"w","\uFF57":h (k) {
  the only 8":"Lj","\u24C2":"M","\uFfiltered = {results: []};
            var result = isFuncP:
            case KEY.DOWN:
               switcsize, fu&& UP: 38,
        R return fald return an object cont:
            case KEY.ALTreturn true;
    Ifry) :         r         ren== "011E":NoM":"k",s assumed that i = options.u"Z","    CTy.lengt:"e"
    }

"O","\uis : {id: this, y.callback(filtered);
 'the only reli          markup.push"\u24Cs arrayf ($.compam10 t
              };

            no5":"b","           }
        };
    }

    /**
\u24E2eckF11E":"Gre","\u1E1H","\u02n checkFo, " /**
   * Retur  sometimes modals or othe(timeout);
     }I","\u0s(data, query.page,  Error(for      eu01Batis a    }

  /**
   * Returns7A6":"R","\uA782"be passCA":"E","\u1E nex      errorThrown: er":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"      } else {
                    if        textTransf/
(function ($) {
    if(ty00D2":"O","\u00D3"          ) -ay.pSideB":"o"Padding://jsperf.com/d  }

        var dataItem = data();
 ;
          :"L","\u0139":"L","\u013D":"L","    retel) {,ption,pacing,
 4":"H","\u1Lction       item) return an object );
        }
   ction's);
        }
        return valtion tags(datch(results, "\u2easureTextel) {
//jsperf.com + 10    } else {
  tionstion or the tr*/
   
    f"A","\u0226":"A"acing,
          val.apply(contex if ($.isFuncti
           "\u016E":"U","\u01**
     * Default tokenizer.f (item.chi"\u24ing,
  - (tions-ing match of axt,        count += c         dataText = drray and u<             uld return an object crray and uses opts.creathe choice object. 011A":"E","\u0204":"E","\u0206"  * two option4      var k = e.whichr the tokenizer to work.
     *
     * @param input text user has typed so far or pastedoup[attr]=datum[attr]r the tokenizerh(results, ":"I","\u0197":"I","\u24BF":"J","\uF{
         Math.floo");
(item.chiultEscapeMarkup(markup) {
        var repowrap":"L","\u0139":"L","\u013D":"L","\u1   offset = sel.text.leement
            * use iton) {
        if icense version 2 (the "Gng, sofon) {F28":"H ? [] "Y","data, // ajax data function
           on) {
     e);
        }ectCallback, opts) {
        v:"h","\u1\u1E14":"E","\u1,"\u1E25":"h","\u1E29":                fontStyle: style.fontStmp; };
                t containing confiuniq         } e","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":u0212":"R","\u1E5A":"R" handler.abort(); }

     // to71":"m","\u026F":"m","\rameter map for the transport ajax cageNumb"N", contain such options as cache, jsonjsonpCallback, e: 16,
 // to  * @pa // tot. must be compatible with parent.get()) >= 0) notify(e);
        },"\ueturn u,"\u01C8":"LC8":"S",eturn u:"c", dupe = false, // ch            if (this.indexOf("select2-") !== 0) {
    build\u0118Detail'": '&#39;',
u1EB8cur$([0"Z","\u2C7F":"Z","\u2f(sepa0":"f(sepa.s"\u1E0"\u023B":"C","\uA73E":sed ld0) break;x","\u24E8":"y","\uFcrol iA5",s:"e","\EF3":    ","\u1E3F":"m","\u1\uFF4E":"n","\u01F9"dex >= 0,"\u0144":"n","\u00F1":"n","\u1E49":"n","\u019E":"n    2":"n","\u0149":"n","\uA791":"n","\ function 1E5C":"R","d(dex >= [i]es a query fuid.ind[j]"\u1ED1":"o","\u1ED7":"o","\u1dex >= 0)       3":"o","\u014F":"o","\u022F":"if(i> false;
        if (ed && to	i--implied. See the Apache License and the GPL LiceuA73E":o","\u1E53":"o","\u014F":"o","\u022F":"j !== null && opts.id(tok context) {
        if ($.isFunction(val)) {
        vEDC":"O"dex >= :"E","\u1E1A": language ger t:"Z","\u1E92":"Z","\u1E94"3F":"L","\u0139      \u01D1":"O","\u020C":"O","\u":"C",""C",be pas"d","\u1E0D":"d","\u,"\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\uowrap"
 ram input text user has typed       \u01F4W","\u1E86":"W","\u1ptions      F52":"r",     }
 e","\u1E17":"e","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA:"O","\uA74C":"O","\u01A2":"OI","\uA74E":w if we need to tell t"T","\uA728":"TZ"    }

    function killEvent(event) {
        event.", function (e) {
           "O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O"optional) milE","\u1E1A":"E",":"O","\u1EDE":"O","\u1EE2":"O","\ calls the original fn freturn true;
     1EA":"O"     0127":","\u0173":"u","\u1E7; };
      u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u:"R","\u0156":"R","\u1E5   if illiseconds to wa2":"D","\u1E0E"       return function ("\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1u2C6C"               in.ind             }

       var isVisible = (el.offsetWidata function
                    50":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q",,"\u02"\uA758be1":"ous *A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA","\u1E=$.map returnthat wi (typeof url === 'funct0":"S",""\u1    \u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"StSize: style.fontSize,
            S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":ntextt2 = clazz(Object, {

      ntextabstract
        bind: fun4":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\offset = el.selectionStart;
            length = el.selectiononSortStarif (dataIte         '\\': '&#92;A":"N","\u1E48":"N","\u0220":"N",","\uA756":"Q",iveR= coof        e.metA758supporuA78g

Ver  }
})(jQue<   if >. A  }
} .addCE":"a","\u01 Time'/>45":"ead.er can either be a}

    function collaps       paB3":" fino 0cCssClaso     "AE","\u01= { res      thdpterwel:56 EDT 2014

tion() {
             case KEY.ALT          }
ng match "u","\u1EE9":"u","\u1EEF":"u","\u.    this.createContainer();

            this.liveREnd: $("<span>", collection.push(datu=    * @p"d","\u1E0D":"d","\u1E1A8":":"AE","Tue  not f","\u filtndasses(de\u0265":"h","\u01ce(/([.])/g, '_')
   A8":ken);
          ata(qk    r    }

      "AE","\u01EetaKey    our
u"l","\u0ttr("title", opts.element.attr("title"I","\uTp://jsperf.co, '_')
   = $([0.selection.create         ses =utogen"+f(stCssClaF4D"ragegionG","     s.typit turn;
                    }
                }
     //          75":"u"ons.url url for the data
     * @param options.data a functcontain such when we val()
          data =ntext valuid","\u1E8       k = k.which ? krameters for the above url.
   ype.constructor = ","\u0232":"Y","\u1E8E":"Y","\uval;
    }

    function countResults(re:"U","\u0168":"U","\s               dupe = true; break;
containerx
   ,n in       if (origina01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uF       return val.appltypeof url === 'functi.; });
  @param options.data a functs

            this.co    FF2F":"O","\u00D2":"this.opts.element.attr("tabi;dow.setTimeout(f   this.co"d",            i, l, // looping variables
 ","\u1E08":W","\u1E86":"W","\u1E84"V","\u01B2:"g"Y","\u"i","\uE7C":"V","\u1E7E":"V1E23"
         .att            }e its textTabIndex = e   sy230":"O","\u00D6":"O","\u0pts);

            this.id":"X","\u24CE":"Y","\uFF39down.on("click", killEvenates a new class
     *
     * @param superClass
     * @param methods
     */
    functionSelect2 = clazz(Object, {

    // abstract
        bind: function (func) {
"Z","\uFF3A":"Z","\u0179$.fnfined) {"e","\u1EC5":g, '\\$1');
     arg  }
A,"\ueateto89":0) breu1E79"
        , k;
            } }

ldren) {
       windoldren) {
     metho      \u1E":"Z"pl1E3C":"L","\u1E

   edMEventratio;
  8F":165":"t8F":3B1","     thi8F":     *ns a ve the"(match) {.on(","\u016D": "1E0":"A"     liveRegions.highlighEnltsSeEnd - his.be();
 his.d(paonl     peof handler.abohis.bu0193"E7B":"u"]ldren) {
     

   ve(this.resu this.dropd", resultsSelector, this.bind(thisor, this.bind(fateRertyve(this.results);

 ch ?or, this.bind(flEventsMap = {o add t: "external    CT"":"fonp, other\u03Contain such options as cache,        J","\u01C8":"L    eypeof     ,"\u0","\uobj6":"dz","\u24D4":"e","\u,"\uA73         this.drop? {} : $.wn.ond({}h;
  hstar(typeof url === 'fe);
        r rest be co            of the cu"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\u}));
      ised unde"t","\uAateRanment
   nction should be used.SHIFT:
            case KEYment
           ment
    icenO","\u014C":"O","\u1E50":"77C":tags"\u24D6":"g"touchEvent) {
=  if (this._      stationary but
     * the elements uis.contextment
    );

w window.Z","\u0[0":"a",]hEvent()* @patallDebouncedScroll(80, thicensesh("<span class='sel  windogetCu drop            i, l, // l     .on("touchstart touc","\u0
    ns as cache, jsonpCallback, e/ Waiti,dMouseMove(this  * @param options.transport in a seUnknacrilEventbecaus/ Waiti   * @param ctx object to be used as m, marwith 'id' aoll-debounced", resultsSeevices to ext = functionU","\u0214":"U","\u0216"wn).on("c window, jQuery, console */

    if (wilEvent=.select2- <= 123;
        }
   Eventt touclector, thhe License") or the GNU
Gen();})sultsSel,"\u0109":"c","\u01          }
       ent out-of-bbind(thislling of results via mousewheel
        1E0":"A"24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W         r    [ent ou])ewheel   cou           if (dcted that each elemenousewheel
          if (d this.lainer.on(this.) brea1      var isVisible = (el.offsetWidth ent from the search function (eve      gs
     * @param string
 from the search fis.highlightUnd      ) re         this. 1         deprecated = {
 .RIGHT:
          bor('seleiter, elemethparatoresults.g retu9":"k"d& resu        bind: function (func) {
            var self = tin a separate variable ss.params) 2 pluginge", ".sel           if (this.indexng for a clng, sofelemenion();});

     ?if (e."Y","\ulement", resulait pChan"\u011D"th;
c SPAlse {
  tch=tructo   this.cont.arch.on(   tement
        :-boupy"a","\u1EB1loadMore  }
   : 0ldren) {
 url,
        :Highlldren) {
 Y) {
      s("select2-focuslector, tCss: { License or1E0":"A"on("mouseup", resdropdown.on(id, s: ""a","\u1EB1ultsSelecto{
                i011E":CE: 32se or the Gs outp4":"H","\u1E2of th, nction that wt = 0;
        $.eacKEY, 
    t tokenizer. Trkcheck.length of o       .PL Lic(e);
           this.F43":"c","\u0107":"c"(e);
 ":"c","\ual;
    }

  (".select2-res","\u0191":"F","\uA77B":"4":"H","\u1E2        this.highlightUnderEEEE":"U","\      var KEY, Array of oults;
            $(thifrom leavinsorelect2-m
           s outpu > 0) {
          istening
            //s outpuse events from leaving the CE: 32arget).clo":"R","\u2C64" {EEE":"U","\0) {;from leaving the dropdown.hat we want
           ","\u1E2E":"// focusi;
        from leavin    return k >= 112 && ion () { seare to seRL: 1L"\u01ick mouseup mo insten touchstart 0141":"L","\u0cusin",   // deprecaion () { seari{
                this.dr pas      sizer?inal =: e.id; itself. sine
License or the GPL Licenseistening
            //","\pDiacritics(''+     .toUpp01F3":"d.lback, etction based on the crmrent value of t      can close itself. sinc,"\u1E25: ","a","\u1EB1r datS,"\u1E25s:    onp, other datatyr:"\u011D"Tection bcan set seuse events oased on tE  var KEY, can set sepplyOn\u0118:","\u1E3C":"L","      OnBlu"Z","\u1E3C":"L","adapu016F":"u"hat we want
       c    this.drcon(this.opts.r twodler.abohronization
                thistruc itself. sin4BA":"E","\uFF2":"A","\u1E  if ($Oend",exOf(sepaarkup(text.   this.dr;
                   //   CTRL: 1 License.
*/
''his.bind(fuName) {
        iPeof han: 'topsabled = op1E16":"E","\u011
           5":"en function tags(dat//elec,"\u());det    to {
 dev request (GET or          })sTled)E87":2-fo(('onbled)sgion'"lj",lDebolts \uFF4F":"o","\u00F2":"o","\u00F3":"o"rn Dnavig1E25.msMaxs.elePoit.prreliex < 0) break; // dOnly;

     ","\u24ly = opabled);efore4":"Aadapted:"d",al    f{
            a+''; y = opts.element.pj","\u24C2":"M","\uFF2D":"M"          } e.prototype = new SuperNev  funcuetaKey speciE2":"AE","is         jaxRequest, helps dbled =          return k >= 112 &&  * @param options.transp      for (attr in datum) {
             }
                } elsults));
    rch.addClass(8:58::"i","\uF        // abstract
     ['en']-focused"); }ct2-rescheckFo
           9":"k",pts.     4D8":"i"        this.dr"OnWN: 34,
  }

vail    Y <=ess  grors.params) {it."; }        //D8":"i+ "ram formatterhis.close():"l"up Tue Jacriar","\key   in
      ent.leldren) {
   /**
   * Retur
            re = this;
No element[fon(i               this.dAjax6":"Q
           jqXHRicenseStatus, e":"QT    nychange", seLoa+= cofai
                 this.dRL: 1TooShoon = $("<spaata, pa,></diss(evr ,"\uch :-     ot.substri= this;
Ple  fu        * n[0].dor ing')chaB":"er  * ("P", 1C8":"S","D":"bserver.disconnect();
     Lo           adaropertyOaxerver = nulla, pageNumber-              this._sde03": null;

    if (select2 !== undefined) {
                selector VaynbeTooBi          adalimi             Youid") uchsarams) {  * ffscr[0].dur
uct2 !a("sel undefined) {
                select  thlur"
           kingNumbn is            this.ping')s outpu…yObserver.disconnect(    CT            adapte         TabIndex)        if (t,

              rch.addClass("select2, function () {
                       this.cont.ajaxactiveE2-focused"); }trans  })

  r("tcan set se"\u1m("moement
        9":"D"GET"a","\u1EB1":"ac}
})r it, allowing fo this)
 T9":"D"js:"u","\u01D8     },

     // ex= optom lellDebouncedScr-focused"); }of thhow();
         r("t:  "reldren) {
     8:58::     "ldren) {
     t = :);
  l;
    }

  utilhow();
         deboun\u01FptionTo          }));
 this.se: {
       ldren) {
     rce element
                // we monitor t  if ction based on:       id:elemen},

        0":"a","\w();
         "a017B":"": u017B":"Z","\u01xt:element.texicense": Scense      element: element"\u1EA:9":"Z","\u1E9"container",
      }(ju0169donl