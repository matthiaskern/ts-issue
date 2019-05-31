import * as ts from "typescript";

let program = ts.createProgram(
  ["packages/foo/index.ts", "packages/bar/index.ts", "packages/bar/baz.ts"],
  {
    noEmitOnError: true,
    include: "packages/foo"
  }
);

let emitResult = program.emit();

let allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

console.log({ emitResult, allDiagnostics, program });
