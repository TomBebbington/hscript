/*
 * Copyright (c) 2008, Nicolas Cannasse
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE HAXE PROJECT CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE HAXE PROJECT CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */
package hscript.exec;
import hscript.Expr;
import haxe.macro.Expr in MExpr;

private enum Stop {
	SBreak;
	SContinue;
	SReturn(v:Dynamic);
}

class Interp {
	public var variables:Map<String,Dynamic>;
	var locals:Map<String,{ r:Dynamic }>;
	var binops:Map<String, Expr -> Expr -> Dynamic >;
	var usings:Map<String, Dynamic>;
	var flags:Array<String>;
	var declared:Array<{ n:String, old:{ r:Dynamic } }>;
	public function new() {
		locals = new Map();
		variables = [
			"null" => null,
			"true" => true,
			"false" => false,
			"trace" => function(e:Dynamic) haxe.Log.trace(Std.string(e), cast { fileName:"hscript", lineNumber:0 })
		];
		usings = new Map<String, Dynamic>();
		declared = new Array();
		flags = getFlags();
		initOps();
	}
	static macro function getFlags():haxe.macro.Expr.ExprOf<Array<String>> {
		var fs:Array<String> = ["js", "sys", "java", "cpp", "cs", "flash", "as3", "dce", "debug"];
		fs = [for(f in fs) if(haxe.macro.Context.defined(f)) f];
		return macro $v{fs};
	}
	function initOps():Void {
		var me = this;
		binops = [
			"+" => function(e1,e2) return me.expr(e1) + me.expr(e2),
			"-" => function(e1,e2) return me.expr(e1) - me.expr(e2),
			"*" => function(e1,e2) return me.expr(e1) * me.expr(e2),
			"/" => function(e1,e2) return me.expr(e1) / me.expr(e2),
			"%" => function(e1,e2) return me.expr(e1) % me.expr(e2),
			"&" => function(e1,e2) return me.expr(e1) & me.expr(e2),
			"|" => function(e1,e2) return me.expr(e1) | me.expr(e2),
			"^" => function(e1,e2) return me.expr(e1) ^ me.expr(e2),
			"<<" => function(e1,e2) return me.expr(e1) << me.expr(e2),
			">>" => function(e1,e2) return me.expr(e1) >> me.expr(e2),
			">>>" => function(e1,e2) return me.expr(e1) >>> me.expr(e2),
			"==" => function(e1,e2) return me.expr(e1) == me.expr(e2),
			"!=" => function(e1,e2) return me.expr(e1) != me.expr(e2),
			">=" => function(e1,e2) return me.expr(e1) >= me.expr(e2),
			"<=" => function(e1,e2) return me.expr(e1) <= me.expr(e2),
			">" => function(e1,e2) return me.expr(e1) > me.expr(e2),
			"<" => function(e1,e2) return me.expr(e1) < me.expr(e2),
			"||" => function(e1,e2) return me.expr(e1) == true || me.expr(e2) == true,
			"&&" => function(e1,e2) return me.expr(e1) == true && me.expr(e2) == true,
			"=" => assign,
			"..." => function(e1,e2) return new IntIterator(me.expr(e1),me.expr(e2))
		];
		assignOp(this,"+=",function(v1:Dynamic,v2:Dynamic) return v1 + v2);
		assignOp(this,"-=",function(v1:Float,v2:Float) return v1 - v2);
		assignOp(this,"*=",function(v1:Float,v2:Float) return v1 * v2);
		assignOp(this,"/=",function(v1:Float,v2:Float) return v1 / v2);
		assignOp(this,"%=",function(v1:Float,v2:Float) return v1 % v2);
		assignOp(this,"&=",function(v1,v2) return v1 & v2);
		assignOp(this,"|=",function(v1,v2) return v1 | v2);
		assignOp(this,"^=",function(v1,v2) return v1 ^ v2);
		assignOp(this,"<<=",function(v1,v2) return v1 << v2);
		assignOp(this,">>=",function(v1,v2) return v1 >> v2);
		assignOp(this,">>>=",function(v1,v2) return v1 >>> v2);
	}

	function assign(e1:Expr, e2:Expr):Dynamic {
		var v = expr(e2);
		switch(e1.expr) {
			case EIdent(id):
				var l = locals.get(id);
				if(locals.exists("this") && Reflect.hasField(locals["this"].r, id))
					Reflect.setField(locals["this"].r, id, v);
				else if(l == null)
					variables.set(id,v)
				else
					l.r = v;
			case EField(e,f):
				v = set(expr(e),f,v, e);
			case EArray(e,index):
				expr(e)[expr(index)] = v;
			default:throw Error.with(EInvalidOp("="), e1);
		}
		return v;
	}

	static macro function assignOp(self:haxe.macro.Expr.ExprOf<Interp>, op:String, fop:haxe.macro.Expr.ExprOf<Expr -> Expr -> Dynamic>):haxe.macro.Expr {
		return macro $self.binops.set($v{op}, function(e1:Expr, e2:Expr) return $self.evalAssignOp($v{op}, $fop, e1, e2));
	}

	function evalAssignOp<T>(op:String,fop:Dynamic -> Dynamic -> Dynamic,e1:Expr,e2:Expr):Dynamic {
		var v;
		switch(e1.expr) {
			case EIdent(id):
				var l = locals.get(id);
				v = fop(e1, e2);
				if(l == null)
					variables.set(id,v)
				else
					l.r = v;
			case EField(e,f):
				var obj = expr(e);
				v = fop(get(obj,f, e),expr(e2));
				v = set(obj,f,v, e);
			case EArray(e,index):
				var arr = expr(e);
				var index = expr(index);
				v = fop(arr[index],expr(e2));
				arr[index] = v;
			default:
				throw Error.with(EInvalidOp(op), e1);
		}
		return v;
	}

	function increment(e:Expr, prefix:Bool, delta:Int):Dynamic {
		var d:Expr  = e;
		return switch(d.expr) {
			case EIdent(id):
				var l = locals.get(id);
				var v:Dynamic = (l == null) ? variables.get(id):l.r;
				if(prefix) {
					v += delta;
					if(l == null) variables.set(id,v) else l.r = v;
				} else
					if(l == null) variables.set(id,v + delta) else l.r = v + delta;
				v;
			case EField(e,f):
				var obj = expr(e);
				var v:Dynamic = get(obj,f, e);
				if(prefix) {
					v += delta;
					set(obj,f,v, e);
				} else
					set(obj,f,v + delta, e);
				v;
			case EArray(e,index):
				var arr = expr(e);
				var index = expr(index);
				var v = arr[index];
				if(prefix) {
					v += delta;
					arr[index] = v;
				} else
					arr[index] = v + delta;
				v;
			default:
				throw Error.with(EInvalidOp((delta > 0)?"++":"--"), e);
		}
	}

	public function execute(expr:Expr):Dynamic {
		locals = new Map();
		return this.expr(expr);
	}

	function exprReturn(e):Dynamic {
		return try
			expr(e)
		catch(e:Stop) {
			switch(e) {
				case SBreak: throw "Invalid break";
				case SContinue: throw "Invalid continue";
				case SReturn(v): v;
			}
		}
	}

	function duplicate<T>(h:#if haxe3 Map < String, T > #else Hash<T> #end) {
		#if haxe3
		var h2 = new Map();
		#else
		var h2 = new Hash();
		#end
		for(k in h.keys())
			h2.set(k,h.get(k));
		return h2;
	}

	function restore(old:Int) {
		while(declared.length > old) {
			var d = declared.pop();
			locals.set(d.n,d.old);
		}
	}
	function resolve(id:String, e:Expr):Dynamic {
		var l = locals.get(id);
		if(l != null)
			return l.r;
		var v = variables.get(id);
		if(variables.exists(id))
			return v;
		var vthis = locals.get("this");
		if(vthis != null && vthis.r.id != null)
			return vthis.r.id;
		var c = Type.resolveClass(id);
		if(c != null)
			return c;
		throw Error.with(EUnknownVariable(id), e);
	}
	static function wrap(e:Expr, i:Interp, c:ClassDecl):Dynamic {
		return Reflect.makeVarArgs(function(args) {
			i.declared.push({n : "this", old: i.locals.get("this")});
			i.locals.set("this", {r: untyped __js__("this")});
			Reflect.callMethod(null, i.expr(c.constructor.expr), args);
		});
	}
	public function expr(e:Expr):Dynamic {
		#if !debug try #end switch(e.expr) {
			case EUsing(e):
				var v = expr(e);
				for(f in Reflect.fields(v))
					usings.set(f, Reflect.field(v, f));
			case EMacro(n, args):
				trace('$n:$args');
			case EClassDecl(c):
				var o:Dynamic = {};
				var pack:Dynamic = null;
				var packs = c.pack.copy();
				while(packs.length > 0) {
					var p = packs.pop();
					if(pack == null) {
						pack = {};
						locals.set(p, {r: pack});
					} else if(Reflect.hasField(pack, p))
						pack = Reflect.field(pack, p);
					else {
						var obj = {};
						Reflect.setField(pack, p, obj);
						pack = obj;
					}
				}
				if(c.constructor != null) {
					var create = expr(c.constructor.expr);
					Reflect.setField(o, "new", Reflect.makeVarArgs(function(args) {
						var obj:Dynamic = {};
						for(fn in c.fields.keys()) {
							var f = c.fields[fn];
							if(!f.access.has(Static))
								Reflect.setField(obj, fn, f.expr == null || f.access.has(Function) ? null : expr(f.expr));
						}
						trace(obj);
						declared.push({ n: "this", old: locals.get("this")});
						locals.set("this", {r: obj});
						Reflect.callMethod(obj, create, args);
					}));
				}
				for(fn in c.fields.keys()) {
					var f = c.fields[fn];
					if(f.access.has(Static))
						Reflect.setField(o, fn, f.expr == null ? null : expr(f.expr));
				}
				if(pack == null) {
					declared.push({ n: c.name, old: locals.get(c.name)});
					locals.set(c.name, {r: o});
				} else
					Reflect.setField(pack, c.name, o);
				if(c.fields.exists("main") && c.fields["main"].access.has(Static))
					o.main();
			case EEnumDecl(e):
				var o:Dynamic = {};
				#if js
					Reflect.setField(o, "__ename__", [e.name]);
					Reflect.setField(o, "__constructs__", [for(k in e.constructors.keys()) k]);
					Reflect.setField(o, "prototype", {__enum__: true});
					Reflect.setField(untyped $hxClasses, e.name, e);
				#elseif neko
					var proto:Dynamic = {};
					Reflect.setField(proto, "__enum__", o);
					Reflect.setField(o, "prototype", proto);
				#end
				var i = 0;
				for(cn in e.constructors.keys()) {
					var c = e.constructors.get(cn);
					Reflect.setField(o, cn, Reflect.makeVarArgs(function(args:Array<Dynamic>) {
						if(args.length != c.length) throw EInvalidParameters(e.name, args.length, c.length);
						var no:Dynamic = #if js untyped [cn, i].concat(args) #else {
							tag: cn,
							index: i,
							args: args
						} #end;
						#if neko
							untyped __dollar__objsetproto(no, Reflect.field(o, "prototype"));
						#elseif js
							untyped no.prototype = o.prototype;
						#end
						return no;
					}));
					i++;
				}
				variables.set(e.name, o);
			case EUntyped(e): expr(e);
			case EConst(c):
				switch(c) {
					case CInt(v):return v;
					case CFloat(f):return f;
					case CString(s):return s;
					#if !haxe3
					case CInt32(v):return v;
					#end
				}
			case EIdent(id):
				return resolve(id, e);
			case EVars(vs):
				for(v in vs) {
					declared.push({ n:v.name, old:locals.get(v.name) });
					locals.set(v.name,{ r:(v.expr == null)?null:expr(v.expr) });
				}
				return null;
			case EParent(e):
				return expr(e);
			case EBlock(exprs):
				var old = declared.length;
				var v = null;
				for(e in exprs)
					v = expr(e);
				restore(old);
				return v;
			case EField({expr: EIdent(ident)}, f) if(Type.resolveClass('$ident.$f') != null):
				return resolve('$ident.$f', e);
			case EField(e,f):
				return get(expr(e),f, e);
			case EBinop(op,e1,e2):
				var fop = binops[op];
				if(fop == null) throw Error.with(EInvalidOp(op), e);
				return fop(e1,e2);
			case EUnop(op,prefix,e):
				switch(op) {
					case "!":
						return expr(e) != true;
					case "-":
						return -expr(e);
					case "++":
						return increment(e,prefix,1);
					case "--":
						return increment(e,prefix,-1);
					case "~":
						#if (neko && !haxe3)
						return haxe.Int32.complement(expr(e));
						#else
						return ~expr(e);
						#end
					default:
						throw Error.with(EInvalidOp(op), e);
				}
			#if js
			case ECall({expr: EIdent("__js__")}, [{expr: EConst(CString(s))}]):
				js.Lib.eval("window.value = "+s);
				return untyped window.value;
			#end
			case ECall({expr: EField(e,f)}, ps) if(usings.exists(f)):
				return call(null, usings.get(f), [expr(e)].concat(ps.map(expr)));
			case ECall(e,params):
				var args = new Array();
				for(p in params)
					args.push(expr(p));
				switch(e.expr) {
					case EField(e,f):
						var obj = expr(e);
						if(obj == null) throw Error.with(EInvalidAccess(f), e);
						return fcall(obj,f,args);
					default:
						return call(null,expr(e),args);
				}
			case ENew(cl, params):
				return Type.createInstance(resolve(cl, e), params.map(expr));
			case EIf(econd,e1,e2):
				return if(expr(econd) == true) expr(e1) else if(e2 == null) null else expr(e2);
			case EWhile(econd,e):
				whileLoop(econd,e);
				return null;
			case EFor(v,it,e):
				forLoop(v,it,e);
				return null;
			case EBreak:
				throw SBreak;
			case EContinue:
				throw SContinue;
			case EReturn(e):
				throw SReturn((e == null)?null:expr(e));
			case EFunction(params,fexpr,name,_):
				var capturedLocals = duplicate(locals);
				var me = this;
				var f = function(args:Array<Dynamic>) {
					if(args.length != params.length) throw EInvalidParameters(name, args.length, params.length);
					var old = me.locals;
					me.locals = me.duplicate(capturedLocals);
					for(i in 0...params.length)
						me.locals.set(params[i].name,{ r:args[i] });
					var r = null;
					try
						r = me.exprReturn(fexpr)
					catch(e:Dynamic) {
						me.locals = old;
						#if neko
						neko.Lib.rethrow(e);
						#else
						throw e;
						#end
					}
					me.locals = old;
					return r;
				};
				var f = Reflect.makeVarArgs(f);
				if(name != null)
					variables.set(name,f);
				return f;
			case EArrayDecl([{expr: EWhile(cond, ex)}]):
				switch(ex.expr) {
					case EBinop("=>", ekey, evalue):
						var m = new haxe.ds.BalancedTree<Dynamic, Dynamic>();
						while(expr(cond)) {
							var key = expr(ekey);
							var val = expr(evalue);
							m.set(key, val);
						}
						return m;
					default:
				}
				return [while(expr(cond)) expr(ex)];
			case EArrayDecl([{expr: EFor(v, it, e)}]):
				switch(e.expr) {
					case EBinop("=>", ekey, evalue):
						var m = new haxe.ds.BalancedTree<Dynamic, Dynamic>();
						declared.push({ n:v, old:locals.get(v) });
						for(i in makeIterator(it)) {
							locals.set(v,{ r:i });
							var key = expr(ekey);
							var val = expr(evalue);
							m.set(key, val);
						}
						return m;
					default:
				}
				return [for(i in makeIterator(it)) {
					locals.set(v, {r:i});
					expr(e);
				}];
			case EArrayDecl(map) if(map.length > 0 && switch(map[0].expr) {
				case EBinop("=>", _, _): true;
				default: false;
			}):
				var m = new haxe.ds.BalancedTree();
				for(item in map) {
					switch(item.expr) {
						case EBinop("=>", a, b):
							var k = expr(a);
							m.set(k, expr(b));
						default:
					}
				}
				return m;
			case EArrayDecl(arr):
				var a = new Array();
				for(e in arr)
					a.push(expr(e));
				return a;
			case EArray(e,index):
				return expr(e)[expr(index)];
			case EThrow(e):
				throw expr(e);
			case ETry(e,n,_,ecatch):
				var old = declared.length;
				try {
					var v:Dynamic = expr(e);
					restore(old);
					return v;
				} catch(err:Stop) throw err
				catch(err:Dynamic) {
					// restore vars
					restore(old);
					// declare 'v'
					declared.push({ n:n, old:locals.get(n) });
					locals.set(n,{ r:err });
					var v:Dynamic = expr(ecatch);
					restore(old);
					return v;
				}
			case EObject(fl):
				var o = {};
				for(f in fl)
					set(o,f.name,expr(f.e), e);
				return o;
			case ETernary(econd,e1,e2):
				return if(expr(econd) == true) expr(e1) else expr(e2);
			case ESwitch(ev, cases, edef):
				var old = declared.length;
				var def:Dynamic = edef == null ? null : expr(edef);
				var val:Dynamic = expr(ev);
				declared.push({ n:"all", old:locals.get("all") });
				locals.set("all", {r: val});
				var retv:Dynamic = null;
				for(c in cases) {
					var matched = false;
					for(v in c.values) {
						switch(v.expr) {
							case EIdent("all" | "_"):
								matched = true;
							case _ if(expr(v) == val):
								matched = true;
								break;
						}
					}
					if(c.guard != null)
						matched = matched && expr(c.guard);
					if(matched) {
						retv = expr(c.expr);
						break;
					}
				}
				if(edef != null && retv == null) 
					retv = expr(edef);
				restore(old);
				return retv;
		} #if !debug catch(er:String) throw {v:'$er while running ${hscript.Tools.toString(e)}'}; #end
		return null;
	}

	function whileLoop(econd,e) {
		var old = declared.length;
		while(expr(econd) == true) {
			try {
				expr(e);
			} catch(err:Stop) {
				switch(err) {
					case SContinue:
					case SBreak:break;
					case SReturn(_):throw err;
				}
			}
		}
		restore(old);
	}

	function makeIterator(e:Expr):Iterator<Dynamic> {
		var v:Dynamic = expr(e);
		if(v.iterator != null || Std.is(v, Array)) v = v.iterator();
		var c = Type.getClass(v);
		if(c == null && (v.hasNext == null || v.next == null)) throw Error.with(EInvalidIterator(v), e);
		return v;
	}
	function forLoop(n,it,e) {
		var old = declared.length;
		declared.push({ n:n, old:locals.get(n) });
		var it = makeIterator(it);
		if(it == null)
			throw "Iterator is null";
		while(it.hasNext()) {
			locals.set(n,{ r:it.next() });
			try {
				expr(e);
			} catch(err:Stop) {
				switch(err) {
				case SContinue:
				case SBreak:break;
				case SReturn(_):throw err;
				}
			}
		}
		restore(old);
	}

	function get(o:Dynamic, f:String, e:Expr):Dynamic {
		//trace(Reflect.fields(o));
		var v = if(o == null) throw Error.with(EInvalidAccess(f), e);
		else if(f == "code" && Std.is(o, String)) o.charCodeAt(0);
		else if(Std.is(o, Enum))
			Type.createEnum(o, f, []);
		else {
			var v:Dynamic = Reflect.field(o,f);
			if(v != null && v == Prop)
				v = fcall(o, 'get_$f', []);
			v;
		};
		return v;
	}

	function set(o:Dynamic, f:String, v:Dynamic, e:Expr):Dynamic {
		if(o == null) throw Error.with(EInvalidAccess(f), e);
		Reflect.setField(o,f,v);
		return v;
	}

	inline function fcall(o:Dynamic, f:String, args:Array<Dynamic>):Dynamic {
		return call(o, Reflect.field(o, f), args);
	}
	
	inline function call(o:Dynamic, f:Dynamic, args:Array<Dynamic>):Dynamic {
		return Reflect.callMethod(o,f,args);
	}
}
enum Property {
	Prop;
}