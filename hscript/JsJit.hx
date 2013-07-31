package hscript;

class JsJit {
	public var variables:Map<String, Dynamic>;
	public function new() {
		variables = new Map<String, Dynamic>();
	}
	public function compile(e:Expr, av:Bool=false):String {
		return (if(!av) {
			"var " + [for(k in variables.keys()) '$k = ${compile(variables.get(k), true)}'].join(", ")+";";
		} else "") + switch(e) {
			case EConst(CInt(v)): Std.string(v);
			case EConst(CFloat(v)): Std.string(v);
			case EConst(CString(v)): '"${StringTools.replace(v, "\\"", "\\\"")}"';
			case EIdent(v): v;
			case EVar(n, t, e): 'var $n = ${e==null?"null":compile(e, true)}';
			case EParent(pe): '(${compile(pe, true)})';
			case EBlock(e): [for(ex in e) compile(ex, true)].join(";")+";";
			case EField(e, f): '${compile(e, true)}.$f';
			case EBinop(op, e1, e2): '${compile(e1, true)} $op ${compile(e2, true)}';
			case EUnop(op, true, ex): '${op}${compile(ex, true)}';
			case EUnop(op, false, ex): '${compile(ex, true)}${op}';
			case ECall(ex, ps): compile(ex, true) + "(" + [for(p in ps) compile(p, true)].join(", ") + ")";
			case EWhile(c, le): 'while(${compile(c, true)}){${compile(le, true)}}';
			case EArray(o, i): '${compile(o, true)}[${compile(i, true)}]';
			case EArrayDecl([EFor(v, it, e)]): 'while(${compile(it, true)}.hasNext()){var $v = ${compile(it, true)}.next(); ${compile(e, true)}}';
			case EArrayDecl(vs): "[" + [for(v in vs) compile(v, true)].join(", ")+"]";
			case EReturn(v): 'return $compile(v, true)';
			case ETry(e, v, t, ecatch): 'try{${compile(e, true)}} catch($v){${compile(ecatch, true)}}';
			case EObject(fl): "{" + [for(f in fl) '${f.name}: ${compile(f.e, true)}'].join(", ")+"}";
			case EIf(cond, e1, e2): 'if(${compile(${cond}, true)}){${compile(e1, true)} else {${compile(e2, true)}}';
			case ETernary(cond, e1, e2): '${compile(${cond}, true)}?${compile(e1, true)}:${compile(e2, true)}';
			case EThrow(v): 'throw ${compile(e, true)}';
			case EContinue: "continue";
			case EBreak: "break";
			case EFunction(args, e, name, ret): "function"+(name == null ? "" : ' $name')+"("+[for(a in args) a.name].join(", ")+")"+'{${compile(e, true)}}';
			case ESwitch(e, cases, def):
				'function(v){return null;}(${compile(e, true)})';
			case ENew(cl, ps): Type.createInstance(Type.resolveClass(cl), [for(p in ps) compile(p, true)]);
			case EFor(v, it, e): '';
			case EUntyped(e): compile(e, true);
		}
	}
	public function execute(e:Expr):Dynamic {
		var compiled = compile(e);
		trace('Compiled $e to $compiled');
		return js.Lib.eval(compiled);
	}
}