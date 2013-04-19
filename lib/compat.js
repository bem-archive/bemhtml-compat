var compat = exports;
var ometajs = require('ometajs');
var esprima = require('esprima');
var BEMHTMLParser = require('./ometa/bemhtml').BEMHTMLParser;
var BEMHTMLToXJST = require('./ometa/bemhtml').BEMHTMLToXJST;
var XJSTToJS = require('./ometa/bemhtml').XJSTToJS;

// Parse old bemhtml source
compat.parse = function parse(source) {
  return BEMHTMLParser.matchAll(source, 'topLevel');
};

// Translate old ast to new ast
compat.translate = function translate(ast) {
  ast = BEMHTMLToXJST.match(ast, 'topLevel');
  var out = XJSTToJS.match(ast, 'topLevel');
  return esprima.parse(out);
};

// Transpile old source to new source
compat.transpile = function transpile(source) {
  var ast = compat.parse(source);
  ast = BEMHTMLToXJST.match(ast, 'topLevel');
  return XJSTToJS.match(ast, 'topLevel');
};
