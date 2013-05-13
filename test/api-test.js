var compat = require('..');
var bemhtml = require('bemhtml.xjst');
var assert = require('assert');

describe('BEMHTML/compat', function() {
  function getSource(fn) {
    return fn.toString().replace(/^function\s*\(\)\s*{\/\*|\*\/}$/g, '');
  }

  it('should parse old source', function() {
    var ast = compat.parse(getSource(function(){/*
      block b1, tag: 'a'
    */}));
    assert.equal(JSON.stringify(ast),
                 '[[["xjst",["unop","!",["getp",["string","elem"],["this"]]]]' +
                 ',["block",["string","b1"]],["tag"],["body",["begin",' +
                 '["return",["string","a"]]]]]]');
  });

  it('should transpile old source', function() {
    var out = compat.transpile(getSource(function(){/*
      block b1, tag: 'a'
      block b1, content: {
        local(this.p = true, this.z = {}, this.z.d = 'world') {
          this._buf.push('hello ' + this.z.d);
        }
        return apply('subcontent', this.x = '!');
      }
      block b1, subcontent: {
        return this.x;
      }
    */}));
    assert(typeof out === 'string');

    [{ optimize: false }, {}].forEach(function(options) {
      var t = bemhtml.compile(out, options);
      assert.equal(t.apply.call({ block: 'b1' }),
                   '<a class="b1">hello world!</a>');
    });
  });
});
