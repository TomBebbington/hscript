package hscript;

typedef Exec = #if jsh hscript.exec.JSInterp #else hscript.exec.Interp #end;