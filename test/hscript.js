(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index){
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len){
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.iter = function(a){
	return { cur : 0, arr : a, hasNext : function(){
		return this.cur < this.arr.length;
	}, next : function(){
		return this.arr[this.cur++];
	}};
}
var IntIterator = function(min,max){
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = true;
IntIterator.prototype = {
	__class__: IntIterator
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.hasField = function(o,field){
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field){
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.getProperty = function(o,field){
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
}
Reflect.fields = function(o){
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f){
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b){
	if(a == b) return 0; else if(a > b) return 1; else return -1;
}
Reflect.copy = function(o){
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f){
	return function(){
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s){
	return js.Boot.__string_rec(s,"");
}
var StringBuf = function(){
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
}
var Test = function() { }
$hxClasses["Test"] = Test;
Test.__name__ = true;
Test.print = function(s){
	haxe.Log.trace(s,null);
}
Test.main = function(){
	var run = null;
	var source = null;
	var canvas = null;
	var ctx = null;
	var txt = null;
	var clear = function(){
		ctx.fillStyle = "black";
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fill();
	};
	var runScript = function(){
		var content = txt.getValue();
		clear();
		content = "{" + content + "}";
		try {
			var e = new hscript.Parser().parseString(content);
			new hscript.exec.Interp().execute(e);
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,hscript.Error) ) {
				var err = $e0;
				var str;
				switch(err.error[1]) {
				case 2:
					str = "String is not terminated. Did you forget to add a closing quote?";
					break;
				case 3:
					str = "Comment not terminated.";
					break;
				case 4:
					var v = err.error[2];
					str = "Unknown variable \"" + v + "\"";
					break;
				case 1:
					var s = err.error[2];
					switch(err.error[2]) {
					case "}":
						str = "Semicolon expected";
						break;
					default:
						str = "Unexpected " + s;
					}
					break;
				case 9:
					var g = err.error[4];
					var s = err.error[3];
					var name = err.error[2];
					str = "Expected " + s + " parameters, got " + g + " in " + name;
					break;
				case 8:
					str = "Invalid function";
					break;
				case 6:
					var op = err.error[2];
					str = "Invalid operation " + op;
					break;
				case 5:
					var v = err.error[2];
					str = "Invalid iterator " + v;
					break;
				case 0:
					var c = err.error[2];
					str = "Invalid char \"" + String.fromCharCode(c) + "\"";
					break;
				case 7:
					var f = err.error[2];
					str = "Cannot access " + f;
					break;
				case 10:
					var cl = err.error[2];
					str = "" + cl + " does not have a constructor";
					break;
				}
				haxe.Log.trace("Error: " + str,null);
			} else {
			var e = $e0;
			haxe.Log.trace("Unexpected error: " + Std.string(e),null);
			}
		}
	};
	js.Browser.window.onload = function(_){
		run = js.Browser.document.getElementById("run");
		source = js.Browser.document.getElementById("editor");
		canvas = js.Browser.document.getElementById("canvas");
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		ctx = canvas.getContext("2d");
		txt = CodeMirror.fromTextArea(source,{ value : "trace(\"Hello, world!\");", tabindex : 1, autofocus : true, indentWithTabs : true, lineNumbers : true});
		txt.on("change",function(_1,_2){
			runScript();
		});
	};
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.getClass = function(o){
	if(o == null) return null;
	return o.__class__;
}
Type.resolveClass = function(name){
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.createInstance = function(cl,args){
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEnum = function(e,constr,params){
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.enumEq = function(a,b){
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
var haxe = {}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos){
	js.Boot.__trace(v,infos);
}
haxe.ds = {}
haxe.ds.BalancedTree = function(){
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = true;
haxe.ds.BalancedTree.prototype = {
	compare: function(k1,k2){
		return Reflect.compare(k1,k2);
	}
	,balance: function(l,k,v,r){
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this = l.right;
				$r = _this == null?0:_this._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this = r.right;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this = r.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,setLoop: function(k,v,node){
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,set: function(key,value){
		this.root = this.setLoop(key,value,this.root);
	}
	,__class__: haxe.ds.BalancedTree
}
haxe.ds.TreeNode = function(l,k,v,r,h){
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = true;
haxe.ds.TreeNode.prototype = {
	__class__: haxe.ds.TreeNode
}
haxe.ds.GenericCell = function(elt,next){
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe.ds.GenericCell;
haxe.ds.GenericCell.__name__ = true;
haxe.ds.GenericCell.prototype = {
	__class__: haxe.ds.GenericCell
}
haxe.ds.GenericStack = function(){
};
$hxClasses["haxe.ds.GenericStack"] = haxe.ds.GenericStack;
haxe.ds.GenericStack.__name__ = true;
haxe.ds.GenericStack.prototype = {
	pop: function(){
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,add: function(item){
		this.head = new haxe.ds.GenericCell(item,this.head);
	}
	,__class__: haxe.ds.GenericStack
}
haxe.ds.StringMap = function(){
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	iterator: function(){
		return { ref : this.h, it : this.keys(), hasNext : function(){
			return this.it.hasNext();
		}, next : function(){
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function(){
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,exists: function(key){
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key){
		return this.h["$" + key];
	}
	,set: function(key,value){
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b){
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length){
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s){
	var a = new Array();
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.prototype = {
	toString: function(){
		return this.readString(0,this.length);
	}
	,readString: function(pos,len){
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function(){
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	getBytes: function(){
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	readString: function(len){
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readFullBytes: function(s,pos,len){
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readBytes: function(s,pos,len){
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function(){
		throw "Not implemented";
	}
	,__class__: haxe.io.Input
}
haxe.io.BytesInput = function(b,pos,len){
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len){
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function(){
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { }
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = true;
haxe.io.BytesOutput = function(){
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = true;
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	getBytes: function(){
		return this.b.getBytes();
	}
	,writeByte: function(c){
		this.b.b.push(c);
	}
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function(){
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function(){
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.StringInput = function(s){
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = true;
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
var hscript = {}
hscript.Const = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString"] }
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Access = { __ename__ : true, __constructs__ : ["Public","Private","Static","Function","HasGetter","HasSetter"] }
hscript.Access.Public = ["Public",0];
hscript.Access.Public.toString = $estr;
hscript.Access.Public.__enum__ = hscript.Access;
hscript.Access.Private = ["Private",1];
hscript.Access.Private.toString = $estr;
hscript.Access.Private.__enum__ = hscript.Access;
hscript.Access.Static = ["Static",2];
hscript.Access.Static.toString = $estr;
hscript.Access.Static.__enum__ = hscript.Access;
hscript.Access.Function = ["Function",3];
hscript.Access.Function.toString = $estr;
hscript.Access.Function.__enum__ = hscript.Access;
hscript.Access.HasGetter = ["HasGetter",4];
hscript.Access.HasGetter.toString = $estr;
hscript.Access.HasGetter.__enum__ = hscript.Access;
hscript.Access.HasSetter = ["HasSetter",5];
hscript.Access.HasSetter.toString = $estr;
hscript.Access.HasSetter.__enum__ = hscript.Access;
hscript.ClassFlag = { __ename__ : true, __constructs__ : ["IsInterface"] }
hscript.ClassFlag.IsInterface = ["IsInterface",0];
hscript.ClassFlag.IsInterface.toString = $estr;
hscript.ClassFlag.IsInterface.__enum__ = hscript.ClassFlag;
hscript.ExprDef = { __ename__ : true, __constructs__ : ["EConst","EIdent","EVars","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary","ESwitch","EUntyped","EClassDecl","EUsing","EEnumDecl"] }
hscript.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EVars = function(vs) { var $x = ["EVars",2,vs]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EBreak = ["EBreak",12];
hscript.ExprDef.EBreak.toString = $estr;
hscript.ExprDef.EBreak.__enum__ = hscript.ExprDef;
hscript.ExprDef.EContinue = ["EContinue",13];
hscript.ExprDef.EContinue.toString = $estr;
hscript.ExprDef.EContinue.__enum__ = hscript.ExprDef;
hscript.ExprDef.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",23,e,cases,edef]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",24,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EClassDecl = function(c) { var $x = ["EClassDecl",25,c]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EUsing = function(e) { var $x = ["EUsing",26,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.ExprDef.EEnumDecl = function(e) { var $x = ["EEnumDecl",27,e]; $x.__enum__ = hscript.ExprDef; $x.toString = $estr; return $x; }
hscript.CType = { __ename__ : true, __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] }
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.ErrorDef = { __ename__ : true, __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess","EInvalidFunction","EInvalidParameters","ENoConstructor"] }
hscript.ErrorDef.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EUnexpected = function(s,could) { var $x = ["EUnexpected",1,s,could]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EUnterminatedString = ["EUnterminatedString",2];
hscript.ErrorDef.EUnterminatedString.toString = $estr;
hscript.ErrorDef.EUnterminatedString.__enum__ = hscript.ErrorDef;
hscript.ErrorDef.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.ErrorDef.EUnterminatedComment.toString = $estr;
hscript.ErrorDef.EUnterminatedComment.__enum__ = hscript.ErrorDef;
hscript.ErrorDef.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.EInvalidFunction = ["EInvalidFunction",8];
hscript.ErrorDef.EInvalidFunction.toString = $estr;
hscript.ErrorDef.EInvalidFunction.__enum__ = hscript.ErrorDef;
hscript.ErrorDef.EInvalidParameters = function(f,givenLen,actualLen) { var $x = ["EInvalidParameters",9,f,givenLen,actualLen]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.ErrorDef.ENoConstructor = function(c) { var $x = ["ENoConstructor",10,c]; $x.__enum__ = hscript.ErrorDef; $x.toString = $estr; return $x; }
hscript.Error = function(e,pmin,pmax){
	this.error = e;
	this.pmin = pmin;
	this.pmax = pmax;
};
$hxClasses["hscript.Error"] = hscript.Error;
hscript.Error.__name__ = true;
hscript.Error["with"] = function(ex,e){
	return new hscript.Error(ex,e.pmin,e.pmax);
}
hscript.Error.prototype = {
	__class__: hscript.Error
}
hscript.Expr = function(v,pmin,pmax){
	this.expr = v;
	this.pmin = pmin;
	this.pmax = pmax;
};
$hxClasses["hscript.Expr"] = hscript.Expr;
hscript.Expr.__name__ = true;
hscript.Expr.prototype = {
	__class__: hscript.Expr
}
hscript.Token = { __ename__ : true, __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot","THash","TInterp"] }
hscript.Token.TEof = ["TEof",0];
hscript.Token.TEof.toString = $estr;
hscript.Token.TEof.__enum__ = hscript.Token;
hscript.Token.TConst = function(c) { var $x = ["TConst",1,c]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TId = function(s) { var $x = ["TId",2,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TOp = function(s) { var $x = ["TOp",3,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TPOpen = ["TPOpen",4];
hscript.Token.TPOpen.toString = $estr;
hscript.Token.TPOpen.__enum__ = hscript.Token;
hscript.Token.TPClose = ["TPClose",5];
hscript.Token.TPClose.toString = $estr;
hscript.Token.TPClose.__enum__ = hscript.Token;
hscript.Token.TBrOpen = ["TBrOpen",6];
hscript.Token.TBrOpen.toString = $estr;
hscript.Token.TBrOpen.__enum__ = hscript.Token;
hscript.Token.TBrClose = ["TBrClose",7];
hscript.Token.TBrClose.toString = $estr;
hscript.Token.TBrClose.__enum__ = hscript.Token;
hscript.Token.TDot = ["TDot",8];
hscript.Token.TDot.toString = $estr;
hscript.Token.TDot.__enum__ = hscript.Token;
hscript.Token.TComma = ["TComma",9];
hscript.Token.TComma.toString = $estr;
hscript.Token.TComma.__enum__ = hscript.Token;
hscript.Token.TSemicolon = ["TSemicolon",10];
hscript.Token.TSemicolon.toString = $estr;
hscript.Token.TSemicolon.__enum__ = hscript.Token;
hscript.Token.TBkOpen = ["TBkOpen",11];
hscript.Token.TBkOpen.toString = $estr;
hscript.Token.TBkOpen.__enum__ = hscript.Token;
hscript.Token.TBkClose = ["TBkClose",12];
hscript.Token.TBkClose.toString = $estr;
hscript.Token.TBkClose.__enum__ = hscript.Token;
hscript.Token.TQuestion = ["TQuestion",13];
hscript.Token.TQuestion.toString = $estr;
hscript.Token.TQuestion.__enum__ = hscript.Token;
hscript.Token.TDoubleDot = ["TDoubleDot",14];
hscript.Token.TDoubleDot.toString = $estr;
hscript.Token.TDoubleDot.__enum__ = hscript.Token;
hscript.Token.THash = ["THash",15];
hscript.Token.THash.toString = $estr;
hscript.Token.THash.__enum__ = hscript.Token;
hscript.Token.TInterp = function(s) { var $x = ["TInterp",16,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Parser = function(){
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	this.currentPackage = [];
	var priorities = [["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["==","!=",">","<",">=","<="],["..."],["&&"],["||"],["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^="]];
	this.opPriority = new haxe.ds.StringMap();
	this.opRightAssoc = new haxe.ds.StringMap();
	this.unops = new haxe.ds.StringMap();
	var _g1 = 0;
	var _g = priorities.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g2 = 0;
		var _g3 = priorities[i];
		while(_g2 < _g3.length) {
			var x = _g3[_g2];
			++_g2;
			this.opPriority.set(x,i);
			if(i == 9) this.opRightAssoc.set(x,true);
		}
	}
	var _g = 0;
	var _g1 = ["!","++","--","-","~"];
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		this.unops.set(x,x == "++" || x == "--");
	}
};
$hxClasses["hscript.Parser"] = hscript.Parser;
hscript.Parser.__name__ = true;
hscript.Parser.prototype = {
	parseInterpolatedString: function(str){
		var _g = this;
		var expr = null;
		var add = function(e){
			if(expr == null) expr = e; else expr = _g.mk(hscript.ExprDef.EBinop("+",expr,e),null,null);
		};
		var i = 0;
		var start = 0;
		var max = str.length;
		while(i < max) {
			if(str.charCodeAt(i++) != 36) continue;
			var len = i - start - 1;
			if(len > 0 || expr == null) add(this.mk(hscript.ExprDef.EConst(hscript.Const.CString(HxOverrides.substr(str,start,len))),null,null));
			start = i;
			var c = str.charCodeAt(i);
			if(c == 123) {
				var count = 1;
				i++;
				while(i < max) {
					var c1 = str.charCodeAt(i++);
					if(c1 == 125) {
						if(--count == 0) break;
					} else if(c1 == 123) count++;
				}
				if(count > 0) throw "Closing brace not found";
				start++;
				var len1 = i - start - 1;
				var expr1 = HxOverrides.substr(str,start,len1);
				add(new hscript.Parser().parseString(expr1));
				start++;
			} else if(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 95) {
				i++;
				while(true) {
					var c1 = str.charCodeAt(i);
					if(c1 >= 97 && c1 <= 122 || c1 >= 65 && c1 <= 90 || c1 >= 48 && c1 <= 57 || c1 == 95) i++; else break;
				}
				var len1 = i - start;
				var ident = HxOverrides.substr(str,start,len1);
				add(this.mk(hscript.ExprDef.EIdent(ident),null,null));
			} else if(c == 36) {
				start = i++;
				continue;
			} else {
				start = i - 1;
				continue;
			}
			start = i;
		}
		var len = i - start;
		if(len > 0) add(this.mk(hscript.ExprDef.EConst(hscript.Const.CString(HxOverrides.substr(str,start,len))),null,null));
		if(expr == null) expr = this.mk(hscript.ExprDef.EConst(hscript.Const.CString("")),null,null);
		return expr;
	}
	,tokenString: function(t){
		switch(t[1]) {
		case 15:
			return "#";
		case 0:
			return "<eof>";
		case 1:
			var c = t[2];
			return this.constString(c);
		case 2:
			var s = t[2];
			return s;
		case 3:
			var s = t[2];
			return s;
		case 4:
			return "(";
		case 5:
			return ")";
		case 6:
			return "{";
		case 7:
			return "}";
		case 8:
			return ".";
		case 9:
			return ",";
		case 10:
			return ";";
		case 11:
			return "[";
		case 12:
			return "]";
		case 13:
			return "?";
		case 14:
			return ":";
		case 16:
			var s = t[2];
			return "'" + s + "'";
		}
	}
	,constString: function(c){
		switch(c[1]) {
		case 0:
			var v = c[2];
			return Std.string(v);
		case 1:
			var f = c[2];
			return Std.string(f);
		case 2:
			var s = c[2];
			return s;
		}
	}
	,tokenComment: function(op,char){
		var c = HxOverrides.cca(op,1);
		var s = this.input;
		if(c == 47) {
			try {
				while($char != 10 && $char != 13) $char = s.readByte();
				this["char"] = $char;
			} catch( e ) {
			}
			return this.token();
		}
		if(c == 42) {
			var old = this.line;
			try {
				while(true) {
					while($char != 42) {
						if($char == 10) this.line++;
						$char = s.readByte();
					}
					$char = s.readByte();
					if($char == 47) break;
				}
			} catch( e ) {
				this.line = old;
				this.error(hscript.ErrorDef.EUnterminatedComment,0,0);
			}
			return this.token();
		}
		this["char"] = $char;
		return hscript.Token.TOp(op);
	}
	,token: function(){
		if(!(this.tokens.head == null)) return this.tokens.pop();
		var $char;
		if(this["char"] < 0) $char = this.readChar(); else {
			$char = this["char"];
			this["char"] = -1;
		}
		while(true) {
			switch($char) {
			case 0:
				return hscript.Token.TEof;
			case 32:case 9:case 13:
				break;
			case 10:
				this.line++;
				break;
			case 35:
				return hscript.Token.THash;
			case 59:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TSemicolon;
				break;
			case 40:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TPOpen;
				break;
			case 41:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TPClose;
				break;
			case 44:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TComma;
				break;
			case 46:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else {
					$char = this.readChar();
					switch($char) {
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						var n = $char - 48;
						var exp = 1;
						while(true) {
							$char = this.readChar();
							exp *= 10;
							switch($char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n = n * 10 + ($char - 48);
								break;
							default:
								this["char"] = $char;
								return hscript.Token.TConst(hscript.Const.CFloat(n / exp));
							}
						}
						break;
					case 46:
						$char = this.readChar();
						if($char != 46) this.invalidChar($char);
						return hscript.Token.TOp("...");
					default:
						this["char"] = $char;
						return hscript.Token.TDot;
					}
				}
				break;
			case 123:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TBrOpen;
				break;
			case 125:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TBrClose;
				break;
			case 91:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TBkOpen;
				break;
			case 93:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TBkClose;
				break;
			case 39:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TInterp(this.readString(39));
				break;
			case 34:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TConst(hscript.Const.CString(this.readString(34)));
				break;
			case 63:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TQuestion;
				break;
			case 58:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else return hscript.Token.TDoubleDot;
				break;
			default:
				if($char >= 48 && $char <= 57) {
					var n = ($char - 48) * 1.0;
					var exp = 0.;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						if($char >= 48 && $char <= 57) n = n * 10 + ($char - 48); else switch($char) {
						case 46:
							if(exp > 0) {
								if(exp == 10 && this.readChar() == 46) {
									this.push(hscript.Token.TOp("..."));
									var i = n | 0;
									return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
								}
								this.invalidChar($char);
							}
							exp = 1.;
							break;
						case 120:
							if(n > 0 || exp > 0) this.invalidChar($char);
							var n1 = 0;
							while(true) {
								$char = this.readChar();
								switch($char) {
								case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
									n1 = (n1 << 4) + $char - 48;
									break;
								case 65:case 66:case 67:case 68:case 69:case 70:
									n1 = (n1 << 4) + ($char - 55);
									break;
								case 97:case 98:case 99:case 100:case 101:case 102:
									n1 = (n1 << 4) + ($char - 87);
									break;
								default:
									this["char"] = $char;
									return hscript.Token.TConst(hscript.Const.CInt(n1));
								}
							}
							break;
						default:
							this["char"] = $char;
							var i = n | 0;
							return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
						}
					}
				} else {
					if(this.ops[$char]) {
						var op = String.fromCharCode($char);
						while(true) {
							$char = this.readChar();
							if(!this.ops[$char]) {
								if(HxOverrides.cca(op,0) == 47) return this.tokenComment(op,$char);
								this["char"] = $char;
								return hscript.Token.TOp(op);
							}
							op += String.fromCharCode($char);
						}
					}
					if(this.idents[$char]) {
						var id = String.fromCharCode($char);
						while(true) {
							$char = this.readChar();
							if(!this.idents[$char]) {
								this["char"] = $char;
								return hscript.Token.TId(id);
							}
							id += String.fromCharCode($char);
						}
					}
					this.invalidChar($char);
				}
			}
			$char = this.readChar();
		}
		return null;
	}
	,readString: function(until){
		var c = 0;
		var b = new haxe.io.BytesOutput();
		var esc = false;
		var old = this.line;
		var s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( e ) {
				this.line = old;
				this.error(hscript.ErrorDef.EUnterminatedString,0,0);
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 39:case 34:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) b.writeByte(c); else this.invalidChar(c);
					break;
				case 117:
					if(!this.allowJSON) throw this.invalidChar(c);
					var code = null;
					try {
						code = s.readString(4);
					} catch( e ) {
						this.line = old;
						this.error(hscript.ErrorDef.EUnterminatedString,0,0);
					}
					var k = 0;
					var _g = 0;
					while(_g < 4) {
						var i = _g++;
						k <<= 4;
						var $char = HxOverrides.cca(code,i);
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += $char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += $char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += $char - 87;
							break;
						default:
							this.invalidChar($char);
						}
					}
					if(k <= 127) b.writeByte(k); else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) esc = true; else if(c == until) break; else {
				if(c == 10) this.line++;
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	,readChar: function(){
		try {
			return this.input.readByte();
		} catch( e ) {
			return 0;
		}
	}
	,incPos: function(){
	}
	,parseExprList: function(etk){
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.push(tk);
		try {
			while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				switch(tk[1]) {
				case 9:
					break;
				default:
					if(tk == etk) throw "__break__";
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,parseTypeNext: function(t){
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(op != "->") {
				this.push(tk);
				return t;
			}
			break;
		default:
			this.push(tk);
			return t;
		}
		var t2 = this.parseType();
		switch(t2[1]) {
		case 1:
			var args = t2[2];
			args.unshift(t);
			return t2;
		default:
			return hscript.CType.CTFun([t],t2);
		}
	}
	,parseType: function(){
		var t = this.token();
		switch(t[1]) {
		case 2:
			var v = t[2];
			var path = [v];
			while(true) {
				t = this.token();
				if(t != hscript.Token.TDot) break;
				t = this.token();
				switch(t[1]) {
				case 2:
					var v1 = t[2];
					path.push(v1);
					break;
				default:
					this.unexpected(t);
				}
			}
			var params = null;
			switch(t[1]) {
			case 3:
				switch(t[2]) {
				case "<":
					params = [];
					try {
						while(true) {
							params.push(this.parseType());
							t = this.token();
							switch(t[1]) {
							case 9:
								continue;
								break;
							case 3:
								switch(t[2]) {
								case ">":
									throw "__break__";
									break;
								default:
								}
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
					break;
				default:
					this.push(t);
				}
				break;
			default:
				this.push(t);
			}
			return this.parseTypeNext(hscript.CType.CTPath(path,params));
		case 4:
			var t1 = this.parseType();
			this.ensure(hscript.Token.TPClose);
			return this.parseTypeNext(hscript.CType.CTParent(t1));
		case 6:
			var fields = [];
			try {
				while(true) {
					t = this.token();
					switch(t[1]) {
					case 7:
						throw "__break__";
						break;
					case 2:
						var name = t[2];
						this.ensure(hscript.Token.TDoubleDot);
						fields.push({ name : name, t : this.parseType()});
						t = this.token();
						switch(t[1]) {
						case 9:
							break;
						case 7:
							throw "__break__";
							break;
						default:
							this.unexpected(t);
						}
						break;
					default:
						this.unexpected(t);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.parseTypeNext(hscript.CType.CTAnon(fields));
		default:
			return this.unexpected(t);
		}
	}
	,parseExprNext: function(e1){
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(this.unops.get(op)) {
				if(this.isBlock(e1) || (function($this) {
					var $r;
					switch(e1.expr[1]) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.push(tk);
					return e1;
				}
				return this.parseExprNext(this.mk(hscript.ExprDef.EUnop(op,false,e1),e1.pmin,null));
			}
			return this.makeBinop(op,e1,this.parseExpr());
		case 8:
			tk = this.token();
			var field = null;
			switch(tk[1]) {
			case 2:
				var id = tk[2];
				field = id;
				break;
			default:
				this.unexpected(tk);
			}
			return this.parseExprNext(this.mk(hscript.ExprDef.EField(e1,field),e1.pmin,null));
		case 4:
			return this.parseExprNext(this.mk(hscript.ExprDef.ECall(e1,this.parseExprList(hscript.Token.TPClose)),e1.pmin,null));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(this.mk(hscript.ExprDef.EArray(e1,e2),e1.pmin,null));
		case 13:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return this.mk(hscript.ExprDef.ETernary(e1,e2,e3),e1.pmin,e3.pmax);
		default:
			this.push(tk);
			return e1;
		}
	}
	,parseStructure: function(id){
		var p1 = 0;
		switch(id) {
		case "enum":
			var name;
			{
				var _g = this.token();
				var all = _g;
				switch(_g[1]) {
				case 2:
					var s = _g[2];
					name = s;
					break;
				default:
					name = this.unexpected(all);
				}
			}
			var ed = { name : name, constructors : new haxe.ds.StringMap()};
			this.ensure(hscript.Token.TBrOpen);
			var tk = null;
			var cf = [];
			var name1 = null;
			var inParams = false;
			while((tk = this.token()) != hscript.Token.TBrClose) switch(tk[1]) {
			case 2:
				var nm = tk[2];
				if(name1 == null) name1 = nm; else {
					var nm1 = tk[2];
					if(inParams) cf.push({ name : nm1}); else this.unexpected(tk);
				}
				break;
			case 14:
				if(inParams && cf.length > 0) cf[cf.length - 1].type = this.parseType(); else this.unexpected(tk);
				break;
			case 4:
				if(name1 != null) inParams = true; else this.unexpected(tk);
				break;
			case 5:
				if(inParams) inParams = false; else this.unexpected(tk);
				break;
			case 10:
				if(!inParams) {
					ed.constructors.set(name1,cf);
					name1 = null;
					cf = [];
				} else this.unexpected(tk);
				break;
			default:
				this.unexpected(tk);
			}
			return this.mk(hscript.ExprDef.EEnumDecl(ed),null,null);
		case "class":case "interface":
			var isInterface = id == "interface";
			var name;
			{
				var _g = this.token();
				var all = _g;
				switch(_g[1]) {
				case 2:
					var s = _g[2];
					name = s;
					break;
				default:
					name = this.unexpected(all);
				}
			}
			var flags = 0;
			if(id == "interface") flags |= 1 << hscript.ClassFlag.IsInterface[1];
			var cd = { pack : this.currentPackage, name : name, fields : new haxe.ds.StringMap(), flags : flags};
			this.ensure(hscript.Token.TBrOpen);
			var tk = null;
			while(tk != hscript.Token.TBrClose) {
				var field = { access : 0};
				var name1 = null;
				var canSkip = false;
				try {
					while((tk = this.token()) != hscript.Token.TSemicolon && tk != hscript.Token.TBrClose) {
						if(canSkip) {
							this.push(tk);
							field.expr = this.parseExpr();
							canSkip = false;
						} else switch(tk[1]) {
						case 2:
							switch(tk[2]) {
							case "public":
								field.access |= 1 << hscript.Access.Public[1];
								break;
							case "private":
								field.access |= 1 << hscript.Access.Private[1];
								break;
							case "static":
								field.access |= 1 << hscript.Access.Static[1];
								break;
							case "var":
								{
									var _g1 = tk = this.token();
									var all = _g1;
									switch(_g1[1]) {
									case 2:
										var s = _g1[2];
										name1 = s;
										break;
									default:
										name1 = this.unexpected(all);
									}
								}
								break;
							case "function":
								this.push(tk);
								field.expr = this.parseExpr();
								{
									var all = field.expr.expr;
									switch(field.expr.expr[1]) {
									case 14:
										var c = field.expr.expr[5];
										var n = field.expr.expr[4];
										var b = field.expr.expr[3];
										var a = field.expr.expr[2];
										name1 = n;
										field.expr = this.mk(hscript.ExprDef.EFunction(a,b,null,c),null,null);
										break;
									default:
										throw hscript.ErrorDef.EInvalidFunction;
									}
								}
								field.access |= 1 << hscript.Access.Function[1];
								break;
							default:
								this.unexpected(tk);
							}
							break;
						case 4:
							if(name1 != null) {
								{
									var _g1 = tk = this.token();
									switch(_g1[1]) {
									case 2:
										switch(_g1[2]) {
										case "get":
											field.access |= 1 << hscript.Access.HasGetter[1];
											break;
										case "never":case "null":case "default":
											break;
										default:
											this.unexpected(tk);
										}
										break;
									default:
										this.unexpected(tk);
									}
								}
								this.ensure(hscript.Token.TComma);
								{
									var _g2 = tk = this.token();
									switch(_g2[1]) {
									case 2:
										switch(_g2[2]) {
										case "set":
											field.access |= 1 << hscript.Access.HasSetter[1];
											break;
										case "never":case "null":case "default":
											break;
										default:
											this.unexpected(tk);
										}
										break;
									default:
										this.unexpected(tk);
									}
								}
								this.ensure(hscript.Token.TPClose);
							} else this.unexpected(tk);
							break;
						case 14:
							field.type = this.parseType();
							break;
						case 3:
							switch(tk[2]) {
							case "=":
								field.expr = this.parseExpr();
								break;
							default:
								this.unexpected(tk);
							}
							break;
						case 10:
							throw "__break__";
							break;
						default:
							this.unexpected(tk);
						}
						if(name1 != null) {
							if(name1 == "new") cd.constructor = field; else cd.fields.set(name1,field);
						}
					}
				} catch( e ) { if( e != "__break__" ) throw e; }
			}
			return this.mk(hscript.ExprDef.EClassDecl(cd),p1,0);
		case "if":
			var cond = this.parseExpr();
			var e1 = this.parseExpr();
			var e2 = null;
			var semic = false;
			var tk = this.token();
			if(tk == hscript.Token.TSemicolon) {
				semic = true;
				tk = this.token();
			}
			if(Type.enumEq(tk,hscript.Token.TId("else"))) e2 = this.parseExpr(); else {
				this.push(tk);
				if(semic) this.push(hscript.Token.TSemicolon);
			}
			return this.mk(hscript.ExprDef.EIf(cond,e1,e2),p1,e2 == null?0:e2.pmax);
		case "var":
			var vars = [];
			var tk = null;
			var _g = [];
			while((tk == null?tk = this.token():tk = tk) != hscript.Token.TSemicolon) _g.push((function($this) {
				var $r;
				var ident = null;
				var type = null;
				var expr = null;
				while(tk == hscript.Token.TComma) tk = $this.token();
				switch(tk[1]) {
				case 2:
					var id1 = tk[2];
					ident = id1;
					break;
				default:
					$this.unexpected(tk,"identifier");
				}
				tk = $this.token();
				switch(tk[1]) {
				case 14:
					if(type == null) {
						type = $this.parseType();
						tk = $this.token();
					} else {
					}
					break;
				default:
				}
				switch(tk[1]) {
				case 3:
					switch(tk[2]) {
					case "=":
						expr = $this.parseExpr();
						tk = $this.token();
						break;
					default:
						if(type != null) {
							$this.push(tk);
							expr = $this.parseExpr();
							tk = $this.token();
						} else $this.unexpected(tk,"type or assignment");
					}
					break;
				case 10:case 9:
					break;
				default:
					if(type != null) {
						$this.push(tk);
						expr = $this.parseExpr();
						tk = $this.token();
					} else $this.unexpected(tk,"type or assignment");
				}
				$r = { name : ident, type : type, expr : expr};
				return $r;
			}(this)));
			vars = _g;
			this.push(tk);
			return this.mk(hscript.ExprDef.EVars(vars),p1,0);
		case "while":
			var econd = this.parseExpr();
			var e = this.parseExpr();
			return this.mk(hscript.ExprDef.EWhile(econd,e),p1,e.pmax);
		case "for":
			this.ensure(hscript.Token.TPOpen);
			var tk = this.token();
			var vname = null;
			switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				vname = id1;
				break;
			default:
				this.unexpected(tk);
			}
			tk = this.token();
			if(!Type.enumEq(tk,hscript.Token.TId("in"))) this.unexpected(tk);
			var eiter = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			var e = this.parseExpr();
			return this.mk(hscript.ExprDef.EFor(vname,eiter,e),p1,e.pmax);
		case "switch":
			this.ensure(hscript.Token.TPOpen);
			var val = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			this.ensure(hscript.Token.TBrOpen);
			var cases = [];
			var def = null;
			try {
				while(true) {
					var tk = this.token();
					switch(tk[1]) {
					case 2:
						switch(tk[2]) {
						case "case":
							var allowed = [];
							allowed.push(this.parseExpr());
							var guard = null;
							var ntk = null;
							try {
								while(true) {
									{
										var _g = ntk = this.token();
										switch(_g[1]) {
										case 9:
											break;
										case 3:
											switch(_g[2]) {
											case "|":
												break;
											default:
												throw "__break__";
											}
											break;
										case 2:
											switch(_g[2]) {
											case "if":
												this.ensure(hscript.Token.TPOpen);
												guard = this.parseExpr();
												this.ensure(hscript.Token.TPClose);
												ntk = this.token();
												throw "__break__";
												break;
											default:
												throw "__break__";
											}
											break;
										default:
											throw "__break__";
										}
									}
									allowed.push(this.parseExpr());
								}
							} catch( e ) { if( e != "__break__" ) throw e; }
							switch(ntk[1]) {
							case 14:
								break;
							default:
								this.unexpected(ntk);
							}
							var expr = this.parseExpr();
							this.ensure(hscript.Token.TSemicolon);
							cases.push({ values : allowed, expr : expr, guard : guard});
							break;
						case "default":
							this.ensure(hscript.Token.TDoubleDot);
							def = this.parseExpr();
							this.ensure(hscript.Token.TSemicolon);
							break;
						default:
							this.unexpected(tk);
						}
						break;
					case 7:
						throw "__break__";
						break;
					default:
						this.unexpected(tk);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.mk(hscript.ExprDef.ESwitch(val,cases,def),null,null);
		case "break":
			return this.mk(hscript.ExprDef.EBreak,null,null);
		case "continue":
			return this.mk(hscript.ExprDef.EContinue,null,null);
		case "untyped":
			return this.mk(hscript.ExprDef.EUntyped(this.parseExpr()),null,null);
		case "using":
			return this.mk(hscript.ExprDef.EUsing(this.parseExpr()),null,null);
		case "import":
			var expr = this.parseExpr();
			var name;
			switch(expr.expr[1]) {
			case 5:
				var f = expr.expr[3];
				name = f;
				break;
			default:
				name = null;
			}
			var tk = this.token();
			switch(tk[1]) {
			case 2:
				switch(tk[2]) {
				case "in":
					{
						var _g = this.token();
						var all = _g;
						switch(_g[1]) {
						case 2:
							var id1 = _g[2];
							name = id1;
							break;
						default:
							name = this.unexpected(all);
						}
					}
					break;
				default:
					this.push(tk);
				}
				break;
			default:
				this.push(tk);
			}
			return this.mk(hscript.ExprDef.EVars([{ name : name, expr : expr}]),null,null);
		case "else":
			return this.unexpected(hscript.Token.TId(id));
		case "function":
			var tk = this.token();
			var name = null;
			switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				name = id1;
				break;
			default:
				this.push(tk);
			}
			this.ensure(hscript.Token.TPOpen);
			var args = new Array();
			tk = this.token();
			if(tk != hscript.Token.TPClose) {
				var arg = true;
				while(arg) {
					var name1 = null;
					switch(tk[1]) {
					case 2:
						var id1 = tk[2];
						name1 = id1;
						break;
					default:
						this.unexpected(tk);
					}
					tk = this.token();
					var t = null;
					if(tk == hscript.Token.TDoubleDot) {
						t = this.parseType();
						tk = this.token();
					}
					args.push({ name : name1, t : t});
					switch(tk[1]) {
					case 9:
						tk = this.token();
						break;
					case 5:
						arg = false;
						break;
					default:
						this.unexpected(tk);
					}
				}
			}
			var ret = null;
			tk = this.token();
			if(tk != hscript.Token.TDoubleDot) this.push(tk); else ret = this.parseType();
			var body = this.parseExpr();
			return this.mk(hscript.ExprDef.EFunction(args,body,name,ret),p1,body.pmax);
		case "return":
			var tk = this.token();
			this.push(tk);
			var e;
			if(tk == hscript.Token.TSemicolon) e = null; else e = this.parseExpr();
			return this.mk(hscript.ExprDef.EReturn(e),p1,e == null?0:e.pmax);
		case "new":
			var a = new Array();
			var tk = this.token();
			switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				a.push(id1);
				break;
			default:
				this.unexpected(tk);
			}
			var next = true;
			var hasType = false;
			while(next) {
				tk = this.token();
				switch(tk[1]) {
				case 3:
					switch(tk[2]) {
					case "<":
						this.parseType();
						hasType = true;
						break;
					case ">":
						hasType = false;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 9:
					if(hasType) this.parseType(); else this.unexpected(tk);
					break;
				case 8:
					tk = this.token();
					switch(tk[1]) {
					case 2:
						var id1 = tk[2];
						a.push(id1);
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 4:
					next = false;
					break;
				default:
					this.unexpected(tk);
				}
			}
			var args = this.parseExprList(hscript.Token.TPClose);
			return this.mk(hscript.ExprDef.ENew(a.join("."),args),p1,null);
		case "throw":
			var e = this.parseExpr();
			return this.mk(hscript.ExprDef.EThrow(e),p1,e.pmax);
		case "try":
			var e = this.parseExpr();
			var tk = this.token();
			if(!Type.enumEq(tk,hscript.Token.TId("catch"))) this.unexpected(tk);
			this.ensure(hscript.Token.TPOpen);
			tk = this.token();
			var vname;
			switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				vname = id1;
				break;
			default:
				vname = this.unexpected(tk);
			}
			this.ensure(hscript.Token.TDoubleDot);
			var t = this.parseType();
			this.ensure(hscript.Token.TPClose);
			var ec = this.parseExpr();
			return this.mk(hscript.ExprDef.ETry(e,vname,t,ec),p1,ec.pmax);
		case "package":
			var pckg = [];
			var tk = null;
			var shouldDot = false;
			while((tk = this.token()) != hscript.Token.TSemicolon) switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				pckg.push(id1);
				shouldDot = true;
				break;
			case 8:
				if(shouldDot) {
				} else this.unexpected(tk);
				break;
			default:
				this.unexpected(tk);
			}
			this.push(tk);
			this.currentPackage = pckg;
			return this.mk(hscript.ExprDef.EBlock([]),p1,p1);
		default:
			return null;
		}
	}
	,makeBinop: function(op,e1,e){
		switch(e.expr[1]) {
		case 6:
			var e3 = e.expr[4];
			var e2 = e.expr[3];
			var op2 = e.expr[2];
			if(this.opPriority.get(op) <= this.opPriority.get(op2) && !this.opRightAssoc.exists(op)) return this.mk(hscript.ExprDef.EBinop(op2,this.makeBinop(op,e1,e2),e3),e1.pmin,e3.pmax); else return this.mk(hscript.ExprDef.EBinop(op,e1,e),e1.pmin,e.pmax);
			break;
		case 22:
			var e4 = e.expr[4];
			var e3 = e.expr[3];
			var e2 = e.expr[2];
			if(this.opRightAssoc.exists(op)) return this.mk(hscript.ExprDef.EBinop(op,e1,e),e1.pmin,e.pmax); else return this.mk(hscript.ExprDef.ETernary(this.makeBinop(op,e1,e2),e3,e4),e1.pmin,e.pmax);
			break;
		default:
			return this.mk(hscript.ExprDef.EBinop(op,e1,e),e1.pmin,e.pmax);
		}
	}
	,makeUnop: function(op,e){
		switch(e.expr[1]) {
		case 6:
			var e2 = e.expr[4];
			var e1 = e.expr[3];
			var bop = e.expr[2];
			return this.mk(hscript.ExprDef.EBinop(bop,this.makeUnop(op,e1),e2),e1.pmin,e2.pmax);
		case 22:
			var e3 = e.expr[4];
			var e2 = e.expr[3];
			var e1 = e.expr[2];
			return this.mk(hscript.ExprDef.ETernary(this.makeUnop(op,e1),e2,e3),e1.pmin,e3.pmax);
		default:
			return this.mk(hscript.ExprDef.EUnop(op,true,e),e.pmin,e.pmax);
		}
	}
	,parseExpr: function(){
		var tk = this.token();
		var p1 = 0;
		switch(tk[1]) {
		case 16:
			var s = tk[2];
			var $is = this.parseInterpolatedString(s);
			return this.parseExprNext($is);
		case 15:
			var tk1 = null;
			var name;
			{
				var _g = tk1 = this.token();
				switch(_g[1]) {
				case 2:
					var s = _g[2];
					name = s;
					break;
				default:
					name = this.unexpected(tk1);
				}
			}
			var args;
			var _g1 = [];
			while((tk1 = this.token())[0] == "TId") _g1.push(tk1.slice(2)[0]);
			args = _g1;
			var expr = this.mk(hscript.ExprDef.EBlock([]),null,null);
			switch(name) {
			case "if":
				expr = this.parseExpr();
				break;
			default:
				this.unexpected(hscript.Token.TId("#" + name));
			}
			return expr;
		case 2:
			var id = tk[2];
			var e = this.parseStructure(id);
			if(e == null) e = this.mk(hscript.ExprDef.EIdent(id),null,null);
			return this.parseExprNext(e);
		case 1:
			var c = tk[2];
			return this.parseExprNext(this.mk(hscript.ExprDef.EConst(c),null,null));
		case 4:
			var e = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(this.mk(hscript.ExprDef.EParent(e),p1,0));
		case 6:
			tk = this.token();
			switch(tk[1]) {
			case 7:
				return this.parseExprNext(this.mk(hscript.ExprDef.EObject([]),p1,null));
			case 2:
				var tk2 = this.token();
				this.push(tk2);
				this.push(tk);
				switch(tk2[1]) {
				case 14:
					return this.parseExprNext(this.parseObject(p1));
				default:
				}
				break;
			case 1:
				var c = tk[2];
				if(this.allowJSON) switch(c[1]) {
				case 2:
					var tk2 = this.token();
					this.push(tk2);
					this.push(tk);
					switch(tk2[1]) {
					case 14:
						return this.parseExprNext(this.parseObject(p1));
					default:
					}
					break;
				default:
					this.push(tk);
				} else this.push(tk);
				break;
			default:
				this.push(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.push(tk);
			}
			return this.mk(hscript.ExprDef.EBlock(a),p1,null);
		case 3:
			var op = tk[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.push(tk);
				a.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(this.mk(hscript.ExprDef.EArrayDecl(a),p1,null));
		default:
			return this.unexpected(tk);
		}
	}
	,parseObject: function(p1){
		var fl = new Array();
		try {
			while(true) {
				var tk = this.token();
				var id = null;
				switch(tk[1]) {
				case 2:
					var i = tk[2];
					id = i;
					break;
				case 1:
					var c = tk[2];
					if(!this.allowJSON) this.unexpected(tk);
					switch(c[1]) {
					case 2:
						var s = c[2];
						id = s;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 7:
					throw "__break__";
					break;
				default:
					this.unexpected(tk);
				}
				this.ensure(hscript.Token.TDoubleDot);
				fl.push({ name : id, e : this.parseExpr()});
				tk = this.token();
				switch(tk[1]) {
				case 7:
					throw "__break__";
					break;
				case 9:
					break;
				default:
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.parseExprNext(this.mk(hscript.ExprDef.EObject(fl),p1,null));
	}
	,parseFullExpr: function(){
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.push(tk); else this.unexpected(tk);
		}
		return e;
	}
	,isBlock: function(e){
		switch(e.expr[1]) {
		case 25:case 27:
			return true;
		case 4:case 21:
			return true;
		case 14:
			var e1 = e.expr[3];
			return this.isBlock(e1);
		case 2:
			var vs = e.expr[2];
			switch(e.expr[2].length) {
			case 0:
				return false;
			default:
				return vs[0].expr != null && this.isBlock(vs[0].expr);
			}
			break;
		case 9:
			var e2 = e.expr[4];
			var e1 = e.expr[3];
			if(e2 != null) return this.isBlock(e2); else return this.isBlock(e1);
			break;
		case 6:
			var e1 = e.expr[4];
			return this.isBlock(e1);
		case 7:
			var e1 = e.expr[4];
			var prefix = e.expr[3];
			return !prefix && this.isBlock(e1);
		case 10:
			var e1 = e.expr[3];
			return this.isBlock(e1);
		case 11:
			var e1 = e.expr[4];
			return this.isBlock(e1);
		case 15:
			var e1 = e.expr[2];
			return e1 != null && this.isBlock(e1);
		case 23:
			return true;
		default:
			return false;
		}
	}
	,mk: function(e,pmin,pmax){
		if(pmin == null) pmin = 0;
		if(pmax == null) pmax = 0;
		return new hscript.Expr(e,pmin,pmax);
	}
	,ensure: function(tk){
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,push: function(tk){
		this.tokens.add(tk);
	}
	,unexpected: function(tk,info){
		this.error(hscript.ErrorDef.EUnexpected("'" + this.tokenString(tk) + "'" + (info == null?"":" - expected " + info)),0,0);
		return null;
	}
	,parse: function(s){
		this.tokens = new haxe.ds.GenericStack();
		this["char"] = -1;
		this.input = s;
		this.ops = new Array();
		this.idents = new Array();
		var _g1 = 0;
		var _g = this.opChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ops[HxOverrides.cca(this.opChars,i)] = true;
		}
		var _g1 = 0;
		var _g = this.identChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.idents[HxOverrides.cca(this.identChars,i)] = true;
		}
		var a = new Array();
		while(true) {
			var tk = this.token();
			if(tk == hscript.Token.TEof) break;
			this.push(tk);
			a.push(this.parseFullExpr());
		}
		if(a.length == 1) return a[0]; else return this.mk(hscript.ExprDef.EBlock(a),0,null);
	}
	,parseString: function(s){
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,invalidChar: function(c){
		this.error(hscript.ErrorDef.EInvalidChar(c),0,0);
	}
	,error: function(err,pmin,pmax){
		throw new hscript.Error(err,pmin,pmax);
	}
	,__class__: hscript.Parser
}
hscript.Tools = function() { }
$hxClasses["hscript.Tools"] = hscript.Tools;
hscript.Tools.__name__ = true;
hscript.Tools.rep = function(s,n){
	var ns = new StringBuf();
	while(n-- > 0) ns.b += Std.string(s);
	return ns.b;
}
hscript.Tools.typeToString = function(t){
	switch(t[1]) {
	case 3:
		var t1 = t[2];
		return "(" + hscript.Tools.typeToString(t1) + ")";
	case 0:
		var params = t[3];
		var path = t[2];
		return path.join(".") + (params == null || params.length == 0?"":"<" + Std.string(params.map(hscript.Tools.typeToString)) + ">");
	case 2:
		var fields = t[2];
		return "{" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < fields.length) {
					var f = fields[_g1];
					++_g1;
					_g.push(f.name + ":" + hscript.Tools.typeToString(f.t));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + "}";
	case 1:
		var ret = t[3];
		var args = t[2];
		var cs = "";
		var _g = 0;
		while(_g < args.length) {
			var a = args[_g];
			++_g;
			cs += hscript.Tools.typeToString(a) + " -> ";
		}
		if(cs.length == 0) cs += "Void ->";
		return cs + " -> " + hscript.Tools.typeToString(ret);
	}
}
hscript.Tools.toString = function(e,t){
	if(t == null) t = 0;
	switch(e.expr[1]) {
	case 10:
		var loop = e.expr[3];
		var cond = e.expr[2];
		return "while(" + hscript.Tools.toString(cond) + ")" + hscript.Tools.toString(loop,t);
	case 2:
		var vs = e.expr[2];
		return "var " + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < vs.length) {
					var v = vs[_g1];
					++_g1;
					_g.push(v.name + (v.expr == null?"":" = " + hscript.Tools.toString(v.expr)) + (v.type == null?"":":" + hscript.Tools.typeToString(v.type)));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ");
	case 26:
		var v = e.expr[2];
		return "using " + hscript.Tools.toString(v);
	case 24:
		var v = e.expr[2];
		return "untyped " + hscript.Tools.toString(v);
	case 7:
		switch(e.expr[3]) {
		case true:
			var ve = e.expr[4];
			var op = e.expr[2];
			return op + hscript.Tools.toString(ve);
		default:
			var ve = e.expr[4];
			var op = e.expr[2];
			return hscript.Tools.toString(ve) + op;
		}
		break;
	case 20:
		var catche = e.expr[5];
		var ty = e.expr[4];
		var v = e.expr[3];
		var exp = e.expr[2];
		return "try " + hscript.Tools.toString(exp) + " catch(" + v + ")" + hscript.Tools.toString(catche);
	case 19:
		var v = e.expr[2];
		return "throw " + hscript.Tools.toString(v);
	case 22:
		var b = e.expr[4];
		var a = e.expr[3];
		var cond = e.expr[2];
		return hscript.Tools.toString(cond) + "?" + hscript.Tools.toString(a) + ":" + hscript.Tools.toString(b);
	case 23:
		var def = e.expr[4];
		var cases = e.expr[3];
		var v = e.expr[2];
		var str = "switch(" + hscript.Tools.toString(v) + ") {";
		var _g = 0;
		while(_g < cases.length) {
			var c = cases[_g];
			++_g;
			str += "case " + ((function($this) {
				var $r;
				var _g1 = [];
				{
					var _g2 = 0;
					var _g3 = c.values;
					while(_g2 < _g3.length) {
						var v1 = _g3[_g2];
						++_g2;
						_g1.push(hscript.Tools.toString(v1,t + 2));
					}
				}
				$r = _g1;
				return $r;
			}(this))).join("|");
			if(c.guard != null) str += " if(" + hscript.Tools.toString(c.guard) + ")";
			str += ":";
			if(c.expr != null) str += hscript.Tools.toString(c.expr) + ";";
		}
		if(def != null) str += "default:" + hscript.Tools.toString(def) + ";";
		return str += "}";
	case 15:
		var v = e.expr[2];
		return "return " + hscript.Tools.toString(v);
	case 3:
		var v = e.expr[2];
		return "(" + hscript.Tools.toString(v) + ")";
	case 21:
		var fs = e.expr[2];
		var fmapped;
		var _g = [];
		var _g1 = 0;
		while(_g1 < fs.length) {
			var f = fs[_g1];
			++_g1;
			_g.push("" + f.name + ": " + (f.e == null?"null":hscript.Tools.toString(f.e)));
		}
		fmapped = _g;
		return "{" + fmapped.join(", ") + "}";
	case 9:
		var elsee = e.expr[4];
		var thene = e.expr[3];
		var cond = e.expr[2];
		var str = "if(" + hscript.Tools.toString(cond,t) + ")" + hscript.Tools.toString(thene,t);
		if(elsee != null) str += " else " + hscript.Tools.toString(elsee,t);
		return str;
	case 1:
		var s = e.expr[2];
		return s;
	case 14:
		var ret = e.expr[5];
		var name = e.expr[4];
		var fe = e.expr[3];
		var args = e.expr[2];
		return "function " + (name == null?"":name) + "(" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < args.length) {
					var a = args[_g1];
					++_g1;
					_g.push(a.name);
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + ")" + hscript.Tools.toString(fe);
	case 13:
		return "continue";
	case 12:
		return "break";
	case 4:
		var bs = e.expr[2];
		return "{" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < bs.length) {
					var b = bs[_g1];
					++_g1;
					_g.push("\n" + hscript.Tools.rep("\t",t) + hscript.Tools.toString(b,t + 1) + ";");
				}
			}
			$r = _g;
			return $r;
		}(this))).join("") + "\n" + hscript.Tools.rep("\t",t - 1) + "}";
	case 0:
		switch(e.expr[2][1]) {
		case 0:
			var i = e.expr[2][2];
			return Std.string(i);
		case 2:
			var s = e.expr[2][2];
			return "\"" + s + "\"";
		case 1:
			var f = e.expr[2][2];
			return Std.string(f);
		}
		break;
	case 11:
		var fe = e.expr[4];
		var ite = e.expr[3];
		var v = e.expr[2];
		return "for(" + v + " in " + hscript.Tools.toString(ite) + ")" + hscript.Tools.toString(fe);
	case 5:
		var f = e.expr[3];
		var fe = e.expr[2];
		return hscript.Tools.toString(fe) + "." + f;
	case 6:
		var b = e.expr[4];
		var a = e.expr[3];
		var op = e.expr[2];
		return hscript.Tools.toString(a) + op + hscript.Tools.toString(b);
	case 17:
		var $as = e.expr[2];
		return "[" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < $as.length) {
					var a = $as[_g1];
					++_g1;
					_g.push(hscript.Tools.toString(a));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + "]";
	case 16:
		var i = e.expr[3];
		var a = e.expr[2];
		return hscript.Tools.toString(a) + "[" + Std.string(i) + "]";
	case 8:
		var args = e.expr[3];
		var func = e.expr[2];
		return hscript.Tools.toString(func) + "(" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < args.length) {
					var a = args[_g1];
					++_g1;
					_g.push(hscript.Tools.toString(a,t));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + ")";
	case 25:
		var cd = e.expr[2];
		var buf = new StringBuf();
		buf.b += Std.string("class " + cd.name + " {\n");
		t++;
		var $it0 = cd.fields.keys();
		while( $it0.hasNext() ) {
			var fname = $it0.next();
			buf.b += Std.string(hscript.Tools.rep("\t",t));
			var field = cd.fields.get(fname);
			if((field.access & 1 << hscript.Access.Public[1]) != 0) buf.b += "public ";
			if((field.access & 1 << hscript.Access.Private[1]) != 0) buf.b += "private ";
			if((field.access & 1 << hscript.Access.Static[1]) != 0) buf.b += "static ";
			if((field.access & 1 << hscript.Access.Function[1]) != 0) buf.b += "function "; else buf.b += "var ";
			buf.b += Std.string(fname);
			if((field.access & 1 << hscript.Access.Function[1]) != 0) switch(field.expr.expr[1]) {
			case 14:
				var ret = field.expr.expr[5];
				var name = field.expr.expr[4];
				var exp = field.expr.expr[3];
				var args = field.expr.expr[2];
				buf.b += "(";
				buf.b += Std.string(((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < args.length) {
							var a = args[_g1];
							++_g1;
							_g.push(a.name);
						}
					}
					$r = _g;
					return $r;
				}(this))).join(", "));
				buf.b += ")";
				buf.b += Std.string(hscript.Tools.toString(exp,t + 1));
				break;
			default:
			} else if(field.type != null) buf.b += Std.string(":" + hscript.Tools.typeToString(field.type));
			if(!((field.access & 1 << hscript.Access.Function[1]) != 0)) buf.b += ";";
			buf.b += "\n";
		}
		buf.b += "}";
		t--;
		return buf.b;
	case 27:
		var e1 = e.expr[2];
		return "enum " + e1.name + " {" + ((function($this) {
			var $r;
			var _g = [];
			var $it1 = e1.constructors.keys();
			while( $it1.hasNext() ) {
				var cname = $it1.next();
				_g.push((function($this) {
					var $r;
					var $const = e1.constructors.get(cname);
					$r = cname + ($const.length == 0?"":"(" + Std.string((function($this) {
						var $r;
						var _g1 = [];
						{
							var _g2 = 0;
							while(_g2 < $const.length) {
								var c = $const[_g2];
								++_g2;
								_g1.push(c.name);
							}
						}
						$r = _g1;
						return $r;
					}($this))) + ")");
					return $r;
				}($this)));
			}
			$r = _g;
			return $r;
		}(this))).join("") + "\n}";
	case 18:
		var ps = e.expr[3];
		var cl = e.expr[2];
		return "new " + cl + "(" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < ps.length) {
					var p = ps[_g1];
					++_g1;
					_g.push(hscript.Tools.toString(p,t));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + ")";
	}
}
hscript.Tools.map = function(e,f){
	e = f(e);
	return new hscript.Expr((function($this) {
		var $r;
		switch(e.expr[1]) {
		case 10:
			$r = (function($this) {
				var $r;
				var l = e.expr[3];
				var c = e.expr[2];
				$r = hscript.ExprDef.EWhile(hscript.Tools.map(c,f),hscript.Tools.map(l,f));
				return $r;
			}($this));
			break;
		case 2:
			$r = (function($this) {
				var $r;
				var vs = e.expr[2];
				$r = hscript.ExprDef.EVars((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < vs.length) {
							var v = vs[_g1];
							++_g1;
							_g.push((function($this) {
								var $r;
								var nv = Reflect.copy(v);
								if(nv.expr != null) nv.expr = hscript.Tools.map(nv.expr,f);
								$r = nv;
								return $r;
							}($this)));
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 26:
			$r = (function($this) {
				var $r;
				var v = e.expr[2];
				$r = hscript.ExprDef.EUsing(hscript.Tools.map(v,f));
				return $r;
			}($this));
			break;
		case 24:
			$r = (function($this) {
				var $r;
				var v = e.expr[2];
				$r = hscript.ExprDef.EUntyped(hscript.Tools.map(v,f));
				return $r;
			}($this));
			break;
		case 19:
			$r = (function($this) {
				var $r;
				var v = e.expr[2];
				$r = hscript.ExprDef.EThrow(hscript.Tools.map(v,f));
				return $r;
			}($this));
			break;
		case 15:
			$r = (function($this) {
				var $r;
				var v = e.expr[2];
				$r = v != null?hscript.ExprDef.EReturn(hscript.Tools.map(v,f)):e.expr;
				return $r;
			}($this));
			break;
		case 12:
			$r = hscript.ExprDef.EBreak;
			break;
		case 7:
			$r = (function($this) {
				var $r;
				var ve = e.expr[4];
				var pre = e.expr[3];
				var op = e.expr[2];
				$r = hscript.ExprDef.EUnop(op,pre,hscript.Tools.map(ve,f));
				return $r;
			}($this));
			break;
		case 20:
			$r = (function($this) {
				var $r;
				var ve = e.expr[5];
				var vt = e.expr[4];
				var v = e.expr[3];
				var te = e.expr[2];
				$r = hscript.ExprDef.ETry(hscript.Tools.map(te,f),v,vt,hscript.Tools.map(ve,f));
				return $r;
			}($this));
			break;
		case 22:
			$r = (function($this) {
				var $r;
				var b = e.expr[4];
				var a = e.expr[3];
				var cond = e.expr[2];
				$r = hscript.ExprDef.ETernary(hscript.Tools.map(cond,f),hscript.Tools.map(a,f),hscript.Tools.map(b,f));
				return $r;
			}($this));
			break;
		case 3:
			$r = (function($this) {
				var $r;
				var v = e.expr[2];
				$r = hscript.ExprDef.EParent(hscript.Tools.map(v,f));
				return $r;
			}($this));
			break;
		case 1:case 13:case 0:case 27:
			$r = e.expr;
			break;
		case 4:
			$r = (function($this) {
				var $r;
				var es = e.expr[2];
				$r = hscript.ExprDef.EBlock((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < es.length) {
							var e1 = es[_g1];
							++_g1;
							_g.push(hscript.Tools.map(e1,f));
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 17:
			$r = (function($this) {
				var $r;
				var es = e.expr[2];
				$r = hscript.ExprDef.EArrayDecl((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < es.length) {
							var e1 = es[_g1];
							++_g1;
							_g.push(hscript.Tools.map(e1,f));
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 5:
			$r = (function($this) {
				var $r;
				var ff = e.expr[3];
				var ex = e.expr[2];
				$r = hscript.ExprDef.EField(hscript.Tools.map(ex,f),ff);
				return $r;
			}($this));
			break;
		case 6:
			$r = (function($this) {
				var $r;
				var b = e.expr[4];
				var a = e.expr[3];
				var op = e.expr[2];
				$r = hscript.ExprDef.EBinop(op,hscript.Tools.map(a,f),hscript.Tools.map(b,f));
				return $r;
			}($this));
			break;
		case 16:
			$r = (function($this) {
				var $r;
				var i = e.expr[3];
				var ex = e.expr[2];
				$r = hscript.ExprDef.EArray(hscript.Tools.map(ex,f),i);
				return $r;
			}($this));
			break;
		case 8:
			$r = (function($this) {
				var $r;
				var args = e.expr[3];
				var func = e.expr[2];
				$r = hscript.ExprDef.ECall(hscript.Tools.map(func,f),(function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < args.length) {
							var a = args[_g1];
							++_g1;
							_g.push(hscript.Tools.map(a,f));
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 11:
			$r = (function($this) {
				var $r;
				var fore = e.expr[4];
				var ite = e.expr[3];
				var v = e.expr[2];
				$r = hscript.ExprDef.EFor(v,hscript.Tools.map(ite,f),hscript.Tools.map(fore,f));
				return $r;
			}($this));
			break;
		case 14:
			$r = (function($this) {
				var $r;
				var ret = e.expr[5];
				var name = e.expr[4];
				var ex = e.expr[3];
				var args = e.expr[2];
				$r = hscript.ExprDef.EFunction(args,hscript.Tools.map(ex,f),name,ret);
				return $r;
			}($this));
			break;
		case 18:
			$r = (function($this) {
				var $r;
				var args = e.expr[3];
				var cl = e.expr[2];
				$r = hscript.ExprDef.ENew(cl,(function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < args.length) {
							var a = args[_g1];
							++_g1;
							_g.push(hscript.Tools.map(a,f));
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 9:
			$r = (function($this) {
				var $r;
				var b = e.expr[4];
				var a = e.expr[3];
				var cond = e.expr[2];
				$r = hscript.ExprDef.EIf(hscript.Tools.map(cond,f),hscript.Tools.map(a,f),hscript.Tools.map(b,f));
				return $r;
			}($this));
			break;
		case 23:
			$r = (function($this) {
				var $r;
				var defe = e.expr[4];
				var cases = e.expr[3];
				var ve = e.expr[2];
				$r = hscript.ExprDef.ESwitch(hscript.Tools.map(ve,f),(function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < cases.length) {
							var c = cases[_g1];
							++_g1;
							_g.push({ values : c.values, guard : c.guard, expr : c.expr == null?null:hscript.Tools.map(c.expr,f)});
						}
					}
					$r = _g;
					return $r;
				}($this)),defe == null?null:hscript.Tools.map(defe,f));
				return $r;
			}($this));
			break;
		case 21:
			$r = (function($this) {
				var $r;
				var fs = e.expr[2];
				$r = hscript.ExprDef.EObject((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < fs.length) {
							var fl = fs[_g1];
							++_g1;
							_g.push({ name : fl.name, e : fl.e == null?null:hscript.Tools.map(fl.e,f)});
						}
					}
					$r = _g;
					return $r;
				}($this)));
				return $r;
			}($this));
			break;
		case 25:
			$r = (function($this) {
				var $r;
				var cd = e.expr[2];
				$r = (function($this) {
					var $r;
					cd = Reflect.copy(cd);
					var $it0 = ((function(_e){
						return function(){
							return _e.iterator();
						};
					})(cd.fields))();
					while( $it0.hasNext() ) {
						var fl = $it0.next();
						if(fl.expr == null) fl.expr = null; else fl.expr = hscript.Tools.map(fl.expr,f);
					}
					$r = hscript.ExprDef.EClassDecl(cd);
					return $r;
				}($this));
				return $r;
			}($this));
			break;
		}
		return $r;
	}(this)),e.pmin,e.pmax);
}
hscript.Tools.toBlock = function(e){
	switch(e.expr[1]) {
	case 4:
		return e;
	default:
		return new hscript.Expr(hscript.ExprDef.EBlock([e]),e.pmin,e.pmax);
	}
}
hscript.Tools.simplify = function(e,isVal){
	if(isVal == null) isVal = false;
	switch(e.expr[1]) {
	case 17:
		switch(e.expr[2].length) {
		case 1:
			switch(e.expr[2][0].expr[1]) {
			case 11:
				var ite = e.expr[2][0].expr[4];
				var it = e.expr[2][0].expr[3];
				var v = e.expr[2][0].expr[2];
				var ename = "$arr";
				var eexpr = new hscript.Expr(hscript.ExprDef.EIdent(ename),e.pmin,e.pmax);
				return new hscript.Expr(hscript.ExprDef.EBlock([new hscript.Expr(hscript.ExprDef.EVars([{ name : ename, type : hscript.CType.CTPath(["Array"]), expr : new hscript.Expr(hscript.ExprDef.EArrayDecl([]),e.pmin,e.pmax)}]),e.pmin,e.pmax),new hscript.Expr(hscript.ExprDef.EFor(v,it,new hscript.Expr(hscript.ExprDef.ECall(new hscript.Expr(hscript.ExprDef.EField(eexpr,"push"),e.pmin,e.pmax),[ite]),e.pmin,e.pmax)),e.pmin,e.pmax),eexpr]),e.pmin,e.pmax);
			default:
				return e;
			}
			break;
		default:
			return e;
		}
		break;
	case 23:
		var def = e.expr[4];
		var cases = e.expr[3];
		var val = e.expr[2];
		var vname = "all";
		var vexpr = new hscript.Expr(hscript.ExprDef.EIdent(vname),e.pmin,e.pmax);
		var block = [];
		block.push(new hscript.Expr(hscript.ExprDef.EVars([{ name : vname, expr : val}]),e.pmin,e.pmax));
		var lastIf = null;
		var _g = 0;
		while(_g < cases.length) {
			var c = cases[_g];
			++_g;
			var cond = null;
			var _g1 = 0;
			var _g2 = c.values;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				switch(v.expr[1]) {
				case 1:
					switch(v.expr[2]) {
					case "_":case "all":
						break;
					default:
						var isEq = new hscript.Expr(hscript.ExprDef.EBinop("==",vexpr,v),e.pmin,e.pmax);
						if(cond == null) cond = isEq; else cond = new hscript.Expr(hscript.ExprDef.EBinop("||",cond,isEq),e.pmin,e.pmax);
					}
					break;
				default:
					var isEq = new hscript.Expr(hscript.ExprDef.EBinop("==",vexpr,v),e.pmin,e.pmax);
					if(cond == null) cond = isEq; else cond = new hscript.Expr(hscript.ExprDef.EBinop("||",cond,isEq),e.pmin,e.pmax);
				}
			}
			if(c.guard != null) {
				if(cond == null) cond = c.guard; else cond = cond = new hscript.Expr(hscript.ExprDef.EBinop("&&",new hscript.Expr(hscript.ExprDef.EParent(cond),e.pmin,e.pmax),new hscript.Expr(hscript.ExprDef.EParent(c.guard),e.pmin,e.pmax)),e.pmin,e.pmax);
			}
			var ife;
			if(cond == null) ife = c.expr; else ife = new hscript.Expr(hscript.ExprDef.EIf(cond,c.expr,null),e.pmin,e.pmax);
			if(lastIf == null) lastIf = ife; else switch(lastIf.expr[1]) {
			case 9:
				var elsee = lastIf.expr[4];
				var ifee = lastIf.expr[3];
				var cond1 = lastIf.expr[2];
				if(elsee == null) {
					lastIf.expr = hscript.ExprDef.EIf(cond1,ifee,ife);
					lastIf = lastIf;
				} else {
				}
				break;
			default:
			}
			if(ife.expr[0] == "EIf") lastIf = ife;
		}
		if(def != null && lastIf == null && isVal) block.push(new hscript.Expr(hscript.ExprDef.EBinop("=",vexpr,def),e.pmin,e.pmax)); else if(def != null && lastIf == null) block.push(def); else if(lastIf == null) {
		} else switch(lastIf.expr[1]) {
		case 9:
			var elsee = lastIf.expr[4];
			var ife = lastIf.expr[3];
			var cond = lastIf.expr[2];
			if(elsee == null) lastIf.expr = hscript.ExprDef.EIf(cond,ife,def); else lastIf.expr = lastIf.expr;
			break;
		default:
			lastIf.expr = lastIf.expr;
		}
		if(lastIf != null) block.push(lastIf);
		if(isVal) block.push(new hscript.Expr(hscript.ExprDef.EReturn(vexpr),e.pmin,e.pmax));
		return new hscript.Expr(hscript.ExprDef.EBlock(block),e.pmin,e.pmax);
	default:
		return e;
	}
}
hscript.exec = {}
hscript.exec._Interp = {}
hscript.exec._Interp.Stop = { __ename__ : true, __constructs__ : ["SBreak","SContinue","SReturn"] }
hscript.exec._Interp.Stop.SBreak = ["SBreak",0];
hscript.exec._Interp.Stop.SBreak.toString = $estr;
hscript.exec._Interp.Stop.SBreak.__enum__ = hscript.exec._Interp.Stop;
hscript.exec._Interp.Stop.SContinue = ["SContinue",1];
hscript.exec._Interp.Stop.SContinue.toString = $estr;
hscript.exec._Interp.Stop.SContinue.__enum__ = hscript.exec._Interp.Stop;
hscript.exec._Interp.Stop.SReturn = function(v) { var $x = ["SReturn",2,v]; $x.__enum__ = hscript.exec._Interp.Stop; $x.toString = $estr; return $x; }
hscript.exec.Interp = function(){
	this.locals = new haxe.ds.StringMap();
	var _g = new haxe.ds.StringMap();
	_g.set("null",null);
	_g.set("true",true);
	_g.set("false",false);
	_g.set("trace",function(e){
		haxe.Log.trace(Std.string(e),{ fileName : "hscript", lineNumber : 0});
	});
	this.variables = _g;
	this.usings = new haxe.ds.StringMap();
	this.declared = new Array();
	this.flags = ["js","dce"];
	this.initOps();
};
$hxClasses["hscript.exec.Interp"] = hscript.exec.Interp;
hscript.exec.Interp.__name__ = true;
hscript.exec.Interp.wrap = function(e,i,c){
	return Reflect.makeVarArgs(function(args){
		i.declared.push({ n : "this", old : i.locals.get("this")});
		i.locals.set("this",{ r : this});
		i.expr(c.constructor.expr).apply(null,args);
	});
}
hscript.exec.Interp.prototype = {
	call: function(o,f,args){
		return f.apply(o,args);
	}
	,fcall: function(o,f,args){
		return Reflect.field(o,f).apply(o,args);
	}
	,set: function(o,f,v,e){
		if(o == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f),e.pmin,e.pmax);
		o[f] = v;
		return v;
	}
	,get: function(o,f,e){
		var v;
		if(o == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f),e.pmin,e.pmax); else if(f == "code" && js.Boot.__instanceof(o,String)) v = o.charCodeAt(0); else if(js.Boot.__instanceof(o,Enum)) v = Type.createEnum(o,f,[]); else {
			var v1 = Reflect.getProperty(o,f);
			if(v1 != null && v1 == hscript.exec.Property.Prop) v1 = Reflect.field(o,"get_" + f).apply(o,[]);
			v = v1;
		}
		return v;
	}
	,forLoop: function(n,it,e){
		var old = this.declared.length;
		this.declared.push({ n : n, old : this.locals.get(n)});
		var it1 = this.makeIterator(it);
		if(it1 == null) throw "Iterator is null";
		try {
			while(it1.hasNext()) {
				this.locals.set(n,{ r : it1.next()});
				try {
					this.expr(e);
				} catch( err ) {
					if( js.Boot.__instanceof(err,hscript.exec._Interp.Stop) ) {
						switch(err[1]) {
						case 1:
							break;
						case 0:
							throw "__break__";
							break;
						case 2:
							throw err;
							break;
						}
					} else throw(err);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,makeIterator: function(e){
		var v = this.expr(e);
		if(v.iterator != null || js.Boot.__instanceof(v,Array)) v = $iterator(v)();
		var c = Type.getClass(v);
		if(c == null && (v.hasNext == null || v.next == null)) throw new hscript.Error(hscript.ErrorDef.EInvalidIterator(v),e.pmin,e.pmax);
		return v;
	}
	,whileLoop: function(econd,e){
		var old = this.declared.length;
		try {
			while(this.expr(econd) == true) try {
				this.expr(e);
			} catch( err ) {
				if( js.Boot.__instanceof(err,hscript.exec._Interp.Stop) ) {
					switch(err[1]) {
					case 1:
						break;
					case 0:
						throw "__break__";
						break;
					case 2:
						throw err;
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,expr: function(e){
		var _g = this;
		try {
			switch(e.expr[1]) {
			case 26:
				var e1 = e.expr[2];
				var v = this.expr(e1);
				var _g1 = 0;
				var _g11 = Reflect.fields(v);
				while(_g1 < _g11.length) {
					var f = _g11[_g1];
					++_g1;
					var value = Reflect.field(v,f);
					this.usings.set(f,value);
				}
				break;
			case 25:
				var c = e.expr[2];
				var o = { };
				var pack = null;
				var packs = c.pack.slice();
				while(packs.length > 0) {
					var p = packs.pop();
					if(pack == null) {
						pack = { };
						this.locals.set(p,{ r : pack});
					} else if(Reflect.hasField(pack,p)) pack = Reflect.field(pack,p); else {
						var obj = { };
						pack[p] = obj;
						pack = obj;
					}
				}
				if(c.constructor != null) {
					var create = this.expr(c.constructor.expr);
					o["new"] = Reflect.makeVarArgs(function(args){
						var obj = { };
						var $it0 = c.fields.keys();
						while( $it0.hasNext() ) {
							var fn = $it0.next();
							var f = c.fields.get(fn);
							if(!((f.access & 1 << hscript.Access.Static[1]) != 0)) {
								if(f.expr == null || (f.access & 1 << hscript.Access.Function[1]) != 0) obj[fn] = null; else obj[fn] = _g.expr(f.expr);
							}
						}
						haxe.Log.trace(obj,{ fileName : "Interp.hx", lineNumber : 271, className : "hscript.exec.Interp", methodName : "expr"});
						_g.declared.push({ n : "this", old : _g.locals.get("this")});
						_g.locals.set("this",{ r : obj});
						create.apply(obj,args);
					});
				}
				var $it1 = c.fields.keys();
				while( $it1.hasNext() ) {
					var fn = $it1.next();
					var f = c.fields.get(fn);
					if((f.access & 1 << hscript.Access.Static[1]) != 0) {
						if(f.expr == null) o[fn] = null; else o[fn] = this.expr(f.expr);
					}
				}
				if(pack == null) {
					this.declared.push({ n : c.name, old : this.locals.get(c.name)});
					this.locals.set(c.name,{ r : o});
				} else pack[c.name] = o;
				if(c.fields.exists("main") && (c.fields.get("main").access & 1 << hscript.Access.Static[1]) != 0) o.main();
				break;
			case 27:
				var e2 = e.expr[2];
				var o1 = { };
				o1.__ename__ = [e2.name];
				var _g1 = [];
				var $it2 = e2.constructors.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					_g1.push(k);
				}
				o1.__constructs__ = _g1;
				o1.prototype = { __enum__ : true};
				$hxClasses[e2.name] = e2;
				var i = 0;
				var $it3 = e2.constructors.keys();
				while( $it3.hasNext() ) {
					var cn = $it3.next();
					var cn1 = [cn];
					var c1 = [e2.constructors.get(cn1[0])];
					o1[cn1[0]] = Reflect.makeVarArgs((function(c1,cn1){
						return function(args){
							if(args.length != c1[0].length) throw hscript.ErrorDef.EInvalidParameters(e2.name,args.length,c1[0].length);
							var no = [cn1[0],i].concat(args);
							no.prototype = o1.prototype;
							return no;
						};
					})(c1,cn1));
					i++;
				}
				var value = o1;
				this.variables.set(e2.name,value);
				break;
			case 24:
				var e1 = e.expr[2];
				this.expr(e1);
				break;
			case 0:
				var c = e.expr[2];
				switch(c[1]) {
				case 0:
					var v = c[2];
					return v;
				case 1:
					var f = c[2];
					return f;
				case 2:
					var s = c[2];
					return s;
				}
				break;
			case 1:
				var id = e.expr[2];
				return this.resolve(id,e);
			case 2:
				var vs = e.expr[2];
				var _g1 = 0;
				while(_g1 < vs.length) {
					var v = vs[_g1];
					++_g1;
					this.declared.push({ n : v.name, old : this.locals.get(v.name)});
					this.locals.set(v.name,{ r : v.expr == null?null:this.expr(v.expr)});
				}
				return null;
			case 3:
				var e1 = e.expr[2];
				return this.expr(e1);
			case 4:
				var exprs = e.expr[2];
				var old = this.declared.length;
				var v = null;
				var _g1 = 0;
				while(_g1 < exprs.length) {
					var e1 = exprs[_g1];
					++_g1;
					v = this.expr(e1);
				}
				this.restore(old);
				return v;
			case 5:
				var e1 = e.expr[2];
				switch(e.expr[2].expr[1]) {
				case 1:
					var f = e.expr[3];
					var ident = e.expr[2].expr[2];
					if(Type.resolveClass("" + ident + "." + f) != null) return this.resolve("" + ident + "." + f,e); else {
						var f1 = e.expr[3];
						return this.get(this.expr(e1),f1,e1);
					}
					break;
				default:
					var f1 = e.expr[3];
					return this.get(this.expr(e1),f1,e1);
				}
				break;
			case 6:
				var e2 = e.expr[4];
				var e1 = e.expr[3];
				var op = e.expr[2];
				var fop = this.binops.get(op);
				if(fop == null) throw new hscript.Error(hscript.ErrorDef.EInvalidOp(op),e.pmin,e.pmax);
				return fop(e1,e2);
			case 7:
				var e1 = e.expr[4];
				var prefix = e.expr[3];
				var op = e.expr[2];
				switch(op) {
				case "!":
					return this.expr(e1) != true;
				case "-":
					return -this.expr(e1);
				case "++":
					return this.increment(e1,prefix,1);
				case "--":
					return this.increment(e1,prefix,-1);
				case "~":
					return ~this.expr(e1);
				default:
					throw new hscript.Error(hscript.ErrorDef.EInvalidOp(op),e1.pmin,e1.pmax);
				}
				break;
			case 8:
				var e1 = e.expr[2];
				switch(e.expr[2].expr[1]) {
				case 1:
					switch(e.expr[2].expr[2]) {
					case "__js__":
						var params = e.expr[3];
						switch(e.expr[3].length) {
						case 1:
							switch(e.expr[3][0].expr[1]) {
							case 0:
								switch(e.expr[3][0].expr[2][1]) {
								case 2:
									var s = e.expr[3][0].expr[2][2];
									eval("window.value = " + s);
									return window.value;
								default:
									var args = new Array();
									var _g1 = 0;
									while(_g1 < params.length) {
										var p = params[_g1];
										++_g1;
										args.push(this.expr(p));
									}
									switch(e1.expr[1]) {
									case 5:
										var f1 = e1.expr[3];
										var e21 = e1.expr[2];
										var obj = this.expr(e21);
										if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
										return Reflect.field(obj,f1).apply(obj,args);
									default:
										return this.expr(e1).apply(null,args);
									}
								}
								break;
							default:
								var args = new Array();
								var _g1 = 0;
								while(_g1 < params.length) {
									var p = params[_g1];
									++_g1;
									args.push(this.expr(p));
								}
								switch(e1.expr[1]) {
								case 5:
									var f1 = e1.expr[3];
									var e21 = e1.expr[2];
									var obj = this.expr(e21);
									if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
									return Reflect.field(obj,f1).apply(obj,args);
								default:
									return this.expr(e1).apply(null,args);
								}
							}
							break;
						default:
							var args = new Array();
							var _g1 = 0;
							while(_g1 < params.length) {
								var p = params[_g1];
								++_g1;
								args.push(this.expr(p));
							}
							switch(e1.expr[1]) {
							case 5:
								var f1 = e1.expr[3];
								var e21 = e1.expr[2];
								var obj = this.expr(e21);
								if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
								return Reflect.field(obj,f1).apply(obj,args);
							default:
								return this.expr(e1).apply(null,args);
							}
						}
						break;
					default:
						var params = e.expr[3];
						var args = new Array();
						var _g1 = 0;
						while(_g1 < params.length) {
							var p = params[_g1];
							++_g1;
							args.push(this.expr(p));
						}
						switch(e1.expr[1]) {
						case 5:
							var f1 = e1.expr[3];
							var e21 = e1.expr[2];
							var obj = this.expr(e21);
							if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
							return Reflect.field(obj,f1).apply(obj,args);
						default:
							return this.expr(e1).apply(null,args);
						}
					}
					break;
				case 5:
					var ps = e.expr[3];
					var f = e.expr[2].expr[3];
					var e2 = e.expr[2].expr[2];
					if(this.usings.exists(f)) return this.usings.get(f).apply(null,[this.expr(e2)].concat(ps.map($bind(this,this.expr)))); else {
						var params = e.expr[3];
						var args = new Array();
						var _g1 = 0;
						while(_g1 < params.length) {
							var p = params[_g1];
							++_g1;
							args.push(this.expr(p));
						}
						switch(e1.expr[1]) {
						case 5:
							var f1 = e1.expr[3];
							var e21 = e1.expr[2];
							var obj = this.expr(e21);
							if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
							return Reflect.field(obj,f1).apply(obj,args);
						default:
							return this.expr(e1).apply(null,args);
						}
					}
					break;
				default:
					var params = e.expr[3];
					var args = new Array();
					var _g1 = 0;
					while(_g1 < params.length) {
						var p = params[_g1];
						++_g1;
						args.push(this.expr(p));
					}
					switch(e1.expr[1]) {
					case 5:
						var f1 = e1.expr[3];
						var e21 = e1.expr[2];
						var obj = this.expr(e21);
						if(obj == null) throw new hscript.Error(hscript.ErrorDef.EInvalidAccess(f1),e21.pmin,e21.pmax);
						return Reflect.field(obj,f1).apply(obj,args);
					default:
						return this.expr(e1).apply(null,args);
					}
				}
				break;
			case 18:
				var params = e.expr[3];
				var cl = e.expr[2];
				return Type.createInstance(this.resolve(cl,e),params.map($bind(this,this.expr)));
			case 9:
				var e2 = e.expr[4];
				var e1 = e.expr[3];
				var econd = e.expr[2];
				if(this.expr(econd) == true) return this.expr(e1); else if(e2 == null) return null; else return this.expr(e2);
				break;
			case 10:
				var e1 = e.expr[3];
				var econd = e.expr[2];
				this.whileLoop(econd,e1);
				return null;
			case 11:
				var e1 = e.expr[4];
				var it = e.expr[3];
				var v = e.expr[2];
				this.forLoop(v,it,e1);
				return null;
			case 12:
				throw hscript.exec._Interp.Stop.SBreak;
				break;
			case 13:
				throw hscript.exec._Interp.Stop.SContinue;
				break;
			case 15:
				var e1 = e.expr[2];
				throw hscript.exec._Interp.Stop.SReturn(e1 == null?null:this.expr(e1));
				break;
			case 14:
				var name = e.expr[4];
				var fexpr = e.expr[3];
				var params1 = e.expr[2];
				var capturedLocals = this.duplicate(this.locals);
				var me = this;
				var f = function(args){
					if(args.length != params1.length) throw hscript.ErrorDef.EInvalidParameters(name,args.length,params1.length);
					var old = me.locals;
					me.locals = me.duplicate(capturedLocals);
					var _g1 = 0;
					var _g2 = params1.length;
					while(_g1 < _g2) {
						var i = _g1++;
						me.locals.set(params1[i].name,{ r : args[i]});
					}
					var r = null;
					try {
						r = me.exprReturn(fexpr);
					} catch( e1 ) {
						me.locals = old;
						throw e1;
					}
					me.locals = old;
					return r;
				};
				var f1 = Reflect.makeVarArgs(f);
				if(name != null) this.variables.set(name,f1);
				return f1;
			case 17:
				var map = e.expr[2];
				var arr = e.expr[2];
				switch(e.expr[2].length) {
				case 1:
					switch(e.expr[2][0].expr[1]) {
					case 10:
						var ex = e.expr[2][0].expr[3];
						var cond = e.expr[2][0].expr[2];
						switch(ex.expr[1]) {
						case 6:
							switch(ex.expr[2]) {
							case "=>":
								var evalue = ex.expr[4];
								var ekey = ex.expr[3];
								var m = new haxe.ds.BalancedTree();
								while(this.expr(cond)) {
									var key = this.expr(ekey);
									var val = this.expr(evalue);
									m.set(key,val);
								}
								return m;
							default:
							}
							break;
						default:
						}
						var _g1 = [];
						while(this.expr(cond)) _g1.push(this.expr(ex));
						return _g1;
					case 11:
						var e1 = e.expr[2][0].expr[4];
						var it = e.expr[2][0].expr[3];
						var v = e.expr[2][0].expr[2];
						switch(e1.expr[1]) {
						case 6:
							switch(e1.expr[2]) {
							case "=>":
								var evalue = e1.expr[4];
								var ekey = e1.expr[3];
								var m = new haxe.ds.BalancedTree();
								this.declared.push({ n : v, old : this.locals.get(v)});
								var $it4 = this.makeIterator(it);
								while( $it4.hasNext() ) {
									var i = $it4.next();
									this.locals.set(v,{ r : i});
									var key = this.expr(ekey);
									var val = this.expr(evalue);
									m.set(key,val);
								}
								return m;
							default:
							}
							break;
						default:
						}
						var _g1 = [];
						var $it5 = this.makeIterator(it);
						while( $it5.hasNext() ) {
							var i = $it5.next();
							_g1.push((function($this) {
								var $r;
								$this.locals.set(v,{ r : i});
								$r = $this.expr(e1);
								return $r;
							}(this)));
						}
						return _g1;
					default:
						if(map.length > 0 && (function($this) {
							var $r;
							var _g1 = map[0];
							$r = (function($this) {
								var $r;
								switch(_g1.expr[1]) {
								case 6:
									$r = (function($this) {
										var $r;
										switch(_g1.expr[2]) {
										case "=>":
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									break;
								default:
									$r = false;
								}
								return $r;
							}($this));
							return $r;
						}(this))) {
							var m = new haxe.ds.BalancedTree();
							var _g1 = 0;
							while(_g1 < map.length) {
								var item = map[_g1];
								++_g1;
								switch(item.expr[1]) {
								case 6:
									switch(item.expr[2]) {
									case "=>":
										var b = item.expr[4];
										var a = item.expr[3];
										var k = this.expr(a);
										m.set(k,this.expr(b));
										break;
									default:
									}
									break;
								default:
								}
							}
							return m;
						} else {
							var a = new Array();
							var _g1 = 0;
							while(_g1 < arr.length) {
								var e1 = arr[_g1];
								++_g1;
								a.push(this.expr(e1));
							}
							return a;
						}
					}
					break;
				default:
					if(map.length > 0 && (function($this) {
						var $r;
						var _g1 = map[0];
						$r = (function($this) {
							var $r;
							switch(_g1.expr[1]) {
							case 6:
								$r = (function($this) {
									var $r;
									switch(_g1.expr[2]) {
									case "=>":
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}($this));
								break;
							default:
								$r = false;
							}
							return $r;
						}($this));
						return $r;
					}(this))) {
						var m = new haxe.ds.BalancedTree();
						var _g1 = 0;
						while(_g1 < map.length) {
							var item = map[_g1];
							++_g1;
							switch(item.expr[1]) {
							case 6:
								switch(item.expr[2]) {
								case "=>":
									var b = item.expr[4];
									var a = item.expr[3];
									var k = this.expr(a);
									m.set(k,this.expr(b));
									break;
								default:
								}
								break;
							default:
							}
						}
						return m;
					} else {
						var a = new Array();
						var _g1 = 0;
						while(_g1 < arr.length) {
							var e1 = arr[_g1];
							++_g1;
							a.push(this.expr(e1));
						}
						return a;
					}
				}
				break;
			case 16:
				var index = e.expr[3];
				var e1 = e.expr[2];
				return this.expr(e1)[this.expr(index)];
			case 19:
				var e1 = e.expr[2];
				throw this.expr(e1);
				break;
			case 20:
				var ecatch = e.expr[5];
				var n = e.expr[3];
				var e1 = e.expr[2];
				var old = this.declared.length;
				try {
					var v = this.expr(e1);
					this.restore(old);
					return v;
				} catch( $e6 ) {
					if( js.Boot.__instanceof($e6,hscript.exec._Interp.Stop) ) {
						var err = $e6;
						throw err;
					} else {
					var err = $e6;
					this.restore(old);
					this.declared.push({ n : n, old : this.locals.get(n)});
					this.locals.set(n,{ r : err});
					var v = this.expr(ecatch);
					this.restore(old);
					return v;
					}
				}
				break;
			case 21:
				var fl = e.expr[2];
				var o = { };
				var _g1 = 0;
				while(_g1 < fl.length) {
					var f = fl[_g1];
					++_g1;
					this.set(o,f.name,this.expr(f.e),e);
				}
				return o;
			case 22:
				var e2 = e.expr[4];
				var e1 = e.expr[3];
				var econd = e.expr[2];
				if(this.expr(econd) == true) return this.expr(e1); else return this.expr(e2);
				break;
			case 23:
				var edef = e.expr[4];
				var cases = e.expr[3];
				var ev = e.expr[2];
				var old = this.declared.length;
				var def;
				if(edef == null) def = null; else def = this.expr(edef);
				var val = this.expr(ev);
				this.declared.push({ n : "all", old : this.locals.get("all")});
				this.locals.set("all",{ r : val});
				var retv = null;
				var _g1 = 0;
				while(_g1 < cases.length) {
					var c = cases[_g1];
					++_g1;
					var matched = false;
					var _g11 = 0;
					var _g2 = c.values;
					try {
						while(_g11 < _g2.length) {
							var v = _g2[_g11];
							++_g11;
							switch(v.expr[1]) {
							case 1:
								switch(v.expr[2]) {
								case "all":case "_":
									matched = true;
									break;
								default:
									if(this.expr(v) == val) {
										matched = true;
										throw "__break__";
									}
								}
								break;
							default:
								if(this.expr(v) == val) {
									matched = true;
									throw "__break__";
								}
							}
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
					if(c.guard != null) matched = matched && this.expr(c.guard);
					if(matched) {
						retv = this.expr(c.expr);
						break;
					}
				}
				if(edef != null && retv == null) retv = this.expr(edef);
				this.restore(old);
				return retv;
			}
		} catch( er ) {
			if( js.Boot.__instanceof(er,String) ) {
				throw { v : "" + er + " while running " + hscript.Tools.toString(e)};
			} else throw(er);
		}
		return null;
	}
	,resolve: function(id,e){
		var l = this.locals.get(id);
		if(l != null) return l.r;
		var v = this.variables.get(id);
		if(this.variables.exists(id)) return v;
		var vthis = this.locals.get("this");
		if(vthis != null && vthis.r.id != null) return vthis.r.id;
		var c = Type.resolveClass(id);
		if(c != null) return c;
		throw new hscript.Error(hscript.ErrorDef.EUnknownVariable(id),e.pmin,e.pmax);
	}
	,restore: function(old){
		while(this.declared.length > old) {
			var d = this.declared.pop();
			this.locals.set(d.n,d.old);
		}
	}
	,duplicate: function(h){
		var h2 = new haxe.ds.StringMap();
		var $it0 = h.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			h2.set(k,h.get(k));
		}
		return h2;
	}
	,exprReturn: function(e){
		try {
			return this.expr(e);
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hscript.exec._Interp.Stop) ) {
				switch(e1[1]) {
				case 0:
					throw "Invalid break";
					break;
				case 1:
					throw "Invalid continue";
					break;
				case 2:
					var v = e1[2];
					return v;
				}
			} else throw(e1);
		}
	}
	,execute: function(expr){
		this.locals = new haxe.ds.StringMap();
		return this.expr(expr);
	}
	,increment: function(e,prefix,delta){
		var d = e;
		switch(d.expr[1]) {
		case 1:
			var id = d.expr[2];
			var l = this.locals.get(id);
			var v;
			if(l == null) v = this.variables.get(id); else v = l.r;
			if(prefix) {
				v += delta;
				if(l == null) {
					var value = v;
					this.variables.set(id,value);
				} else l.r = v;
			} else if(l == null) {
				var value = v + delta;
				this.variables.set(id,value);
			} else l.r = v + delta;
			return v;
		case 5:
			var f = d.expr[3];
			var e1 = d.expr[2];
			var obj = this.expr(e1);
			var v = this.get(obj,f,e1);
			if(prefix) {
				v += delta;
				this.set(obj,f,v,e1);
			} else this.set(obj,f,v + delta,e1);
			return v;
		case 16:
			var index = d.expr[3];
			var e1 = d.expr[2];
			var arr = this.expr(e1);
			var index1 = this.expr(index);
			var v = arr[index1];
			if(prefix) {
				v += delta;
				arr[index1] = v;
			} else arr[index1] = v + delta;
			return v;
		default:
			throw new hscript.Error(hscript.ErrorDef.EInvalidOp(delta > 0?"++":"--"),e.pmin,e.pmax);
		}
	}
	,evalAssignOp: function(op,fop,e1,e2){
		var v;
		switch(e1.expr[1]) {
		case 1:
			var id = e1.expr[2];
			var l = this.locals.get(id);
			v = fop(e1,e2);
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1.expr[3];
			var e = e1.expr[2];
			var obj = this.expr(e);
			v = fop(this.get(obj,f,e),this.expr(e2));
			v = this.set(obj,f,v,e);
			break;
		case 16:
			var index = e1.expr[3];
			var e = e1.expr[2];
			var arr = this.expr(e);
			var index1 = this.expr(index);
			v = fop(arr[index1],this.expr(e2));
			arr[index1] = v;
			break;
		default:
			throw new hscript.Error(hscript.ErrorDef.EInvalidOp(op),e1.pmin,e1.pmax);
		}
		return v;
	}
	,assign: function(e1,e2){
		var v = this.expr(e2);
		switch(e1.expr[1]) {
		case 1:
			var id = e1.expr[2];
			var l = this.locals.get(id);
			if(this.locals.exists("this") && Reflect.hasField(this.locals.get("this").r,id)) this.locals.get("this").r[id] = v; else if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1.expr[3];
			var e = e1.expr[2];
			v = this.set(this.expr(e),f,v,e);
			break;
		case 16:
			var index = e1.expr[3];
			var e = e1.expr[2];
			this.expr(e)[this.expr(index)] = v;
			break;
		default:
			throw new hscript.Error(hscript.ErrorDef.EInvalidOp("="),e1.pmin,e1.pmax);
		}
		return v;
	}
	,initOps: function(){
		var _g1 = this;
		var me = this;
		var _g = new haxe.ds.StringMap();
		_g.set("+",function(e1,e2){
			return me.expr(e1) + me.expr(e2);
		});
		_g.set("-",function(e1,e2){
			return me.expr(e1) - me.expr(e2);
		});
		_g.set("*",function(e1,e2){
			return me.expr(e1) * me.expr(e2);
		});
		_g.set("/",function(e1,e2){
			return me.expr(e1) / me.expr(e2);
		});
		_g.set("%",function(e1,e2){
			return me.expr(e1) % me.expr(e2);
		});
		_g.set("&",function(e1,e2){
			return me.expr(e1) & me.expr(e2);
		});
		_g.set("|",function(e1,e2){
			return me.expr(e1) | me.expr(e2);
		});
		_g.set("^",function(e1,e2){
			return me.expr(e1) ^ me.expr(e2);
		});
		_g.set("<<",function(e1,e2){
			return me.expr(e1) << me.expr(e2);
		});
		_g.set(">>",function(e1,e2){
			return me.expr(e1) >> me.expr(e2);
		});
		_g.set(">>>",function(e1,e2){
			return me.expr(e1) >>> me.expr(e2);
		});
		_g.set("==",function(e1,e2){
			return me.expr(e1) == me.expr(e2);
		});
		_g.set("!=",function(e1,e2){
			return me.expr(e1) != me.expr(e2);
		});
		_g.set(">=",function(e1,e2){
			return me.expr(e1) >= me.expr(e2);
		});
		_g.set("<=",function(e1,e2){
			return me.expr(e1) <= me.expr(e2);
		});
		_g.set(">",function(e1,e2){
			return me.expr(e1) > me.expr(e2);
		});
		_g.set("<",function(e1,e2){
			return me.expr(e1) < me.expr(e2);
		});
		_g.set("||",function(e1,e2){
			return me.expr(e1) == true || me.expr(e2) == true;
		});
		_g.set("&&",function(e1,e2){
			return me.expr(e1) == true && me.expr(e2) == true;
		});
		_g.set("=",$bind(this,this.assign));
		_g.set("...",function(e1,e2){
			return new IntIterator(me.expr(e1),me.expr(e2));
		});
		this.binops = _g;
		this.binops.set("+=",function(e1,e2){
			return _g1.evalAssignOp("+=",function(v1,v2){
				return v1 + v2;
			},e1,e2);
		});
		this.binops.set("-=",function(e1,e2){
			return _g1.evalAssignOp("-=",function(v1,v2){
				return v1 - v2;
			},e1,e2);
		});
		this.binops.set("*=",function(e1,e2){
			return _g1.evalAssignOp("*=",function(v1,v2){
				return v1 * v2;
			},e1,e2);
		});
		this.binops.set("/=",function(e1,e2){
			return _g1.evalAssignOp("/=",function(v1,v2){
				return v1 / v2;
			},e1,e2);
		});
		this.binops.set("%=",function(e1,e2){
			return _g1.evalAssignOp("%=",function(v1,v2){
				return v1 % v2;
			},e1,e2);
		});
		this.binops.set("&=",function(e1,e2){
			return _g1.evalAssignOp("&=",function(v1,v2){
				return v1 & v2;
			},e1,e2);
		});
		this.binops.set("|=",function(e1,e2){
			return _g1.evalAssignOp("|=",function(v1,v2){
				return v1 | v2;
			},e1,e2);
		});
		this.binops.set("^=",function(e1,e2){
			return _g1.evalAssignOp("^=",function(v1,v2){
				return v1 ^ v2;
			},e1,e2);
		});
		this.binops.set("<<=",function(e1,e2){
			return _g1.evalAssignOp("<<=",function(v1,v2){
				return v1 << v2;
			},e1,e2);
		});
		this.binops.set(">>=",function(e1,e2){
			return _g1.evalAssignOp(">>=",function(v1,v2){
				return v1 >> v2;
			},e1,e2);
		});
		this.binops.set(">>>=",function(e1,e2){
			return _g1.evalAssignOp(">>>=",function(v1,v2){
				return v1 >>> v2;
			},e1,e2);
		});
	}
	,__class__: hscript.exec.Interp
}
hscript.exec.Property = { __ename__ : true, __constructs__ : ["Prop"] }
hscript.exec.Property.Prop = ["Prop",0];
hscript.exec.Property.Prop.toString = $estr;
hscript.exec.Property.Prop.__enum__ = hscript.exec.Property;
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s){
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i){
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__string_rec = function(o,s){
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl){
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl){
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = true;
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = true;
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
hscript.Parser.p1 = 0;
hscript.Parser.readPos = 0;
hscript.Parser.tokenMin = 0;
hscript.Parser.tokenMax = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Test.main();
})();
