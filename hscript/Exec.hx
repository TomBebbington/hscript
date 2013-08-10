package hscript;

typedef Exec = #if xml hscript.exec.JSInterp #else hscript.exec.Interp #end;