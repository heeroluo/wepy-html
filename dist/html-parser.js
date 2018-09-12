"use strict";

// 不同HTML特殊符号的对应处理
var htmlSymbols = [// 注释
{
  startsWith: '<!--',
  endsWith: '-->',
  handler: function handler() {}
}, // 元素结束
{
  startsWith: '</',
  endsWith: '>',
  handler: function handler(str, context) {
    context.closeNode(str.toLowerCase());
  }
}, // 元素起始
{
  startsWith: '<',
  endsWith: '>',
  handler: function handler(str, context) {
    var tagName,
        closed = false;
    var attrs = {};
    str = str.replace(/^[^\s\/]+/, function (match) {
      // 匹配标签名
      tagName = match.toLowerCase();
      return '';
    }).replace(/\/$/, function () {
      // 以「/」结尾，为自结束标签
      closed = true;
      return '';
    }).replace(/([^\s=]+)=(['"])(.*?)\2/g, function (match, attrName, quot, attrValue) {
      // 解析属性名、属性值（「a="b"」的模式）
      attrName = attrName.toLowerCase();
      attrs[attrName] = attrValue;
      return '';
    }).trim();

    if (str) {
      // 解析属性名、属性值（「a」、「a=b」的模式）
      str.split(/\s+/).forEach(function (attr) {
        var attrName, attrValue;

        if (attr.indexOf('=') !== -1) {
          attr = attr.split('=');
          attrName = attr[0].toLowerCase();
          attrValue = attr[1];
        } else {
          attrName = attrValue = attr.toLowerCase();
        }

        attrs[attrName] = attrValue;
      });
    }

    context.createNode(tagName, attrs, closed);
  }
}]; // 文本内容处理

var textSymbol = {
  startsWith: '',
  endsWith: '<',
  handler: function handler(str, context) {
    context.createTextNode(str);
  }
};
/**
 * 解析HTML代码为JSON结构
 * @method parse
 * @param {String} html HTML代码
 * @param {Object} context 上下文文档结构
 * @return {Object} 上下文文档结构
 */

exports.parse = function (html, context) {
  if (!html) {
    return context;
  }

  var index, content, theSymbol;

  function matchSymbol(symbol) {
    if (html.indexOf(symbol.startsWith) === 0) {
      theSymbol = symbol;
      return true;
    }
  }

  while (html) {
    theSymbol = null;
    htmlSymbols.some(matchSymbol);
    theSymbol = theSymbol || textSymbol; // 结束符位置

    index = html.indexOf(theSymbol.endsWith);

    if (index === -1) {
      index = html.length;
    } // 截取开始符和结束符之间的内容


    content = html.substring(theSymbol.startsWith.length, index); // 处理内容

    theSymbol.handler(content, context); // 截掉已处理内容

    html = html.substring(index + (theSymbol === textSymbol ? 0 : theSymbol.endsWith.length));
  }

  return context;
};