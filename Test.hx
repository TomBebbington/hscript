class Test {
	static inline var TESTS_PATH = "tests.hxs";
	static macro function tests() {
		return macro "{"+$v{sys.io.File.getContent(TESTS_PATH)} + "}";
	}
	static function main() {
		var tests = tests();
		var p = new hscript.Parser();
		var program = p.parseString(tests);
		var bytes = hscript.Bytes.encode(program);
		program = hscript.Bytes.decode(bytes);
		var interp = new hscript.Exec();
		interp.variables.set("String", String);
		interp.execute(program);
	}
}