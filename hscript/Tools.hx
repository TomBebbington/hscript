package hscript;
import hscript.Expr;
class Tools {
	public static function toString(e:Expr):String {return switch(e.expr) {
		case EWhile(cond, loop): "while("+toString(cond)+")"+toString(e);
		case EVars(vs): "var "+[for(v in vs) v.name + (v.expr == null ? "" : " = "+toString(v.expr))].join(", ");
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
				str += "case " + c.values.map(toString).join("|");
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
			var str:String = "if("+toString(cond)+")"+toString(thene);
			if(elsee != null) str += " else "+toString(elsee);
			str;
		case EIdent(s): s;
		case EFunction(args, fe, name, ret):
			"function "+(name == null ? "" : name)+"("+[for(a in args) a.name].join(", ")+")"+toString(fe);
		case EMacro(name, args):
			"#"+name+[for(a in args) ' $a'].join("");
		case EContinue: "continue";
		case EBreak: "break";
		case EBlock(bs):
			"{"+[for(b in bs) toString(b)+";"].join("")+"}";
		case EConst(CInt(i)): Std.string(i);
		case EConst(CString(s)): '"$s"';
		case EConst(CFloat(f)): Std.string(f);
		case EFor(v, ite, fe): "for("+v+" in "+toString(ite)+")"+toString(fe);
		case EField(fe, f): toString(fe) + "." + f;
		case EBinop(op, a, b): toString(a) + op + toString(b);
		case EArrayDecl(as): "["+[for(a in as) toString(a)].join(", ")+"]";
		case EArray(a, i): toString(a) + "["+i+"]";
		case ECall(func, args):
			toString(func) + "(" + args.map(toString).join(", ") + ")";
		case EClassDecl(cd):
			'class ${cd.name} {}';
		case ENew(cl, ps): 'new $cl('+ps.map(toString).join(", ")+")";
	};}
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