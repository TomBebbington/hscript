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
	function genValue(e:Expr):String return switch(e.expr) {
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
		case EArrayDecl([{expr: EFor(v, it, ite)}]):
			genValue(Tools.simplify(e));
		case EIf(cond, a, b) if(b == null):
			genValue(new Expr(ETernary(cond, a, new Expr(EIdent("null"), e.pmin, e.pmax)), e.pmin, e.pmax));
		case EIf(cond, a, b):
			genValue(new Expr(EParent(new Expr(ETernary(cond, a, b), e.pmin, e.pmax)), e.pmin, e.pmax));
		default: genExpr(e);
	}
	function genBlock(e:Expr, val:Bool=false):String return switch(e.expr) {
		case EBlock(_) | EIf(_) if(val): genValue(e);
		case EBlock(_) | EIf(_): genExpr(e);
		case _ if(val): genValue(new Expr(EBlock([e]), e.pmin, e.pmax));
		default: genExpr(new Expr(EBlock([e]), e.pmin, e.pmax));
	}
	public function genExpr(e:Expr):String return switch(e.expr) {
		case EConst(CString(s)): "\"" + s.replace("\"", "\\\"") + "\"";
		case EConst(CInt(i)): Std.string(i);
		case EConst(CFloat(v)): Std.string(v);
		case EArrayDecl(a) if(a.length > 0 && a[0].expr.getName() == "EBinop" && a[0].expr.getParameters()[0] == "=>"):
			genBlock(new Expr(EBlock({
				var block:Array<Expr> = [];
				block.push(new Expr(EVars([{name: "$map", expr: new Expr(ENew("haxe.ds.BalancedTree", []), e.pmin, e.pmax)}]), e.pmin, e.pmax));
				var mape:Expr = new Expr(EIdent("$map"), e.pmin, e.pmax);
				for(i in a) {
					switch(i.expr) {
						case EBinop("=>", k, v):
							block.push(new Expr(ECall(new Expr(EField(mape, "set"), e.pmin, e.pmax), [k, v]), e.pmin, e.pmax));
						default: throw Error.EUnexpected(i.expr.getName(), "=>");
					}
				}
				block.push(mape);
				block;
			}), e.pmin, e.pmax), true);
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
		case EFor(v, {expr: EBinop("...", a, b)}, ite):
			'for(var $v=${genValue(a)};$v<${genValue(b)};$v++)${genExpr(ite)}';
		case EFor(v, it, ite):
			'function(){var $$it = ${genValue(it)};while($$it.hasNext){var $v = $$it.next();${genExpr(ite)};}}';
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
		case EClassDecl(cd):
			var constructor:Expr = cd.constructor != null && cd.constructor.expr != null ? cd.constructor.expr : new Expr(EFunction([], new Expr(EBlock([]), e.pmin, e.pmax), null, null), e.pmin, e.pmax);
			switch(constructor.expr) {
				case EFunction(args, fe, _, ret):
					constructor.expr = EFunction(args, fe, cd.name, ret);
				default:
			}
			genExpr(constructor);
		case EUsing(v):
			'for(f in ${genValue(v)}) window[f] = ${genValue(v)}[f]';
		case ESwitch(_): genExpr(hscript.Tools.simplify(e));
	}
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