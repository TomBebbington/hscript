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
		return e.expr(new Parser().parseString(#if sys sys.io.File.getContent(file) #else haxe.Resource.getString(file) #end));
	}
	#if macro
	static function script(field:Field, file:String):Void {
		switch(field.kind) {
			case FFun(f):
				var arge:ExprOf<Map<String, Dynamic>> = if(f.args.length == 0)
					macro new Map<String, Dynamic>()
				else
					{expr: EArrayDecl([for(a in f.args) macro $v{a.name} => $i{a.name}]), pos: field.pos};
				f.expr = if(Context.defined("embed-script")) {
					var p = new Parser();
					var e = p.parseString(sys.io.File.getContent(file));
					new hscript.Macro(field.pos).convert(e);
				} else {
					if(!Context.defined("sys"))
						Context.addResource(file, sys.io.File.getBytes(file));
					macro hscript.Scripty.run($v{file}, $arge);
				}
			default:
		}
	}
	#end
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