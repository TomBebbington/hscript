package hscript;
import hscript.Expr;
class Tools {
	static function rep(s:String, n:Int) {
		var ns = new StringBuf();
		while(n-- > 0)
			ns.add(s);
		return ns.toString();
	}
	static function typeToString(t:CType):String {
		return switch(t) {
			case CTParent(t): "(" + typeToString(t) + ")";
			case CTPath(path, params): path.join(".") + (params == null || params.length== 0? "" : "<" + params.map(typeToString) + ">");
			case CTAnon(fields): "{" + [for(f in fields) f.name + ":" + typeToString(f.t)].join(", ") + "}";
			case CTFun(args, ret):
				var cs = "";
				for(a in args)
					cs += typeToString(a) + " -> ";
				if(cs.length == 0)
					cs += "Void ->";
				cs + " -> "+typeToString(ret);
		};
	}
	public static function toString(e:Expr, t:Int = 0):String {return switch(e.expr) {
		case EWhile(cond, loop): "while("+toString(cond)+")"+toString(loop, t);
		case EVars(vs): "var "+[for(v in vs) v.name + (v.expr == null ? "" : " = "+toString(v.expr)) + (v.type == null ? "":":"+typeToString(v.type))].join(", ");
		case EUsing(v): "using "+toString(v);
		case EUntyped(v): "untyped "+toString(v);
		case EUnop(op, true, ve): op + toString(ve);
		case EUnop(op, _, ve): toString(ve) + op;
		case ETry(exp, v, ty, catche):
			"try "+toString(exp)+" catch("+v+")"+toString(catche);
		case EThrow(v): "throw "+toString(v);
		case ETernary(cond, a, b): toString(cond) + "?" + toString(a) + ":" + toString(b);
		case ESwitch(v, cases, def):
			var str = "switch("+toString(v)+") {";
			for(c in cases) {
				str += "case " + [for(v in c.values) toString(v, t + 2)].join("|");
				if(c.guard != null)
					str += " if("+toString(c.guard)+")";
				str += ":";
				if(c.expr != null)
					str += toString(c.expr)+";";
			}
			if(def != null)
				str += "default:"+toString(def)+";";
			str += "}";
		case EReturn(v): "return "+toString(v);
		case EParent(v): "("+toString(v)+")";
		case EObject(fs):
			var fmapped = [for(f in fs) '${f.name}: ${f.e==null?"null":toString(f.e)}'];
			"{"+fmapped.join(", ")+"}";
		case EIf(cond, thene, elsee):
			var str:String = "if("+toString(cond, t)+")"+toString(thene, t);
			if(elsee != null) str += " else "+toString(elsee, t);
			str;
		case EIdent(s): s;
		case EFunction(args, fe, name, ret):
			"function "+(name == null ? "" : name)+"("+[for(a in args) a.name].join(", ")+")"+toString(fe);
		case EMacro(name, args):
			"#"+name+[for(a in args) ' $a'].join("");
		case EContinue: "continue";
		case EBreak: "break";
		case EBlock(bs):
			"{"+[for(b in bs) "\n"+rep("\t", t)+toString(b, t+1)+";"].join("")+"\n"+rep("\t", t-1)+"}";
		case EConst(CInt(i)): Std.string(i);
		case EConst(CString(s)): '"$s"';
		case EConst(CFloat(f)): Std.string(f);
		case EFor(v, ite, fe): "for("+v+" in "+toString(ite)+")"+toString(fe);
		case EField(fe, f): toString(fe) + "." + f;
		case EBinop(op, a, b): toString(a) + op + toString(b);
		case EArrayDecl(as): "["+[for(a in as) toString(a)].join(", ")+"]";
		case EArray(a, i): toString(a) + "["+i+"]";
		case ECall(func, args):
			toString(func) + "(" + [for(a in args) toString(a, t)].join(", ") + ")";
		case EClassDecl(cd):
			var buf = new StringBuf();
			buf.add('class ${cd.name} {\n');
			t++;
			for(fname in cd.fields.keys()) {
				buf.add(rep("\t", t));
				var field = cd.fields[fname];
				if(field.access.has(Public))
					buf.add("public ");
				if(field.access.has(Private))
					buf.add("private ");
				if(field.access.has(Static))
					buf.add("static ");
				if(field.access.has(Function))
					buf.add("function ")
				else
					buf.add("var ");
				buf.add(fname);
				if(field.access.has(Function)) {
					switch(field.expr.expr) {
						case EFunction(args, exp, name, ret):
							buf.add("(");
							buf.add([for(a in args) a.name].join(", "));
							buf.add(")");
							buf.add(toString(exp, t+1));
						default:
					}
				} else if(field.type != null)
					buf.add(":" + typeToString(field.type));
				if(!field.access.has(Function))
					buf.add(";");
				buf.add("\n");
			}
			buf.add("}");
			t--;
			buf.toString();
		case EEnumDecl(e):
			'enum ${e.name} {'+
			[for(cname in e.constructors.keys()) {
				var const:EnumConst = e.constructors[cname];
				cname + (const.length == 0 ? "" : "(" + [for(c in const) c.name] + ")");
			}].join("")+
			"\n}";
		case ENew(cl, ps): 'new $cl('+[for(p in ps) toString(p, t)].join(", ")+")";
	};}
	public static function map(e:Expr, f:Expr -> Expr):Expr {
		e = f(e);
		return new Expr(switch(e.expr) {
			case EWhile(c, l): EWhile(map(c, f), map(l, f));
			case EVars(vs): EVars([for(v in vs) {
				var nv = Reflect.copy(v);
				if(nv.expr != null)
					nv.expr = map(nv.expr, f);
				nv;
			}]);
			case EUsing(v): EUsing(map(v, f));
			case EUntyped(v): EUntyped(map(v, f));
			case EThrow(v): EThrow(map(v, f));
			case EReturn(v) if(v != null): EReturn(map(v, f));
			case EBreak: EBreak;
			case EUnop(op, pre, ve): EUnop(op, pre, map(ve, f));
			case ETry(te, v, vt, ve): ETry(map(te, f), v, vt, map(ve, f));
			case ETernary(cond, a, b): ETernary(map(cond, f), map(a, f), map(b, f));
			case EParent(v): EParent(map(v, f));
			case EIdent(_) | EContinue | EConst(_) | EReturn(_) | EMacro(_) | EEnumDecl(_): e.expr;
			case EBlock(es): EBlock([for(e in es) map(e, f)]);
			case EArrayDecl(es): EArrayDecl([for(e in es) map(e, f)]);
			case EField(ex, ff): EField(map(ex, f), ff);
			case EBinop(op, a, b): EBinop(op, map(a, f), map(b, f));
			case EArray(ex, i): EArray(map(ex, f), i);
			case ECall(func, args): ECall(map(func, f), [for(a in args) map(a, f)]);
			case EFor(v, ite, fore): EFor(v, map(ite, f), map(fore, f));
			case EFunction(args, ex, name, ret): EFunction(args, map(ex, f), name, ret);
			case ENew(cl, args): ENew(cl, [for(a in args) map(a, f)]);
			case EIf(cond, a, b): EIf(map(cond, f), map(a, f), map(b, f));
			case ESwitch(ve, cases, defe): ESwitch(map(ve, f), [for(c in cases) {values: c.values, guard: c.guard, expr: c.expr==null?null:map(c.expr, f)}], defe == null ? null : map(defe, f));
			case EObject(fs): EObject([for(fl in fs) {name: fl.name, e: fl.e == null ? null : map(fl.e, f)}]);
			case EClassDecl(cd):
				cd = Reflect.copy(cd);
				for(fl in cd.fields)
					fl.expr = fl.expr == null ? null : map(fl.expr, f);
				EClassDecl(cd);
		}, e.pmin, e.pmax);
	}
	public static function toBlock(e:Expr):Expr {
		return switch(e.expr) {
			case EBlock(_): e;
			default: new Expr(EBlock([e]), e.pmin, e.pmax);
		};
	}
	public static function simplify(e:Expr, isVal:Bool = false):Expr {
		return switch(e.expr) {
			case EArrayDecl([{expr: EFor(v, it, ite) }]):
				var ename = "$arr";
				var eexpr = new Expr(EIdent(ename), e.pmin, e.pmax);
				new Expr(EBlock([
					new Expr(EVars([{name: ename, type:CTPath(["Array"]), expr: new Expr(EArrayDecl([]), e.pmin, e.pmax)}]), e.pmin, e.pmax),
					new Expr(EFor(v, it, new Expr(ECall(new Expr(EField(eexpr, "push"), e.pmin, e.pmax), [ite]), e.pmin, e.pmax)), e.pmin, e.pmax),
					eexpr
				]), e.pmin, e.pmax);
			case ESwitch(val, cases, def):
				var vname = "all";
				var vexpr = new Expr(EIdent(vname), e.pmin, e.pmax);
				var block = [];
				block.push(new Expr(EVars([{name: vname, expr: val}]), e.pmin, e.pmax));
				var lastIf:Expr = null;
				for(c in cases) {
					var cond = null;
					for(v in c.values) {
						switch(v.expr) {
							case EIdent("_" | "all"):
							default:
								var isEq:Expr = new Expr(EBinop("==", vexpr, v), e.pmin, e.pmax);
								cond = if(cond == null) isEq
								else new Expr(EBinop("||", cond, isEq), e.pmin, e.pmax);
						}
					}
					if(c.guard != null)
						cond = if(cond == null) c.guard
						else cond = new Expr(EBinop("&&", new Expr(EParent(cond), e.pmin, e.pmax), new Expr(EParent(c.guard), e.pmin, e.pmax)), e.pmin, e.pmax);
					var ife = if(cond == null) c.expr
					else new Expr(EIf(cond, c.expr, null), e.pmin, e.pmax);
					lastIf = if(lastIf == null) ife else switch(lastIf.expr) {
						case EIf(cond, ifee, elsee) if(elsee == null): lastIf.expr = EIf(cond, ifee, ife); lastIf;
						default: 
					};
					if(ife.expr.getName() == "EIf")
						lastIf = ife;
				}
				if(def != null && lastIf == null && isVal)
					block.push(new Expr(EBinop("=", vexpr, def), e.pmin, e.pmax));
				else if(def != null && lastIf == null)
					block.push(def);
				else if(lastIf == null) {}
				else lastIf.expr = switch(lastIf.expr) {
					case EIf(cond, ife, elsee) if(elsee == null): EIf(cond, ife, def);
					default: lastIf.expr;
				};
				if(lastIf != null) block.push(lastIf);
				if(isVal) block.push(new Expr(EReturn(vexpr), e.pmin, e.pmax));
				new Expr(EBlock(block), e.pmin, e.pmax);
			default: e;
		};
	}
}