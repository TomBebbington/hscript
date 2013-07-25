import js.Browser.*;
class Test {

	static function test(x,v:Dynamic,?vars : Dynamic) {
		var p = new hscript.Parser();
		var program = p.parseString(x);
		var bytes = hscript.Bytes.encode(program);
		program = hscript.Bytes.decode(bytes);
		var interp = #if js new hscript.JsJit() #else new hscript.Interp() #end;
		trace(interp);
		if( vars != null )
			for( v in Reflect.fields(vars) )
				interp.variables.set(v,Reflect.field(vars,v));
		var ret : Dynamic = interp.execute(program);
		if( v != ret ) throw ret+" returned while "+v+" expected";
		else trace('$x returned correct value: $ret');
	}

	static function main() {
		var interp = new hscript.JsJit();
		interp.variables.set("Math",Math);
		interp.variables.set("awe", {val: 5});
		trace(interp.execute(new hscript.Parser().parseString("")));
	}
}