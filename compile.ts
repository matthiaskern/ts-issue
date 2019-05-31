import * as ts from "typescript";

const compilerOptions = {
  noEmitOnError: true,
  include: "packages/foo"
};

const filesA = [
  "packages/foo/index.ts",
  "packages/bar/index.ts",
  "packages/bar/baz.ts"
];

const filesB = [
  "packages/bar/index.ts",
  "packages/bar/baz.ts",
  "packages/foo/index.ts"
];

const prepareCompilation = (program: ts.Program) => (fileNames: string[]) => {
  for (const filePath of fileNames) {
    const sourceFile = program.getSourceFile(filePath);
    if (sourceFile !== undefined) {
      const emitResult = program.emit(sourceFile);
      console.log({ emitResult });

      console.log("\n\n");
      console.log(
        `Compilation ${
          emitResult.emitSkipped ? "failed" : "worked"
        } for ${filePath}!`
      );

      if (emitResult.emitSkipped) {
        console.log("\n\n");
        let sourceFiles = {
          foo: program.getSourceFile("packages/foo/index.ts"),
          bar: program.getSourceFile("packages/bar/index.ts"),
          baz: program.getSourceFile("packages/bar/baz.ts")
        };
        console.log("\n\n");
        console.log({ sourceFiles, program });
        console.log("\n\n");
        throw new Error("Found issue");
      }
    }
  }

  let sourceFiles = {
    foo: program.getSourceFile("packages/foo/index.ts"),
    bar: program.getSourceFile("packages/bar/index.ts"),
    baz: program.getSourceFile("packages/bar/baz.ts")
  };

  console.log("\n\n");
  console.log({ sourceFiles, program });
  console.log("\n\n");
};

// variant 1
let program = ts.createProgram(["/packages/bar"], compilerOptions);

let compile = prepareCompilation(program);

compile(filesA);
compile(filesB);

console.log("variant 1 worked");

// variant 2
program = ts.createProgram(["./packages/foo"], compilerOptions);

compile = prepareCompilation(program);

compile(filesA);
compile(filesB);

console.log("variant 2 worked");
