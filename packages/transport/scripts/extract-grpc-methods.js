const { readFile, readdir, writeFile, appendFile } = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');

(async () => {
  console.time('TotalTimeTaken');
  const protoFolderPath = resolve(__dirname, '../src/proto');

  const saveGrpcMethodsPath = resolve(__dirname, '../src/methods');

  if (!existsSync(saveGrpcMethodsPath)) {
    mkdirSync(saveGrpcMethodsPath);
  }

  let files = await readdir(protoFolderPath);

  files = files.filter((fileName) => fileName !== 'index.ts');

  for (let i = 0; i < files.length; i++) {
    console.log('Processing ', files[i], '...')
    const filePath = resolve(protoFolderPath, files[i]);
    const filesContents = await readFile(filePath);

    const stringData = filesContents.toString();

    // Funny RegExp goes brr
    const values = stringData
      .match(new RegExp(/const grpcMethods\: string\[\].+?\];/, 'gsi'))?.[0]
      // remove new lines
      .replaceAll(new RegExp(/\n| /, 'g'), '');

    const arrayValues = values?.match(new RegExp(/\.*['"].*[,'"]/, 'g'))?.[0];

    const grpcMethodsArray = arrayValues?.replaceAll("'", '').split(',');

    if (!grpcMethodsArray) continue;

    const grpcMethods = new (class GrpcMethods {})();

    for (const method of grpcMethodsArray) {
      if (method === '') continue;

      grpcMethods[method] = method;
    }

    const pbName = files[i].match(new RegExp(/[A-Z]\w+/, 'gi'))?.[0];

    if (!pbName) continue;

    const payload =
      `export const ${pbName}GrpcMethod = ${JSON.stringify(grpcMethods, null, 2)} as const;` +
      '\n\n' +
      `export type ${pbName}GrpcMethodEnum = keyof typeof ${pbName}GrpcMethod;\n`;

    await writeFile(resolve(saveGrpcMethodsPath, `${pbName}-grpc-method.ts`), payload);
  }

  const indexFilePayload = files.map((filePath) => {
    const pbName = filePath.match(new RegExp(/[A-Z]\w+/, 'gi'))?.[0];

    return `export * from "./${pbName}-grpc-method";`
  }).join('\n');

  await writeFile(
    resolve(saveGrpcMethodsPath, 'index.ts'),
    indexFilePayload,
  );

  const mainIndexPath = resolve(__dirname, '../src', 'index.ts');

  const mainIndexFileContents = await readFile(mainIndexPath);

  const mainIndexPayload = `export * from "./methods"`;

  const doesIndexExportMethods = mainIndexFileContents.includes(mainIndexPayload);

  if (!doesIndexExportMethods) {
    await appendFile(mainIndexPath, `\n${mainIndexPayload}\n`);
  }

  console.timeEnd('TotalTimeTaken');
})();
