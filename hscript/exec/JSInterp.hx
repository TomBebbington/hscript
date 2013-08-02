package hscript.exec;
using StringTools;
import hscript.Expr;
class JSInterp {
	public var variables:Map<String, Dynamic>;
	var isModern = false;
	public function new() {
		variables = [
			"trace" => function(e:Dynamic) haxe.Log.trace(Std.string(e), cast { fileName:"hscript", lineNumber:0 })
		];
	}
	inline function genCall(f:Expr, args:Array<Expr>, val:Bool=false):String {
		return genValue(f) + "(" + args.map(genValue).join(", ") + ")";
	}
	function genValue(e:Expr):String return switch(e) {
		case ECall(f, as): genCall(f, as, true);
		case EContinue: throw "Unsupported";
		case EVars(_) | EFor(_) | EWhile(_) | EThrow(_): genExpr(e); null;
		case EBlock([v]): genValue(v);
		case EBlock(es) if(isModern):
			"{" + [for(i in 0...es.length) {
				var exp = es[i];
				var isLast = i == es.length-1;
				(isLast ? genValue(e) : genExpr(e)) + ";";
			}].join("") + "}";
		case EBlock(es):
			"(function(){" + [for(i in 0...es.length) {
				var exp = es[i];
				var isLast = i == es.length-1;
				(isLast ? "return "+genValue(exp) : genExpr(exp)) + ";";
			}].join("") + "})()";
		case EArrayDecl([EFor(v, it, ite)]):
			var newVal:Expr = EBlock([
				EVars([{name: "arr", type:CTPath(["Array"]), expr: EArrayDecl([])}]),
				EFor(v, it, ECall(EField(EIdent("arr"), "push"), [ite])),
				EIdent("arr")
			]);
			var asStr = genValue(newVal);
			asStr;
		case EIf(cond, a, b) if(b == null):
			genValue(ETernary(cond, a, EIdent("null")));
		case EIf(cond, a, b):
			genValue(EParent(ETernary(cond, a, b)));
		default: genExpr(e);
	}
	function genBlock(e:Expr, val:Bool=false):String return switch(e) {
		case EBlock(_) | EIf(_) if(val): genValue(e);
		case EBlock(_) | EIf(_): genExpr(e);
		case _ if(val): genValue(EBlock([e]));
		default: genExpr(EBlock([e]));
	}
	public function genExpr(e:Expr):String return switch(e) {
		case EConst(CString(s)): "\"" + s.replace("\"", "\\\"") + "\"";
		case EConst(CInt(i)): Std.string(i);
		case EConst(CFloat(v)): Std.string(v);
		case EArrayDecl(a) if(a.length > 0 && a[0].getName() == "EBinop" && a[0].getParameters()[0] == "=>"):
			genBlock(EBlock({
				var block:Array<Expr> = [];
				block.push(EVars([{name: "$map", expr: ENew("haxe.ds.BalancedTree", [])}]));
				for(i in a) {
					switch(i) {
						case EBinop("=>", k, v): block.push(ECall(EField(EIdent("$map"), "set"), [k, v]));
						default: throw Error.EUnexpected(i.getName(), "=>");
					}
				}
				block.push(EIdent("$map"));
				block;
			}), true);
		case EArrayDecl(a): "[" + [for(i in a) genValue(i)].join(", ") + "]";
		case EUntyped(v): genExpr(v);
		case EIdent(n): n;
		case EVars(vs): (isModern ? "let ":"var ") + vs.map(function(v) return '${v.name} = ${v.expr == null ? "null" : genValue(v.expr)}').join(", ");
		case EThrow(v): 'throw ${genValue(v)}';
		case EObject(fs): "{" + [for(f in fs) '${f.name}: ${genValue(f.e)}'].join(", ") + "}";
		case ENew(cl, ps): 'new $cl(${ps.map(genValue).join(", ")})';
		case EArray(a, i): genExpr(a) + "[" + i + "]";
		case EBinop("...", a, b): 'new IntIterator(${genValue(a)}, ${genValue(b)})';
		case EBinop(op, a, b): genValue(a) + op + genValue(b);
		case EFunction(args, fe, name, _):
			var gargs = [for(a in args) a.name].join(", ");
			var gname = name == null ? "" : name;
			'function $gname($gargs) ${genExpr(fe)}';
		case EWhile(cond, ex):
			'while(${genValue(cond)})${genExpr(ex)}';
		case EParent(v): '(${genValue(v)})';
		case ETernary(cond, a, b): '${genValue(cond)}?${genValue(a)}:${genValue(b)}';
		case EIf(cond, a, b) if(b == null): "if("+genValue(cond)+")"+genBlock(a);
		case EIf(cond, a, b): "if("+genValue(cond)+")"+genBlock(a)+" else "+genBlock(b);
		case EFor(v, EBinop("...", a, b), ite):
			'for(var $v=${genValue(a)};$v<${genValue(b)};$v++)${genExpr(ite)}';
		case EFor(v, it, ite):
			var itn = "$it";
			var itr:Expr = EIdent(itn);
			genExpr(EBlock([
				EVars([{name: itn, expr: it}, {name: v}]),
				EIf(EBinop("!=", EField(itr, "iterator"), EIdent("null")), EBinop("=", itr, ECall(EField(itr, "iterator"), [])),
					EIf(ECall(EField(EIdent("Std"), "is"), [itr, EIdent("Array")]), EBinop("=", itr, ECall(EField(EIdent("HxOverrides"), "iter"), [itr])))),
				EWhile(ECall(EField(itr, "hasNext"), []), EBlock([
					EBinop("=", EIdent(v), ECall(EField(EIdent("$it"), "next"), [])),
					ite
				]))
			]));
		case ETry(ex, v, t, ec):
			"try "+genExpr(ex) + " catch("+v+") "+genExpr(ec);
		case EMacro(_): throw "unsupported";
		case EUnop(op, pre, ex):
			var gen = genExpr(ex);
			pre ? '$op$gen' : '$gen$op';
		case EField(e, f):
			genValue(e) + "."+f;
		case EReturn(ex): "return "+genValue(ex);
		case EBreak: "break";
		case EContinue: "continue";
		case EBlock(es):
			"{" + [for(ex in es) genExpr(ex)+";"].join("") + "}";
		case ECall(o, as): genCall(o, as);
		default: throw 'Cannot compile $e into Javascript';
	};
	function translate(e:Expr, val:Bool = false):String {
		var str:String = val ? genValue(e) : genExpr(e);
		var varDef:String = "";
		untyped window.vars = variables;
		varDef = [for(v in variables.keys()) '$v = window.vars.get("$v")'].join(", ");
		if(varDef.length > 0)
			varDef = (isModern?"let":"var")+" "+varDef;
		str = varDef + ";" + str + ";";
		untyped console.log(str);
		return str;
	}
	public function expr(e:Expr):Dynamic {
		untyped __js__("eval")("window.result = "+translate(e, true));
		return untyped window.result;
	}
	public function execute(e:Expr):Void {
		var gen = translate(e);
		untyped __js__("eval")(gen);
	}
}