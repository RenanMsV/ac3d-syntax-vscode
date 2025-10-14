import * as path from 'path';
import * as cp from 'child_process';
import {
  MessageConnection,
  createMessageConnection,
  StreamMessageReader,
  StreamMessageWriter
} from 'vscode-jsonrpc/node';

import {
  Color,
  ColorInformation,
  CompletionItem,
  CompletionParams,
  CompletionTriggerKind,
  Diagnostic,
  DocumentColorParams,
  DocumentLink,
  DocumentLinkParams,
  FoldingRange,
  Hover,
  InitializeParams,
  InitializeResult,
  PublishDiagnosticsParams,
  SignatureHelp,
  SignatureHelpParams,
  SignatureHelpTriggerKind,
  TextDocumentPositionParams
} from 'vscode-languageserver-protocol';

import * as assert from 'assert';

suite('AC3D Language Server Test Suite', () => {
  let connection: MessageConnection | undefined;
  let child: cp.ChildProcess | undefined;

  const TEST_URI = 'file:///virtual/file.ac';
  const TEST_CONTENT = [
    'AC3Db',
    'MATERIAL "ac3dmat0" rgb 0.5 0.8 1  amb 0.2 1 0.2  emis 0.42 0 0  spec 0.2 0.59 0.81  shi 128  trans 0',
    'MATERIAL ',
    'OBJECT world',
    'texture "texture.png"',
    'kids 0'
  ].join('\n');

  suiteSetup((done) => {
    const serverPath = path.resolve(__dirname, '../../../out/lsp/server.js');

    child = cp.spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    child.stderr!.on('data', (data) => {
      console.error('Server STDERR:', data.toString());
    });

    child.on('exit', (code, signal) => {
      if (code === null && signal === "SIGTERM") {return;}
      console.error(`Child exited with code ${code} and signal ${signal}`);
    });

    connection = createMessageConnection(
      new StreamMessageReader(child.stdout!),
      new StreamMessageWriter(child.stdin!)
    );

    connection.listen();

    const initializeParams: InitializeParams = {
      processId: process.pid,
      rootUri: null,
      capabilities: {},
      workspaceFolders: null
    };

    connection
      .sendRequest<InitializeResult>('initialize', initializeParams)
      .then((_result) => {
        //console.log('Server initialized with capabilities:', _result.capabilities);
        done();
      })
      .catch((err) => {
        console.error('Initialization failed:', err);
        done(err);
      });
  });

  test('Can establish connection', async () => {
    assert.ok(connection, 'Connection not initialized');
  });

  test('Can open a file', async () => {
    // Notify server document is opened (so it stores content in memory)
    await connection!.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: TEST_URI,
        languageId: 'ac3d',
        version: 1,
        text: TEST_CONTENT
      }
    });
  });

  test('Can provide Hover', async () => {
    // Now send hover request on the first line, first character
    const params: TextDocumentPositionParams = {
      textDocument: { uri: TEST_URI },
      position: { line: 0, character: 0 }
    };

    const hoverResult = await connection!.sendRequest<Hover>('textDocument/hover', params);

    assert.ok(hoverResult !== null, 'Hover result should not be null');
    assert.ok('contents' in hoverResult, 'Hover result should have contents');
    assert.ok(
      typeof hoverResult.contents === 'object' &&
      'value' in hoverResult.contents &&
      hoverResult.contents.value.startsWith('**AC3Db** The first four characters'),
      'Hover result did not return the correct content'
    );
  });

  test('Can provide Folding', async () => {
    const foldingRanges = await connection!.sendRequest<FoldingRange[]>(
      'textDocument/foldingRange',
      { textDocument: { uri: TEST_URI } }
    );

    assert.ok(foldingRanges, 'Folding ranges should not be null');
    assert.ok(Array.isArray(foldingRanges), 'Folding ranges should be an array');
    assert.ok(foldingRanges.length > 0, 'Expected at least one folding range');

    const firstRange = foldingRanges[0];
    assert.ok('startLine' in firstRange && 'endLine' in firstRange, 'Folding range should have start and end lines');

    assert.strictEqual(firstRange.startLine, 1, 'Expected start of range to be 1');
    assert.strictEqual(firstRange.endLine, 2, 'Expected end of range to be 3');
  });

  test('Can provide Completion', async () => {
    const params: CompletionParams = {
      textDocument: { uri: TEST_URI },
      position: { line: 0, character: 0 },
      context: { triggerKind: CompletionTriggerKind.TriggerCharacter } // Invoked explicitly
    };

    const completionResult = await connection!.sendRequest<CompletionItem[] | null>('textDocument/completion', params);

    assert.ok(completionResult !== null, 'Completion result should not be null');
    assert.ok(Array.isArray(completionResult), 'Completion result should be an array');

    const firstItem = completionResult[0];
    assert.ok(firstItem.label, 'First completion item should have a label');
    assert.strictEqual(firstItem.label, 'AC3Db', 'First completion item label should be AC3Db');
  });

  test('Can provide Signature Help', async () => {
    const params: SignatureHelpParams = {
      textDocument: { uri: TEST_URI },
      position: { line: 2, character: 8 }, // Adjust to cursor inside a function call
      context: {
        isRetrigger: false,
        triggerKind: SignatureHelpTriggerKind.TriggerCharacter // Invoked manually (can be 2 if you're testing a trigger character)
      }
    };

    const signatureResult = await connection!.sendRequest<SignatureHelp | null>('textDocument/signatureHelp', params);

    assert.ok(signatureResult !== null, 'SignatureHelp result should not be null');
    assert.ok(signatureResult!.signatures.length > 0, 'Should return at least one signature');
    assert.ok(signatureResult!.signatures[0].label.length > 0, 'First signature should have a label');
    assert.ok(signatureResult!.signatures[0].label.startsWith('\nMATERIAL'));
  });

  test('Can provide Document Links', async () => {
    const params: DocumentLinkParams = {
      textDocument: { uri: TEST_URI }
    };

    const linkResult = await connection!.sendRequest<DocumentLink[] | null>('textDocument/documentLink', params);

    assert.ok(linkResult !== null, 'DocumentLink result should not be null');
    assert.ok(linkResult!.length > 0, 'Should return at least one document link');

    const firstLink = linkResult![0];
    assert.ok(firstLink.range, 'Document link should have a range');
    assert.ok(firstLink.target, 'Document link should have a target');
    assert.ok(typeof firstLink.target === 'string', 'Document link target must be a string');
    assert.ok(
      firstLink.target.toString().startsWith('file:///'),
      `Document link target is expected to start with 'file:///"', got "${firstLink.target.toString()}"`
    );
    assert.ok(
      firstLink.target.toString().endsWith('/virtual/texture.png'),
      `Document link target is expected to end with '/virtual/texture.png"', got "${firstLink.target.toString()}"`
    );
  });

  test('Can provide Document Colors', async () => {
    const params: DocumentColorParams = {
      textDocument: { uri: TEST_URI }
    };

    const colors = await connection!.sendRequest<ColorInformation[]>('textDocument/documentColor', params);

    assert.ok(Array.isArray(colors), 'Document colors result should be an array');
    assert.ok(colors.length > 0, 'Document colors should return at least one color');

    const firstColor = colors[0];
    assert.ok('color' in firstColor, 'First document color should have a color property');
    assert.ok('range' in firstColor, 'First document color should have a range property');

    assert.deepStrictEqual(firstColor.color, Color.create(0.5, 0.8, 1, 1), 'First document color is expected to be 0.5 0.8 1');
  });

  test('Can provide Diagnostics from Linter', async function () {
    this.timeout(5000);

    const DIAG_TEST_URI = 'file:///virtual/diag.ac';

    // Send didOpen notification to the server
    await connection!.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: DIAG_TEST_URI,
        languageId: 'ac3d',
        version: 1,
        text: 'AC3Db\nMATERIAL '
      }
    });

    // Wait for diagnostics notification from the server
    const diagnostics: Diagnostic[] = await new Promise((resolve, reject) => {
      connection!.onNotification('textDocument/publishDiagnostics', (params: PublishDiagnosticsParams) => {
        if (params.uri === DIAG_TEST_URI) {
          resolve(params.diagnostics);
        }
      });

      // Timeout if diagnostics don't arrive in time
      setTimeout(() => reject(new Error('Timed out waiting for diagnostics')), 4000);
    });

    assert.ok(diagnostics.length > 0, 'Diagnostics should contain at least one issue');
    const firstDiagnostic = diagnostics[0];
    assert.strictEqual(firstDiagnostic.severity, 1, 'First diagnostic severity should be Error');
    assert.strictEqual(firstDiagnostic.message, 'Expected at least one argument.', 'First diagnostic message should be "Expected at least one argument"');
    assert.ok(firstDiagnostic.source!.includes('ac3d-linter'), 'First diagnostic source should be "ac3d-linter"');
    
    await connection!.sendNotification('textDocument/didClose', {
      textDocument: { uri: DIAG_TEST_URI }
    });
  });

  test('Can close a file', async () => {
    await connection!.sendNotification('textDocument/didClose', {
      textDocument: { uri: TEST_URI }
    });
  });

  suiteTeardown(() => {
    if (connection) {connection.dispose();}
    if (child) {child.kill();}
  });
});