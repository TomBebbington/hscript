package hscript;

#if js
typedef Exec = JsJit;
#else
typedef Exec = Interp;
#end