;; Compiled using WebAssembly Tootkit (https://github.com/WebAssembly/wabt)
;; $ wat2wasm __fixtures__/add.wat -o __fixtures__/add.wasm

(module
 (export "add" (func $add))
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
)
