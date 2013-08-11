/*
 * Copyright (c) 2008, Nicolas Cannasse
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE HAXE PROJECT CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE HAXE PROJECT CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */
package hscript;

enum Const {
	CInt( v : Int );
	CFloat( f : Float );
	CString( s : String );
}
typedef Case = {
	var values:Array<Expr>;
	@:optional var guard:Expr;
	@:optional var expr:Expr;
}
enum Access {
	Public;
	Private;
	Static;
	Function;
	HasGetter;
	HasSetter;
}
typedef Field = {
	@:optional var type:CType;
	@:optional var expr: Expr;
	var access:haxe.EnumFlags<Access>;
}
enum ClassFlag {
	IsInterface;
}
typedef ClassDecl = {
	var flags:haxe.EnumFlags<ClassFlag>;
	var name:String;
	var pack:Array<String>;
	var fields:Map<String, Field>;
	@:optional var constructor:Field;
}
typedef EnumConst = Array<{name: String, ?type: CType}>;
typedef EnumDecl = {
	var name:String;
	var constructors:Map<String, EnumConst>;
}
enum ExprDef {
	EConst( c : Const );
	EIdent( v : String );
	EVars( vs: Array<Var>);
	EParent( e : Expr );
	EBlock( e : Array<Expr> );
	EField( e : Expr, f : String );
	EBinop( op : String, e1 : Expr, e2 : Expr );
	EUnop( op : String, prefix : Bool, e : Expr );
	ECall( e : Expr, params : Array<Expr> );
	EIf( cond : Expr, e1 : Expr, ?e2 : Expr );
	EWhile( cond : Expr, e : Expr );
	EFor( v : String, it : Expr, e : Expr );
	EBreak;
	EContinue;
	EFunction( args : Array<{ name : String, t : Null<CType> }>, e : Expr, ?name : String, ?ret : CType );
	EReturn( ?e : Expr );
	EArray( e : Expr, index : Expr );
	EArrayDecl( e : Array<Expr> );
	ENew( cl : String, params : Array<Expr> );
	EThrow( e : Expr );
	ETry( e : Expr, v : String, t : Null<CType>, ecatch : Expr );
	EObject( fl : Array<{ name : String, e : Expr }> );
	ETernary( cond : ExprOf<Bool>, e1 : Expr, e2 : Expr );
	ESwitch(e : Expr,cases : Array<Case>,edef : Null<Null<Expr>>);
	EUntyped( e:Expr);
	EClassDecl(c:ClassDecl);
	EUsing(e:Expr);
	EEnumDecl(e:EnumDecl);
}
enum CType {
	CTPath( path : Array<String>, ?params : Array<CType> );
	CTFun( args : Array<CType>, ret : CType );
	CTAnon( fields : Array<{ name : String, t : CType }> );
	CTParent( t : CType );
}
typedef Var = {
	var name: String;
	@:optional var expr:Expr;
	@:optional var type:CType;
}
enum ErrorDef {
	EInvalidChar( c : Int );
	EUnexpected( s : String , ?could:String);
	EUnterminatedString;
	EUnterminatedComment;
	EUnknownVariable( v : String );
	EInvalidIterator( v : String );
	EInvalidOp( op : String );
	EInvalidAccess( f : String );
	EInvalidFunction;
	EInvalidParameters( f: String, givenLen:Int, actualLen:Int);
	ENoConstructor(c:String);
}

class Error {
	public var error:ErrorDef;
	public var pmin(default, null):Int;
	public var pmax(default, null):Int;
	public function new(e:ErrorDef, pmin:Int, pmax:Int) {
		this.error = e;
		this.pmin = pmin;
		this.pmax = pmax;
	}
	public static inline function with(ex:ErrorDef, e:Expr):Error {
		return new Error(ex, e.pmin, e.pmax);
	}
}

class Expr {
	public var expr:ExprDef;
	public var pmin(default, null): Int;
	public var pmax(default, null): Int;
	public function new(v:ExprDef, pmin, pmax) {
		this.expr = v;
		this.pmin = pmin;
		this.pmax = pmax;
	}
}
typedef ExprOf<T> = Expr;