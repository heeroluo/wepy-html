"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function makeMap(str) {
  var map = {};
  str.split(',').forEach(function (item) {
    map[item] = true;
  });
  return map;
} // 空元素（自关闭元素）


var emptyElements = makeMap('area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'); // 块级元素

var blockElements = makeMap('address,article,aside,blockquote,canvas,dd,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,li,main,nav,noscript,ol,output,p,pre,section,table,tfoot,ul,video'); // 行内元素

var inlineElements = makeMap('a,abbr,acronym,b,bdo,big,br,button,cite,code,dfn,em,i,img,input,kbd,label,map,object,q,samp,script,select,small,span,strong,sub,sup,textarea,time,tt,var'); // 节点id（自增不重复）

var nodeId = 0;
/**
 * 节点类
 * @class Node
 * @constructor
 * @param {String} type 节点类型：document、node、text
 * @param {String} name 节点名或节点值
 * @param {Object} [attrs] 节点属性集合
 */

var Node =
/*#__PURE__*/
function () {
  function Node(type, name, attrs) {
    _classCallCheck(this, Node);

    // 节点类型
    this.type = type; // 文本节点，有节点值无节点名

    if (this.type === 'text') {
      this.text = name;
      return;
    } // 节点编号


    this.nodeId = ++nodeId;

    if (blockElements[name]) {
      this.display = 'block';
    } else if (inlineElements[name]) {
      this.display = 'inline';
    } else {
      this.display = 'others';
    } // 是否块级节点


    this.isBlock = Boolean(blockElements[name]); // 是否行内节点

    this.isInline = Boolean(inlineElements[name]); // 节点名

    this.name = name;
    this.attrs = {};

    if (attrs) {
      Object.assign(this.attrs, attrs);
    } // 子节点数组


    this.children = [];
  }
  /**
   * 添加子节点
   * @method appendChild
   * @for Node
   * @param {String} type 节点类型
   * @param {String} name 节点名或节点值
   * @param {Object} [attrs] 节点属性集合
   */


  _createClass(Node, [{
    key: "appendChild",
    value: function appendChild(type, name, attrs) {
      var newNode = new Node(type, name, attrs, this);
      this.children.push(newNode);
      return newNode;
    }
  }]);

  return Node;
}();
/**
 * 文档类
 * @class Document
 * @constructor
 * @param {Object} [options] 钩子
 *   @param {Function(name, attrs)} [options.onNodeCreate] 创建节点时的钩子，可以在此钩子中修改节点属性
 */


var Document =
/*#__PURE__*/
function () {
  function Document(options) {
    _classCallCheck(this, Document);

    this._root = new Node('document', '#root');
    this._nodeMap = {};
    this._contexts = [this._root];
    this._options = Object.assign({}, options);
  } // 把节点添加到Map


  _createClass(Document, [{
    key: "_addToMap",
    value: function _addToMap(node) {
      this._nodeMap[node.nodeId] = node;
      return node;
    }
    /**
     * 在当前上下文创建元素子节点
     * @method createNode
     * @for Document
     * @param {String} name 节点名
     * @param {Object} [attrs] 节点属性集合
     * @param {Boolean} [closed] 节点标签是否已关闭
     */

  }, {
    key: "createNode",
    value: function createNode(name, attrs, closed) {
      if (this._options.onNodeCreate) {
        this._options.onNodeCreate(name, attrs);
      }

      var node = this._addToMap(this._contexts[0].appendChild('node', name, attrs));

      var isClosed = closed || node.name === '#root' || emptyElements.hasOwnProperty(node.name);

      if (!isClosed) {
        this._contexts.unshift(node);
      }
    }
    /**
     * 关闭当前上下文节点（节点名能匹配上才会关闭）
     * @method closeNode
     * @for Document
     * @param {String} name 节点名
     */

  }, {
    key: "closeNode",
    value: function closeNode(name) {
      if (this._contexts.length > 1 && this._contexts[0].name === name) {
        this._contexts.shift();
      }
    }
    /**
     * 在当前上下文创建文本子节点
     * @method createTextNode
     * @for Document
     * @param {String} content 文本内容
     */

  }, {
    key: "createTextNode",
    value: function createTextNode(content) {
      this._contexts[0].appendChild('text', content);
    }
    /**
     * 根据节点编号查找节点
     * @method findNode
     * @for Document
     * @param {Number} nodeId 节点编号
     * @return {Object} 节点对象
     */

  }, {
    key: "findNode",
    value: function findNode(nodeId) {
      return Object.assign({}, this._nodeMap[nodeId]);
    }
    /**
     * 返回所有子节点
     * @method nodes
     * @for Document
     * @param {Array} 子节点数组
     */

  }, {
    key: "nodes",
    value: function nodes() {
      return this._root.children.slice();
    }
  }]);

  return Document;
}();

exports.Node = Node;
exports.Document = Document;