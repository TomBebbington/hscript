#if js
import js.Browser.*;
import js.html.*;
#end
import hscript.*;
import hscript.Expr;
class Test {
	static inline function print(s:String) haxe.Log.trace(s, null);
	static function main():Void {
		#if js
			var run:ButtonElement = null, source:TextAreaElement = null, canvas:CanvasElement = null, ctx:CanvasRenderingContext2D = null;
			var txt:Dynamic = null;
			function clear() {
				ctx.fillStyle = "black";
				ctx.rect(0, 0, canvas.width, canvas.height);
				ctx.fill();
			}
			function runScript() {
				var content = txt.getValue();
				clear();
				content = '{$content}';
				try {
					var e = new Parser().parseString(content);
					//e = Bytes.decode(Bytes.encode(e));
					new Exec().execute(e);
				} catch(err:Error) {
					var str = switch(err.error) {
						case EUnterminatedString: "String is not terminated. Did you forget to add a closing quote?";
						case EUnterminatedComment: "Comment not terminated.";
						case EUnknownVariable(v): 'Unknown variable "$v"';
						case EUnexpected("}", _): 'Semicolon expected';
						case EUnexpected(s, _): 'Unexpected $s';
						case EInvalidParameters(name, s, g): 'Expected $s parameters, got $g in $name';
						case EInvalidFunction: 'Invalid function';
						case EInvalidOp(op): 'Invalid operation $op';
						case EInvalidIterator(v): 'Invalid iterator $v';
						case EInvalidChar(c): 'Invalid char "${String.fromCharCode(c)}"';
						case EInvalidAccess(f): 'Cannot access $f';
						case ENoConstructor(cl): '$cl does not have a constructor';
					};
					print('Error: $str');
				} catch(e:Dynamic) {
					print('Unexpected error: $e');
				}
			}
			window.onload = function(_) {
				run = cast document.getElementById("run");
				source = cast document.getElementById("editor");
				canvas = cast document.getElementById("canvas");
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				ctx = canvas.getContext2d();
				txt = untyped __js__("CodeMirror.fromTextArea")(source, {
					value: "trace(\"Hello, world!\");",
					tabindex: 1,
					autofocus: true,
					indentWithTabs: true,
					lineNumbers: true
				});
				txt.on("change", function(_, _) runScript());
			}
		#else
			try {
				var p = new Parser().parseString("{"+sys.io.File.getContent("test.hxs")+"}");
				new hscript.Exec().execute(p);
			} catch(e:Error) {
				Sys.println('${e.error} at ${e.pmin}-${e.pmax}');
			}
		#end
	}
}