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
HxOverrides.iter = function(a){
	return { cur : 0, arr : a, hasNext : function(){
		return this.cur < this.arr.length;
	}, next : function(){
		return this.arr[this.cur++];
	}};
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field){
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
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
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s){
	return js.Boot.__string_rec(s,"");
}
Std.parseFloat = function(x){
	return parseFloat(x);
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by){
	return s.split(sub).join(by);
}
var Test = function() { }
$hxClasses["Test"] = Test;
Test.__name__ = true;
Test.test = function(x,v,vars){
	console.log("Running " + x);
	var p = new hscript.Parser();
	var program = p.parseString(x);
	var bytes = hscript.Bytes.encode(program);
	program = hscript.Bytes.decode(bytes);
	var interp = new hscript.JsJit();
	if(vars != null) {
		var _g = 0;
		var _g1 = Reflect.fields(vars);
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			var value = Reflect.field(vars,v1);
			interp.variables.set(v1,value);
		}
	}
	var ret = interp.execute(program);
	if(v != ret) throw "" + Std.string(ret) + " returned while " + Std.string(v) + " expected";
}
Test.main = function(){
	Test.test("0",0);
	Test.test("0xFF",255);
	Test.test("switch(29) {case all if(all < 64): 'goodbye'; default: 'hallo';}","goodbye");
	Test.test("switch(5 * 5) {case 25: 1; default: 50;}",1);
	Test.test("switch(5 * 5) {case 25 if(false): 1; default: 50;}",50);
	Test.test("0xBFFFFFFF",-1073741825);
	Test.test("0x7FFFFFFF",2147483647);
	Test.test("-123",-123);
	Test.test("- 123",-123);
	Test.test("1.546",1.546);
	Test.test(".545",.545);
	Test.test("'bla'","bla");
	Test.test("null",null);
	Test.test("true",true);
	Test.test("false",false);
	Test.test("1 == 2",false);
	Test.test("1.3 == 1.3",true);
	Test.test("5 > 3",true);
	Test.test("0 < 0",false);
	Test.test("-1 <= -1",true);
	Test.test("1 + 2",3);
	Test.test("~545",-546);
	Test.test("'abc' + 55","abc55");
	Test.test("'abc' + 'de'","abcde");
	Test.test("-1 + 2",1);
	Test.test("1 / 5",0.2);
	Test.test("3 * 2 + 5",11);
	Test.test("[for(i in a) 2 * i][0]",2,{ a : [1,2,3]});
	Test.test("3 * (2 + 5)",21);
	Test.test("3 * 2 // + 5 \n + 6",12);
	Test.test("3 /* 2\n */ + 5",8);
	Test.test("[55,66,77][1]",66);
	Test.test("var a = [55]; a[0] *= 2; a[0]",110);
	Test.test("x",55,{ x : 55});
	Test.test("var y = 33; y",33);
	Test.test("{ 1; 2; 3; }",3);
	Test.test("{ var x = 0; } x",55,{ x : 55});
	Test.test("o.val",55,{ o : { val : 55}});
	Test.test("o.val",null,{ o : { }});
	Test.test("var a = 1; a++",1);
	Test.test("var a = 1; a++; a",2);
	Test.test("var a = 1; ++a",2);
	Test.test("var a = 1; a *= 3",3);
	Test.test("a = b = 3; a + b",6);
	Test.test("add(1,2)",3,{ add : function(x,y){
		return x + y;
	}});
	Test.test("a.push(5); a.pop() + a.pop()",8,{ a : [3]});
	Test.test("if( true ) 1 else 2",1);
	Test.test("if( false ) 1 else 2",2);
	Test.test("var t = 0; for( x in [1,2,3] ) t += x; t",6);
	Test.test("var a = new Array(); for( x in 0...5 ) a[x] = x; a.join('-')","0-1-2-3-4");
	Test.test("(function(a,b) return a + b)(4,5)",9);
	Test.test("var y = 0; var add = function(a) y += a; add(5); add(3); y",8);
	Test.test("var a = [1,[2,[3,[4,null]]]]; var t = 0; while( a != null ) { t += a[0]; a = a[1]; }; t",10);
	Test.test("var t = 0; for( x in 1...10 ) t += x; t",45);
	Test.test("var t = 0; for( x in new IntIterator(1,10) ) t +=x; t",45);
	Test.test("var x = 1; try { var x = 66; throw 789; } catch( e : Dynamic ) e + x",790);
	Test.test("var x = 1; var f = function(x) throw x; try f(55) catch( e : Dynamic ) e + x",56);
	Test.test("var i=2; if( true ) --i; i",1);
	Test.test("var i=0; if( i++ > 0 ) i=3; i",1);
	Test.test("var a = 5/2; a",2.5);
	Test.test("{ x = 3; x; }",3);
	Test.test("{ x : 3, y : {} }.x",3);
	Test.test("function bug(){ \n }\nbug().x",null);
	Test.test("1 + 2 == 3",true);
	Test.test("-2 == 3 - 5",true);
	console.log("Done");
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = true;
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
haxe.ds = {}
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
	keys: function(){
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
	,add: function(src){
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
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
hscript.Bytes = function(bin){
	this.bin = bin;
	this.pin = 0;
	this.bout = new haxe.io.BytesBuffer();
	this.hstrings = new haxe.ds.StringMap();
	this.strings = [null];
	this.nstrings = 1;
};
$hxClasses["hscript.Bytes"] = hscript.Bytes;
hscript.Bytes.__name__ = true;
hscript.Bytes.encode = function(e){
	var b = new hscript.Bytes();
	b.doEncode(e);
	return b.bout.getBytes();
}
hscript.Bytes.decode = function(bytes){
	var b = new hscript.Bytes(bytes);
	return b.doDecode();
}
hscript.Bytes.prototype = {
	doDecode: function(){
		var _g = this.bin.b[this.pin++];
		switch(_g) {
		case 0:
			return hscript.Expr.EConst(this.doDecodeConst());
		case 1:
			return hscript.Expr.EIdent(this.doDecodeString());
		case 2:
			var v = this.doDecodeString();
			return hscript.Expr.EVar(v,null,this.doDecode());
		case 3:
			return hscript.Expr.EParent(this.doDecode());
		case 4:
			var a = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				a.push(this.doDecode());
			}
			return hscript.Expr.EBlock(a);
		case 5:
			var e = this.doDecode();
			return hscript.Expr.EField(e,this.doDecodeString());
		case 6:
			var op = this.doDecodeString();
			var e1 = this.doDecode();
			return hscript.Expr.EBinop(op,e1,this.doDecode());
		case 7:
			var op = this.doDecodeString();
			var prefix = this.bin.b[this.pin++] != 0;
			return hscript.Expr.EUnop(op,prefix,this.doDecode());
		case 8:
			var e = this.doDecode();
			var params = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				params.push(this.doDecode());
			}
			return hscript.Expr.ECall(e,params);
		case 9:
			var cond = this.doDecode();
			var e1 = this.doDecode();
			return hscript.Expr.EIf(cond,e1,this.doDecode());
		case 10:
			var cond = this.doDecode();
			return hscript.Expr.EWhile(cond,this.doDecode());
		case 11:
			var v = this.doDecodeString();
			var it = this.doDecode();
			return hscript.Expr.EFor(v,it,this.doDecode());
		case 12:
			return hscript.Expr.EBreak;
		case 13:
			return hscript.Expr.EContinue;
		case 14:
			var params = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				params.push({ name : this.doDecodeString(), t : null});
			}
			var e = this.doDecode();
			var name = this.doDecodeString();
			return hscript.Expr.EFunction(params,e,name == ""?null:name);
		case 15:
			return hscript.Expr.EReturn(this.doDecode());
		case 16:
			var e = this.doDecode();
			return hscript.Expr.EArray(e,this.doDecode());
		case 17:
			var el = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				el.push(this.doDecode());
			}
			return hscript.Expr.EArrayDecl(el);
		case 18:
			var cl = this.doDecodeString();
			var el = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				el.push(this.doDecode());
			}
			return hscript.Expr.ENew(cl,el);
		case 19:
			return hscript.Expr.EThrow(this.doDecode());
		case 20:
			var e = this.doDecode();
			var v = this.doDecodeString();
			return hscript.Expr.ETry(e,v,null,this.doDecode());
		case 21:
			var fl = new Array();
			var _g2 = 0;
			var _g1 = this.bin.b[this.pin++];
			while(_g2 < _g1) {
				var i = _g2++;
				var name = this.doDecodeString();
				var e = this.doDecode();
				fl.push({ name : name, e : e});
			}
			return hscript.Expr.EObject(fl);
		case 23:
			var e = this.doDecode();
			var cases;
			var _g1 = [];
			var _g3 = 0;
			var _g2 = this.bin.b[this.pin++];
			while(_g3 < _g2) {
				var i = _g3++;
				_g1.push((function($this) {
					var $r;
					var flags = $this.bin.b[$this.pin++];
					var values;
					{
						var _g4 = [];
						var _g6 = 0;
						var _g5 = $this.bin.b[$this.pin++];
						while(_g6 < _g5) {
							var i1 = _g6++;
							_g4.push($this.doDecode());
						}
						values = _g4;
					}
					var guard;
					if((flags & 1 << hscript.CaseFlags.HasGuard[1]) != 0) guard = $this.doDecode(); else guard = null;
					var expr;
					if((flags & 1 << hscript.CaseFlags.HasExpr[1]) != 0) expr = $this.doDecode(); else expr = null;
					$r = { values : values, guard : guard, expr : expr};
					return $r;
				}(this)));
			}
			cases = _g1;
			var edef;
			if(this.bin.b[this.pin++] == 1) edef = this.doDecode(); else edef = null;
			return hscript.Expr.ESwitch(e,cases,edef);
		case 255:
			return null;
		default:
			throw "Invalid code " + this.bin.b[this.pin - 1];
		}
	}
	,doEncode: function(e){
		this.bout.b.push(e[1]);
		switch(e[1]) {
		case 0:
			var c = e[2];
			this.doEncodeConst(c);
			break;
		case 1:
			var v = e[2];
			this.doEncodeString(v);
			break;
		case 2:
			var e1 = e[4];
			var n = e[2];
			this.doEncodeString(n);
			if(e1 == null) this.bout.b.push(255); else this.doEncode(e1);
			break;
		case 3:
			var e1 = e[2];
			this.doEncode(e1);
			break;
		case 4:
			var el = e[2];
			this.bout.b.push(el.length);
			var _g = 0;
			while(_g < el.length) {
				var e1 = el[_g];
				++_g;
				this.doEncode(e1);
			}
			break;
		case 5:
			var f = e[3];
			var e1 = e[2];
			this.doEncode(e1);
			this.doEncodeString(f);
			break;
		case 6:
			var e2 = e[4];
			var e1 = e[3];
			var op = e[2];
			this.doEncodeString(op);
			this.doEncode(e1);
			this.doEncode(e2);
			break;
		case 7:
			var e1 = e[4];
			var prefix = e[3];
			var op = e[2];
			this.doEncodeString(op);
			this.bout.b.push(prefix?1:0);
			this.doEncode(e1);
			break;
		case 8:
			var el = e[3];
			var e1 = e[2];
			this.doEncode(e1);
			this.bout.b.push(el.length);
			var _g = 0;
			while(_g < el.length) {
				var e2 = el[_g];
				++_g;
				this.doEncode(e2);
			}
			break;
		case 9:
			var e2 = e[4];
			var e1 = e[3];
			var cond = e[2];
			this.doEncode(cond);
			this.doEncode(e1);
			if(e2 == null) this.bout.b.push(255); else this.doEncode(e2);
			break;
		case 10:
			var e1 = e[3];
			var cond = e[2];
			this.doEncode(cond);
			this.doEncode(e1);
			break;
		case 11:
			var e1 = e[4];
			var it = e[3];
			var v = e[2];
			this.doEncodeString(v);
			this.doEncode(it);
			this.doEncode(e1);
			break;
		case 12:case 13:
			break;
		case 14:
			var name = e[4];
			var e1 = e[3];
			var params = e[2];
			this.bout.b.push(params.length);
			var _g = 0;
			while(_g < params.length) {
				var p = params[_g];
				++_g;
				this.doEncodeString(p.name);
			}
			this.doEncode(e1);
			this.doEncodeString(name == null?"":name);
			break;
		case 15:
			var e1 = e[2];
			if(e1 == null) this.bout.b.push(255); else this.doEncode(e1);
			break;
		case 16:
			var index = e[3];
			var e1 = e[2];
			this.doEncode(e1);
			this.doEncode(index);
			break;
		case 17:
			var el = e[2];
			if(el.length >= 255) throw "assert";
			this.bout.b.push(el.length);
			var _g = 0;
			while(_g < el.length) {
				var e1 = el[_g];
				++_g;
				this.doEncode(e1);
			}
			break;
		case 18:
			var params = e[3];
			var cl = e[2];
			this.doEncodeString(cl);
			this.bout.b.push(params.length);
			var _g = 0;
			while(_g < params.length) {
				var e1 = params[_g];
				++_g;
				this.doEncode(e1);
			}
			break;
		case 19:
			var e1 = e[2];
			this.doEncode(e1);
			break;
		case 20:
			var ecatch = e[5];
			var v = e[3];
			var e1 = e[2];
			this.doEncode(e1);
			this.doEncodeString(v);
			this.doEncode(ecatch);
			break;
		case 21:
			var fl = e[2];
			this.bout.b.push(fl.length);
			var _g = 0;
			while(_g < fl.length) {
				var f = fl[_g];
				++_g;
				this.doEncodeString(f.name);
				this.doEncode(f.e);
			}
			break;
		case 22:
			var e2 = e[4];
			var e1 = e[3];
			var cond = e[2];
			this.doEncode(cond);
			this.doEncode(e1);
			this.doEncode(e2);
			break;
		case 23:
			var def = e[4];
			var cases = e[3];
			var e1 = e[2];
			this.doEncode(e1);
			this.bout.b.push(cases.length);
			var _g = 0;
			while(_g < cases.length) {
				var c = cases[_g];
				++_g;
				var flags = 0;
				if(c.guard != null) flags |= 1 << hscript.CaseFlags.HasGuard[1];
				if(c.expr != null) flags |= 1 << hscript.CaseFlags.HasExpr[1];
				this.bout.b.push(flags);
				this.bout.b.push(c.values.length);
				var _g1 = 0;
				var _g2 = c.values;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					this.doEncode(v);
				}
				if(c.guard != null) this.doEncode(c.guard);
				if(c.expr != null) this.doEncode(c.expr);
			}
			this.bout.b.push(def == null?0:1);
			if(def != null) this.doEncode(def);
			break;
		}
	}
	,doDecodeConst: function(){
		var _g = this.bin.b[this.pin++];
		switch(_g) {
		case 0:
			return hscript.Const.CInt(this.bin.b[this.pin++]);
		case 1:
			var i = this.bin.b[this.pin] | this.bin.b[this.pin + 1] << 8 | this.bin.b[this.pin + 2] << 16 | this.bin.b[this.pin + 3] << 24;
			this.pin += 4;
			return hscript.Const.CInt(i);
		case 2:
			return hscript.Const.CFloat(Std.parseFloat(this.doDecodeString()));
		case 3:
			return hscript.Const.CString(this.doDecodeString());
		default:
			throw "Invalid code " + this.bin.b[this.pin - 1];
		}
	}
	,doEncodeConst: function(c){
		switch(c[1]) {
		case 0:
			var v = c[2];
			if(v >= 0 && v <= 255) {
				this.bout.b.push(0);
				this.bout.b.push(v);
			} else {
				this.bout.b.push(1);
				this.bout.b.push(v & 255);
				this.bout.b.push(v >> 8 & 255);
				this.bout.b.push(v >> 16 & 255);
				this.bout.b.push(v >>> 24);
			}
			break;
		case 1:
			var f = c[2];
			this.bout.b.push(2);
			this.doEncodeString(Std.string(f));
			break;
		case 2:
			var s = c[2];
			this.bout.b.push(3);
			this.doEncodeString(s);
			break;
		}
	}
	,doDecodeString: function(){
		var id = this.bin.b[this.pin++];
		if(id == 0) {
			var len = this.bin.b[this.pin];
			var str = this.bin.readString(this.pin + 1,len);
			this.pin += len + 1;
			if(this.strings.length == 255) this.strings = [null];
			this.strings.push(str);
			return str;
		}
		return this.strings[id];
	}
	,doEncodeString: function(v){
		var vid = this.hstrings.get(v);
		if(vid == null) {
			if(this.nstrings == 256) {
				this.hstrings = new haxe.ds.StringMap();
				this.nstrings = 1;
			}
			this.hstrings.set(v,this.nstrings);
			this.bout.b.push(0);
			var vb = haxe.io.Bytes.ofString(v);
			this.bout.b.push(vb.length);
			this.bout.add(vb);
			this.nstrings++;
		} else this.bout.b.push(vid);
	}
	,__class__: hscript.Bytes
}
hscript.CaseFlags = { __ename__ : true, __constructs__ : ["HasGuard","HasExpr"] }
hscript.CaseFlags.HasGuard = ["HasGuard",0];
hscript.CaseFlags.HasGuard.toString = $estr;
hscript.CaseFlags.HasGuard.__enum__ = hscript.CaseFlags;
hscript.CaseFlags.HasExpr = ["HasExpr",1];
hscript.CaseFlags.HasExpr.toString = $estr;
hscript.CaseFlags.HasExpr.__enum__ = hscript.CaseFlags;
hscript.Const = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString"] }
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Expr = { __ename__ : true, __constructs__ : ["EConst","EIdent","EVar","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary","ESwitch"] }
hscript.Expr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EVar = function(n,t,e) { var $x = ["EVar",2,n,t,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBreak = ["EBreak",12];
hscript.Expr.EBreak.toString = $estr;
hscript.Expr.EBreak.__enum__ = hscript.Expr;
hscript.Expr.EContinue = ["EContinue",13];
hscript.Expr.EContinue.toString = $estr;
hscript.Expr.EContinue.__enum__ = hscript.Expr;
hscript.Expr.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",23,e,cases,edef]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.CType = { __ename__ : true, __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] }
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.Error = { __ename__ : true, __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess"] }
hscript.Error.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnexpected = function(s) { var $x = ["EUnexpected",1,s]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnterminatedString = ["EUnterminatedString",2];
hscript.Error.EUnterminatedString.toString = $estr;
hscript.Error.EUnterminatedString.__enum__ = hscript.Error;
hscript.Error.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.Error.EUnterminatedComment.toString = $estr;
hscript.Error.EUnterminatedComment.__enum__ = hscript.Error;
hscript.Error.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.JsJit = function(){
	this.variables = new haxe.ds.StringMap();
};
$hxClasses["hscript.JsJit"] = hscript.JsJit;
hscript.JsJit.__name__ = true;
hscript.JsJit.prototype = {
	execute: function(e){
		var compiled = this.compile(e);
		console.log("Compiled " + Std.string(e) + " to " + compiled);
		return eval(compiled);
	}
	,compile: function(e,av){
		if(av == null) av = false;
		return (!av?"var " + ((function($this) {
			var $r;
			var _g = [];
			var $it0 = $this.variables.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				_g.push("" + k + " = " + $this.compile($this.variables.get(k),true));
			}
			$r = _g;
			return $r;
		}(this))).join(", ") + ";":"") + (function($this) {
			var $r;
			switch(e[1]) {
			case 0:
				$r = (function($this) {
					var $r;
					switch(e[2][1]) {
					case 0:
						$r = (function($this) {
							var $r;
							var v = e[2][2];
							$r = Std.string(v);
							return $r;
						}($this));
						break;
					case 1:
						$r = (function($this) {
							var $r;
							var v = e[2][2];
							$r = Std.string(v);
							return $r;
						}($this));
						break;
					case 2:
						$r = (function($this) {
							var $r;
							var v = e[2][2];
							$r = "\"" + StringTools.replace(v,"\"","\"") + "\"";
							return $r;
						}($this));
						break;
					}
					return $r;
				}($this));
				break;
			case 1:
				$r = (function($this) {
					var $r;
					var v = e[2];
					$r = v;
					return $r;
				}($this));
				break;
			case 2:
				$r = (function($this) {
					var $r;
					var e1 = e[4];
					var t = e[3];
					var n = e[2];
					$r = "var " + n + " = " + (e1 == null?"null":$this.compile(e1,true));
					return $r;
				}($this));
				break;
			case 3:
				$r = (function($this) {
					var $r;
					var pe = e[2];
					$r = "(" + $this.compile(pe,true) + ")";
					return $r;
				}($this));
				break;
			case 4:
				$r = (function($this) {
					var $r;
					var e1 = e[2];
					$r = ((function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < e1.length) {
								var ex = e1[_g1];
								++_g1;
								_g.push($this.compile(ex,true));
							}
						}
						$r = _g;
						return $r;
					}($this))).join(";") + ";";
					return $r;
				}($this));
				break;
			case 5:
				$r = (function($this) {
					var $r;
					var f = e[3];
					var e1 = e[2];
					$r = "" + $this.compile(e1,true) + "." + f;
					return $r;
				}($this));
				break;
			case 6:
				$r = (function($this) {
					var $r;
					var e2 = e[4];
					var e1 = e[3];
					var op = e[2];
					$r = "" + $this.compile(e1,true) + " " + op + " " + $this.compile(e2,true);
					return $r;
				}($this));
				break;
			case 7:
				$r = (function($this) {
					var $r;
					switch(e[3]) {
					case true:
						$r = (function($this) {
							var $r;
							var ex = e[4];
							var op = e[2];
							$r = "" + op + $this.compile(ex,true);
							return $r;
						}($this));
						break;
					case false:
						$r = (function($this) {
							var $r;
							var ex = e[4];
							var op = e[2];
							$r = "" + $this.compile(ex,true) + op;
							return $r;
						}($this));
						break;
					}
					return $r;
				}($this));
				break;
			case 8:
				$r = (function($this) {
					var $r;
					var ps = e[3];
					var ex = e[2];
					$r = $this.compile(ex,true) + "(" + ((function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < ps.length) {
								var p = ps[_g1];
								++_g1;
								_g.push($this.compile(p,true));
							}
						}
						$r = _g;
						return $r;
					}($this))).join(", ") + ")";
					return $r;
				}($this));
				break;
			case 10:
				$r = (function($this) {
					var $r;
					var le = e[3];
					var c = e[2];
					$r = "while(" + $this.compile(c,true) + "){" + $this.compile(le,true) + "}";
					return $r;
				}($this));
				break;
			case 16:
				$r = (function($this) {
					var $r;
					var i = e[3];
					var o = e[2];
					$r = "" + $this.compile(o,true) + "[" + $this.compile(i,true) + "]";
					return $r;
				}($this));
				break;
			case 17:
				$r = (function($this) {
					var $r;
					var vs = e[2];
					$r = (function($this) {
						var $r;
						switch(e[2].length) {
						case 1:
							$r = (function($this) {
								var $r;
								switch(e[2][0][1]) {
								case 11:
									$r = (function($this) {
										var $r;
										var e1 = e[2][0][4];
										var it = e[2][0][3];
										var v = e[2][0][2];
										$r = "while(" + $this.compile(it,true) + ".hasNext()){var " + v + " = " + $this.compile(it,true) + ".next(); " + $this.compile(e1,true) + "}";
										return $r;
									}($this));
									break;
								default:
									$r = "[" + ((function($this) {
										var $r;
										var _g = [];
										{
											var _g1 = 0;
											while(_g1 < vs.length) {
												var v = vs[_g1];
												++_g1;
												_g.push($this.compile(v,true));
											}
										}
										$r = _g;
										return $r;
									}($this))).join(", ") + "]";
								}
								return $r;
							}($this));
							break;
						default:
							$r = "[" + ((function($this) {
								var $r;
								var _g = [];
								{
									var _g1 = 0;
									while(_g1 < vs.length) {
										var v = vs[_g1];
										++_g1;
										_g.push($this.compile(v,true));
									}
								}
								$r = _g;
								return $r;
							}($this))).join(", ") + "]";
						}
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 15:
				$r = (function($this) {
					var $r;
					var v = e[2];
					$r = "return " + Std.string($bind($this,$this.compile)) + "(v, true)";
					return $r;
				}($this));
				break;
			case 20:
				$r = (function($this) {
					var $r;
					var ecatch = e[5];
					var t = e[4];
					var v = e[3];
					var e1 = e[2];
					$r = "try{" + $this.compile(e1,true) + "} catch(" + v + "){" + $this.compile(ecatch,true) + "}";
					return $r;
				}($this));
				break;
			case 21:
				$r = (function($this) {
					var $r;
					var fl = e[2];
					$r = "{" + ((function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < fl.length) {
								var f = fl[_g1];
								++_g1;
								_g.push("" + f.name + ": " + $this.compile(f.e,true));
							}
						}
						$r = _g;
						return $r;
					}($this))).join(", ") + "}";
					return $r;
				}($this));
				break;
			case 9:
				$r = (function($this) {
					var $r;
					var e2 = e[4];
					var e1 = e[3];
					var cond = e[2];
					$r = "if(" + $this.compile(cond,true) + "){" + $this.compile(e1,true) + " else {" + $this.compile(e2,true) + "}";
					return $r;
				}($this));
				break;
			case 22:
				$r = (function($this) {
					var $r;
					var e2 = e[4];
					var e1 = e[3];
					var cond = e[2];
					$r = "" + $this.compile(cond,true) + "?" + $this.compile(e1,true) + ":" + $this.compile(e2,true);
					return $r;
				}($this));
				break;
			case 19:
				$r = (function($this) {
					var $r;
					var v = e[2];
					$r = "throw " + $this.compile(e,true);
					return $r;
				}($this));
				break;
			case 13:
				$r = "continue";
				break;
			case 12:
				$r = "break";
				break;
			case 14:
				$r = (function($this) {
					var $r;
					var ret = e[5];
					var name = e[4];
					var e1 = e[3];
					var args = e[2];
					$r = "function" + (name == null?"":" " + name) + "(" + ((function($this) {
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
					}($this))).join(", ") + ")" + ("{" + $this.compile(e1,true) + "}");
					return $r;
				}($this));
				break;
			case 23:
				$r = (function($this) {
					var $r;
					var def = e[4];
					var cases = e[3];
					var e1 = e[2];
					$r = "function(v){return null;}(" + $this.compile(e1,true) + ")";
					return $r;
				}($this));
				break;
			case 18:
				$r = (function($this) {
					var $r;
					var ps = e[3];
					var cl = e[2];
					$r = Type.createInstance(Type.resolveClass(cl),(function($this) {
						var $r;
						var _g = [];
						{
							var _g1 = 0;
							while(_g1 < ps.length) {
								var p = ps[_g1];
								++_g1;
								_g.push($this.compile(p,true));
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
					var e1 = e[4];
					var it = e[3];
					var v = e[2];
					$r = "";
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
	}
	,__class__: hscript.JsJit
}
hscript.Token = { __ename__ : true, __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot"] }
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
hscript.Parser = function(){
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
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
	tokenString: function(t){
		switch(t[1]) {
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
				throw hscript.Error.EUnterminatedComment;
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
				} else return hscript.Token.TConst(hscript.Const.CString(this.readString(39)));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
									this.tokens.add(hscript.Token.TOp("..."));
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
				throw hscript.Error.EUnterminatedString;
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
						throw hscript.Error.EUnterminatedString;
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
	,parseExprList: function(etk){
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.tokens.add(tk);
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
				this.tokens.add(tk);
				return t;
			}
			break;
		default:
			this.tokens.add(tk);
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
				var op = t[2];
				if(op == "<") {
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
								var op1 = t[2];
								if(op1 == ">") throw "__break__";
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
				}
				break;
			default:
				this.tokens.add(t);
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
					switch(e1[1]) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.tokens.add(tk);
					return e1;
				}
				return this.parseExprNext(hscript.Expr.EUnop(op,false,e1));
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
			return this.parseExprNext(hscript.Expr.EField(e1,field));
		case 4:
			return this.parseExprNext(hscript.Expr.ECall(e1,this.parseExprList(hscript.Token.TPClose)));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(hscript.Expr.EArray(e1,e2));
		case 13:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return hscript.Expr.ETernary(e1,e2,e3);
		default:
			this.tokens.add(tk);
			return e1;
		}
	}
	,parseStructure: function(id){
		switch(id) {
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
				this.tokens.add(tk);
				if(semic) this.tokens.add(hscript.Token.TSemicolon);
			}
			return hscript.Expr.EIf(cond,e1,e2);
		case "var":
			var tk = this.token();
			var ident = null;
			switch(tk[1]) {
			case 2:
				var id1 = tk[2];
				ident = id1;
				break;
			default:
				this.unexpected(tk);
			}
			tk = this.token();
			var t = null;
			if(tk == hscript.Token.TDoubleDot && this.allowTypes) {
				t = this.parseType();
				tk = this.token();
			}
			var e = null;
			if(Type.enumEq(tk,hscript.Token.TOp("="))) e = this.parseExpr(); else this.tokens.add(tk);
			return hscript.Expr.EVar(ident,t,e);
		case "while":
			var econd = this.parseExpr();
			var e = this.parseExpr();
			return hscript.Expr.EWhile(econd,e);
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
			return hscript.Expr.EFor(vname,eiter,e);
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
									var _g = ntk = this.token();
									switch(_g[1]) {
									case 9:
										break;
									case 3:
										switch(_g[2]) {
										case "|":
											break;
										default:
											console.log(ntk);
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
											console.log(ntk);
											throw "__break__";
										}
										break;
									default:
										console.log(ntk);
										throw "__break__";
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
			return hscript.Expr.ESwitch(val,cases,def);
		case "break":
			return hscript.Expr.EBreak;
		case "continue":
			return hscript.Expr.EContinue;
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
				this.tokens.add(tk);
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
					if(tk == hscript.Token.TDoubleDot && this.allowTypes) {
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
			if(this.allowTypes) {
				tk = this.token();
				if(tk != hscript.Token.TDoubleDot) this.tokens.add(tk); else ret = this.parseType();
			}
			var body = this.parseExpr();
			return hscript.Expr.EFunction(args,body,name,ret);
		case "return":
			var tk = this.token();
			this.tokens.add(tk);
			var e;
			if(tk == hscript.Token.TSemicolon) e = null; else e = this.parseExpr();
			return hscript.Expr.EReturn(e);
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
			while(next) {
				tk = this.token();
				switch(tk[1]) {
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
			return hscript.Expr.ENew(a.join("."),args);
		case "throw":
			var e = this.parseExpr();
			return hscript.Expr.EThrow(e);
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
			var t = null;
			if(this.allowTypes) t = this.parseType(); else {
				tk = this.token();
				if(!Type.enumEq(tk,hscript.Token.TId("Dynamic"))) this.unexpected(tk);
			}
			this.ensure(hscript.Token.TPClose);
			var ec = this.parseExpr();
			return hscript.Expr.ETry(e,vname,t,ec);
		default:
			return null;
		}
	}
	,makeBinop: function(op,e1,e){
		switch(e[1]) {
		case 6:
			var e3 = e[4];
			var e2 = e[3];
			var op2 = e[2];
			if(this.opPriority.get(op) <= this.opPriority.get(op2) && !this.opRightAssoc.exists(op)) return hscript.Expr.EBinop(op2,this.makeBinop(op,e1,e2),e3); else return hscript.Expr.EBinop(op,e1,e);
			break;
		case 22:
			var e4 = e[4];
			var e3 = e[3];
			var e2 = e[2];
			if(this.opRightAssoc.exists(op)) return hscript.Expr.EBinop(op,e1,e); else return hscript.Expr.ETernary(this.makeBinop(op,e1,e2),e3,e4);
			break;
		default:
			return hscript.Expr.EBinop(op,e1,e);
		}
	}
	,makeUnop: function(op,e){
		switch(e[1]) {
		case 6:
			var e2 = e[4];
			var e1 = e[3];
			var bop = e[2];
			return hscript.Expr.EBinop(bop,this.makeUnop(op,e1),e2);
		case 22:
			var e3 = e[4];
			var e2 = e[3];
			var e1 = e[2];
			return hscript.Expr.ETernary(this.makeUnop(op,e1),e2,e3);
		default:
			return hscript.Expr.EUnop(op,true,e);
		}
	}
	,parseExpr: function(){
		var tk = this.token();
		switch(tk[1]) {
		case 2:
			var id = tk[2];
			var e = this.parseStructure(id);
			if(e == null) e = hscript.Expr.EIdent(id);
			return this.parseExprNext(e);
		case 1:
			var c = tk[2];
			return this.parseExprNext(hscript.Expr.EConst(c));
		case 4:
			var e = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(hscript.Expr.EParent(e));
		case 6:
			tk = this.token();
			switch(tk[1]) {
			case 7:
				return this.parseExprNext(hscript.Expr.EObject([]));
			case 2:
				var tk2 = this.token();
				this.tokens.add(tk2);
				this.tokens.add(tk);
				switch(tk2[1]) {
				case 14:
					return this.parseExprNext(this.parseObject(0));
				default:
				}
				break;
			case 1:
				var c = tk[2];
				if(this.allowJSON) switch(c[1]) {
				case 2:
					var tk2 = this.token();
					this.tokens.add(tk2);
					this.tokens.add(tk);
					switch(tk2[1]) {
					case 14:
						return this.parseExprNext(this.parseObject(0));
					default:
					}
					break;
				default:
					this.tokens.add(tk);
				} else this.tokens.add(tk);
				break;
			default:
				this.tokens.add(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.tokens.add(tk);
			}
			return hscript.Expr.EBlock(a);
		case 3:
			var op = tk[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.tokens.add(tk);
				a.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(hscript.Expr.EArrayDecl(a));
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
		return this.parseExprNext(hscript.Expr.EObject(fl));
	}
	,parseFullExpr: function(){
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.tokens.add(tk); else this.unexpected(tk);
		}
		return e;
	}
	,isBlock: function(e){
		switch(e[1]) {
		case 4:case 21:
			return true;
		case 14:
			var e1 = e[3];
			return this.isBlock(e1);
		case 2:
			var e1 = e[4];
			return e1 != null && this.isBlock(e1);
		case 9:
			var e2 = e[4];
			var e1 = e[3];
			if(e2 != null) return this.isBlock(e2); else return this.isBlock(e1);
			break;
		case 6:
			var e1 = e[4];
			return this.isBlock(e1);
		case 7:
			var e1 = e[4];
			var prefix = e[3];
			return !prefix && this.isBlock(e1);
		case 10:
			var e1 = e[3];
			return this.isBlock(e1);
		case 11:
			var e1 = e[4];
			return this.isBlock(e1);
		case 15:
			var e1 = e[2];
			return e1 != null && this.isBlock(e1);
		case 23:
			return true;
		default:
			return false;
		}
	}
	,ensure: function(tk){
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,unexpected: function(tk){
		throw hscript.Error.EUnexpected(this.tokenString(tk));
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
			this.tokens.add(tk);
			a.push(this.parseFullExpr());
		}
		if(a.length == 1) return a[0]; else return hscript.Expr.EBlock(a);
	}
	,parseString: function(s){
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,invalidChar: function(c){
		throw hscript.Error.EInvalidChar(c);
	}
	,__class__: hscript.Parser
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
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
Test.main();
})();
