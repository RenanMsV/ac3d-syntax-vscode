import {
  DocumentLink,
  DocumentLinkParams,
  DocumentLinkRequest,
  Range,
  Position,
  Connection,
  TextDocuments,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import * as path from 'path';

/**
 * Registers a document link provider with the language server.
 * It detects texture paths like `texture "image.png"` and makes them clickable links.
 */
export function registerDocumentLinkProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  connection.onRequest(DocumentLinkRequest.type, (params: DocumentLinkParams) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {return [];}

    const links: DocumentLink[] = [];
    const lines = document.getText().split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const textLine = lines[lineNumber].trim();

      // Quick check: skip lines that don't start exactly with "texture "
      if (!textLine.startsWith('texture ')) {continue;}

      // Expected format: texture "filename.png"
      const match = textLine.match(/^texture\s+"([^"]+\.(png|jpg|bmp|tga|dds|tif|rgb|gif|ppm))"$/i);
      if (!match) {continue;}

      const filePath = match[1];
      const startChar = textLine.indexOf('"') + 1;
      const endChar = startChar + filePath.length;

      const range: Range = Range.create(
        Position.create(lineNumber, startChar),
        Position.create(lineNumber, endChar)
      );

      // Resolve full path relative to document
      const docUri = URI.parse(document.uri);
      const fullPath = path.resolve(path.dirname(docUri.fsPath), filePath);

      links.push({
        range,
        target: URI.file(fullPath).toString(),
      });
    }

    return links;
  });
}
