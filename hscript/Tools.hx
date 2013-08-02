package hscript;
import hscript.Expr;
class Tools {
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