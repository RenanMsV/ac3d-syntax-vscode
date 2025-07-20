import {
  createConnection,
  TextDocuments,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  Hover,
  ProposedFeatures,
  InitializeParams,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { hoverInfo } from './hoverInfo';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents = new TextDocuments<TextDocument>(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
  return {
    capabilities: {
      hoverProvider: true,
      textDocumentSync: TextDocumentSyncKind.Incremental,
    }
  };
});

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {return null;}

  const word = getWordAtPosition(document, params.position);
  if (!word) {return null;}

  const message = hoverInfo[word];
  if (message) {
    return {
      contents: {
        kind: 'markdown',
        value: `**${word}** ${message}`
      }
    };
  }

  return null;
});

function getWordAtPosition(doc: TextDocument, pos: { line: number; character: number }): string | null {
  const line = doc.getText({
    start: { line: pos.line, character: 0 },
    end: { line: pos.line + 1, character: 0 }
  });

  const regex = /\b\w+\b/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line))) {
    const start = match.index;
    const end = start + match[0].length;
    if (pos.character >= start && pos.character <= end) {
      return match[0];
    }
  }
  return null;
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
