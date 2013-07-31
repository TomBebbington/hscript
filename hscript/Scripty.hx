package hscript;
import haxe.macro.*;
import haxe.macro.Expr;
import haxe.macro.Type;
import sys.net.*;
@:autoBuild(hscript.Scripty.build()) class Scripty {
	static inline var DELAY = 10;
	public static function run<T>(file:String, args:Map<String, Dynamic>):T {
		var e = new Exec();
		for(a in args.keys())
			e.variables.set(a, args.get(a));
		return e.expr(new Parser().parseString(sys.io.File.getContent(file)));
	}
	static function script(field:Field, file:String):Void {
		switch(field.kind) {
			case FFun(f):
				var arge:ExprOf<Map<String, Dynamic>> = f.args.length == 0 ? macro new Map<String, Dynamic>() : {expr: EArrayDecl([for(a in f.args) macro $v{a.name} => $i{a.name}]), pos: field.pos};
				f.expr = macro hscript.Scripty.run($v{file}, $arge);
			default:
		}
	}
	public static macro function build():Array<Field> {
		var fields = Context.getBuildFields();
		for(f in fields)
			for(m in f.meta)
				switch(m) {
					case {name: ":script", params: [{expr: EConst(CString(file))}]}:
						script(f, file);
					default:
				}
		return fields;
	}
}