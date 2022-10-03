/**
 * @file Fixtures - aggregate-error-ponyfill
 * @module fixtures/aggregate-error-ponyfill
 * @see https://github.com/flex-development/aggregate-error-ponyfill/tree/2.0.1
 */

const code =
  'var y=Object.create;var a=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,M=Object.prototype.hasOwnProperty;var b=(r,t,e)=>t in r?a(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var E=(r,t)=>{for(var e in t)a(r,e,{get:t[e],enumerable:!0})},n=(r,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of u(t))!M.call(r,s)&&s!==e&&a(r,s,{get:()=>t[s],enumerable:!(i=T(t,s))||i.enumerable});return r};var o=(r,t,e)=>(e=r!=null?y(A(r)):{},n(t||!r||!r.__esModule?a(e,"default",{value:r,enumerable:!0}):e,r)),x=r=>n(a({},"__esModule",{value:!0}),r);var m=(r,t,e)=>(b(r,typeof t!="symbol"?t+"":t,e),e);var v={};E(v,{default:()=>O});module.exports=x(v);var d=o(require("es-abstract/2021/AdvanceStringIndex.js")),h=o(require("es-abstract/2021/CreateDataPropertyOrThrow.js")),f=o(require("es-abstract/2021/GetMethod.js")),I=o(require("es-abstract/2021/IsArray.js")),p=o(require("es-abstract/2021/IterableToList.js")),c=o(require("es-abstract/2021/Type.js")),l=o(require("es-abstract/helpers/getIteratorMethod.js"));class G extends Error{constructor(e,i){super(i);m(this,"errors");m(this,"name","AggregateError");const g=(0,l.default)({AdvanceStringIndex:d.default,GetMethod:f.default,IsArray:I.default,Type:c.default},e);this.errors=(0,p.default)(e,g),(0,h.default)(this,"errors",(0,p.default)(this.errors,g))}}var O=G;'

module.exports = exports = code
