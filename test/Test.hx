import js.Browser.*;
import js.html.*;
import hscript.*;
class Test {
	static inline function print(s:String) haxe.Log.trace(s, null);
	static function main():Void {
		var run:ButtonElement = null, source:TextAreaElement = null, output:DivElement = null;
		var txt:Dynamic = null;
		haxe.Timer.stamp;
		function clear()
			output.textContent = "";
		function runScript() {
			var content = txt.getValue();
			clear();
			content = '{$content}';
			#if !debug try { #end
				var e = new Parser().parseString(content);
				var v:Dynamic = new Exec().expr(e);
				if(v != null)
					print('Returned $v');
			#if !debug } catch(e:Dynamic) print('Error: $e'); #end
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