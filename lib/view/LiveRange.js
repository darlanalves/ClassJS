(function() {
	'use strict';

	var doc = document,
		trimRe = /^\s+|\s+$/g,
		attribSplitRe = /:\s?/,
		attribListRe = /;\s?/,
		__toString = Object.prototype.toString,
		__push = Array.prototype.push,
		isArray = function(obj) {
			return __toString.call(obj) == '[object Array]';
		};

	function flatten(input, shallow, output) {
		var i, l, value;
		output = output || [];

		for (i = 0, l = input.length; i < l; i++) {
			value = input[i];
			if (isArray(value)) {
				shallow ? __push.apply(output, value) : flatten(value, shallow, output);
			} else {
				output.push(value);
			}
		}

		return output;
	};

	/**
	 * Micro templating code to keep track of text placeholders and replace
	 * content on the fly without affect DOM structure.
	 *
	 * Replaces text placeholders inside a DOM tree with Range instances.
	 * The final set of ranges can be updated individually.
	 * @class Whapp.view.LiveRange
	 */
	Whapp.define('Whapp.view.LiveRange', {

		statics: {
			/**
			 * @static
			 * @property placeholderRe
			 * RegExp used to match text placeholders
			 */
			placeholderRe: new RegExp('\{([^}]+)\}', 'ig'),
			dataLiveRe: new RegExp('(.+:[^;]+);?\s*', 'g')
		},

		/**
		 * @cfg {String} html
		 * HTML template
		 */

		/**
		 * @property nodes
		 * List of nodes bound to names, in the form of name => DOM nodes/Ranges
		 */

		/**
		 * @constructor
		 * @param {String} html		Live html template
		 */
		constructor: function(html) {
			this.nodes = {};
			this.html = html;
		},

		getEl: function() {
			return this.el;
		},

		/**
		 * Creates a Range object out of a text node
		 * @param {TextNode} node
		 * @param {Number} startOffset
		 * @param {Number} endOffset
		 * @return {Range}
		 * @private
		 */
		createRange: function(node, startOffset, length) {
			startOffset = startOffset || 0;
			length = Math.abs(length); // TODO negative offset
			if (length == 0) {
				length = startOffset;
			}

			var range = doc.createRange();
			range.setStart(node, startOffset);
			range.setEnd(node, length);
			range.extractContents();

			return range;
		},

		/**
		 * Builds the HTML template with range objects bound to content
		 *
		 * @param {HTMLElement} root		Node to be used as template root element
		 */
		build: function(root) {
			//var i, len, html;
			root = root || doc.createElement('div');

			// turns HTML code into DOM nodes
			root.innerHTML = (isArray(this.html) ? this.html.join('') : this.html) || '';
			this.el = root;
			this.scanNodes();
		},

		/**
		 * Turns a HTML code into a list of ranges
		 * - match ranges
		 * - create a range for each var found
		 * - save a list of format n => {range, name, code}
		 * - replace var names by their indexes: {name} => {1}
		 * @private
		 */
		scanHtml: function(root) {
			var placeholders = [],
				nodeList = root.childNodes,
				node, frag, m, i, k, len;

			for (i = 0, len = nodeList.length; i < len; i++) {
				node = nodeList[i];
				if (!node) continue;	// TODO review. IE10 trying to read a invalid index!

				if (node.nodeType == 1) {
					// HTML node, scan subnodes
					k = this.scanHtml(node);
					if (k.length) {
						placeholders.push(k);
					}

					// scan attributes
					// TODO define a common attribute to list templates, like data-live="name:dto.name,id:id..."
					k = this.scanAttributes(node);
					if (k.length) {
						placeholders.push(k);
					}
				} else {
					// text node
					k = this.scanText(node);
					if (k.length) {
						placeholders.push(k);
					}
				}
			}

			return placeholders;

			for (i = 0, m = rangeList.length; i < m; i++) {
				frag = '{' + (i + 1) + '}';
				code = code.replace(rangeList[i].code, frag);
				rangeList[i].code = frag;
			}
			node.innerHTML = code;

			return rangeList;
		},

		/**
		 * Scan attributes for a 'data-live' one, like these:
		 * 		<img data-live="class:clsName; title:other.value; src:item.src"/>
		 *
		 * @param {HTMLElement} node
		 * @return {Array}
		 * @private
		 */
		scanAttributes: function(node) {
			var values, i, len, list = node.getAttribute('data-live'),
				result = [];

			if (list) {
				node.removeAttribute('data-live');
				list = list.split(attribListRe);

				if (list.length) {
					for (i = 0, len = list.length; i < len; i++) {
						values = list[i].split(attribSplitRe);

						result.push({
							node: node,
							name: values[1],
							attribute: values[0]
						});
					}
				}
			}

			return result;
		},

		/**
		 * Scan a text node for ranges
		 * @return {Object[]} rangeList		A list of {range, name, code} objects
		 * @private
		 */
		scanText: function(node) {
			if (!(node.nodeType != 1 && node.nodeValue)) return [];

			var m, i, matchedCode, matchedVar, code = node.nodeValue,
				rangeList = [];

			while (true) {
				m = Whapp.view.LiveRange.placeholderRe.exec(code);
				if (!(m && m[0])) break;

				matchedCode = m[0];
				matchedVar = m[1];
				i = m.index;

				rangeList.push({
					node: this.createRange(node, i, String(matchedCode).length),
					name: matchedVar
				});
			}

			return rangeList;
		},

        /**
         * Parse HTML and populate {@link #nodes}
		 * @private
		 */
		scanNodes: function() {
			var i, len, r, nodes = flatten(this.scanHtml(this.el));
			if (nodes.length) {
				for (i = 0, len = nodes.length; i < len; i++) {
					r = nodes[i];
					!this.nodes[r.name] && (this.nodes[r.name] = []);
					this.nodes[r.name].push(r);
				}
			}
		},

		/**
		 * Apply a value to a view placeholder (a text portion or attribute)
		 * @param {String} nodeName
		 * @param {String} value
		 * @private
		 * TODO local data cache?? Would avoid updates with same data
		 */
		setValue: function(nodeName, value) {
			var i, len, item, list;

			list = this.nodes[nodeName];
			if (list && list.length) {
				for (i = 0, len = list.length; i < len; i++) {
					item = list[i];
					if (item.node instanceof Range) {
						value = doc.createTextNode(value || '');
						item.node.extractContents();
						item.node.insertNode(value);
					} else if (item.attribute) {
						// node attributes are saved as objects {node, attribute}
						item.node.setAttribute(item.attribute, value);
					} else {
						// assume is an HTMLElement
						item.node.innerHTML = value;
					}
				}
			}
		},

		/**
		 * Refresh values
		 * @param {Object} values
		 */
		update: function(values) {
			if (!values) return;
			var i, r;

			// TODO access subproperties (JSON obj.prop [compile)
			for (i in values) {
				if (values.hasOwnProperty(i)) {
					if (!typeof values[i] == 'string') continue;
					this.setValue(i, values[i]);
				}
			}
		}
	});

}).call(this);