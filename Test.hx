class Test extends hscript.Scripty {
	@:script("tests.hxs") static function run(args:Array<String>):Void;
	static function main():Void {
		run(Sys.args());
	}
}