import js.Browser.*;
import js.html.*;
import hscript.*;
import hscript.Expr;
class Test {
	static inline function print(s:String) haxe.Log.trace(s, null);
	static function main():Void {
		trace([].iterator());
		var run:ButtonElement = null, source:TextAreaElement = null, output:DivElement = null;
		var txt:Dynamic = null;
		haxe.Timer.stamp;
		function clear()
			output.textContent = "";
		function runScript() {
			var content = txt.getValue();
			clear();
			content = '{$content}';
			#if showError try { #end
				var e = new Parser().parseString(content);
				e = Bytes.decode(Bytes.encode(e));
				new Exec().execute(e);
			#if showError } catch(err:Error) {
				var str = switch(err) {
					case EUnterminatedString: "String is not terminated. Did you forget to add a closing quote?";
					case EUnterminatedComment: "Comment not terminated.";
					case EUnknownVariable(v): 'Unknown variable "$v"';
					case EUnexpected("}"): 'Semicolon expected';
					case EUnexpected(s): 'Unexpected $s';
					case EInvalidOp(op): 'Invalid operation $op';
					case EInvalidIterator(v): 'Invalid iterator $v';
					case EInvalidChar(c): 'Invalid char "${String.fromCharCode(c)}"';
					case EInvalidAccess(f): 'Cannot access $f';
					case ENoConstructor(cl): '$cl does not have a constructor';
				};
				print('Error: $str');
			} #end
		}
		//new haxe.Timer(30).run = runScript;
		window.onload = function(_) {
			run = cast document.getElementById("run");
			source = cast document.getElementById("editor");
			output = cast document.getElementById("output");
			txt = untyped __js__("CodeMirror.fromTextArea")(source, {
				value: "trace(\"Hello, world!\");",
				tabindex: 1,
				autofocus: true,
				indentWithTabs: true,
				lineNumbers: true
			});
			haxe.Log.trace = function(o:Dynamic, ?p:haxe.PosInfos) {
				var s = Std.string(o);
				if(p != null)
					s = '${p.fileName}:${p.lineNumber}: $s';
				output.appendChild(document.createBRElement());
				var sp = document.createSpanElement();
				sp.textContent = s;
				output.appendChild(sp);
			}
			txt.on("change", function(_, _) runScript());
		}
	}
}