import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";

function createInstance(options: ts.CompilerOptions) {
  const files: ts.MapLike<{ version: number }> = {};
  let projectVersion = 0;

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getProjectVersion: () => {
      console.log(`getProjectVersion`);
      return `${projectVersion}`;
    },
    getScriptFileNames: () => {
      return Object.keys(files);
    },
    getScriptVersion: fileName => {
      console.log(`getScriptVersion`, fileName);
      ensureSourceFile(fileName);
      return files[fileName] && files[fileName].version.toString();
    },
    getScriptSnapshot: fileName => {
      console.log(`getScriptSnapshot`, fileName);
      ensureSourceFile(fileName);
      if (!fs.existsSync(fileName)) {
        return undefined;
      }
      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => {
      console.log(`getCurrentDirectory`);

      return process.cwd();
    },
    getCompilationSettings: () => {
      console.log(`getCompilationSettings`);
      return options;
    },
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
  };

  // Create the language service files
  const services = ts.createLanguageService(
    servicesHost,
    ts.createDocumentRegistry()
  );

  //
  // Add the file to the project or increment its version
  //
  function ensureSourceFile(fileName: string) {
    let file = files[fileName];
    if (file) {
      file.version++;
      projectVersion++;
    } else {
      file = { version: 0 };
      files[fileName] = file;
    }
  }

  //
  // Emit a file
  //
  function emitFile(fileName: string) {
    ensureSourceFile(fileName);

    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
    }

    output.outputFiles.forEach(o => {
      console.log({
        name: o.name,
        text: o.text
      });
    });
  }

  return emitFile;
}

function works() {
  const emitFile = createInstance({
    module: ts.ModuleKind.CommonJS,
    skipLibCheck: true,
    suppressOutputPathCheck: true // This is why: https://github.com/Microsoft/TypeScript/issues/7363
  });
  emitFile(path.resolve(__dirname, "packages/foo/index.ts"));
  emitFile(path.resolve(__dirname, "packages/bar/index.ts"));
}

works();
