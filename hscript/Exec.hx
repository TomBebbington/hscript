package hscript;

typedef Exec = #if js hscript.exec.JSInterp #else hscript.exec.Interp #end;