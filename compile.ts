import * as ts from "typescript";

let program = ts.createProgram();

const fooFile = program.getSourceFile("foo");
const barFile = program.getSourceFile("bar");

console.log({ fooFile, barFile });

// let emitResult = program.emit();

// let allDiagnostics = ts
//   .getPreEmitDiagnostics(program)
//   .concat(emitResult.diagnostics);

// allDiagnostics.forEach(diagnostic => {
//   if (diagnostic.file) {
//     let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
//       diagnostic.start!
//     );
//     let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
//     console.log(
//       `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
//     );
//   } else {
//     console.log(
//       `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
//     );
//   }
// });

// let exitCode = emitResult.emitSkipped ? 1 : 0;
// console.log(`Process exiting with code '${exitCode}'.`);
// process.exit(exitCode);
