import {
  Diagnostic,
  DiagnosticSeverity,
  Range,
  Position,
  TextDocuments,
  Connection,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { lintRules } from './rules';

export function registerLintProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  function validateTextDocument(textDocument: TextDocument): void {
    const diagnostics: Diagnostic[] = [];
    const text = textDocument.getText();
    const lines = text.split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber].trim();
      if (!line) {continue;}

      const [keyword, ...args] = line.split(/\s+/);

      Object.entries(lintRules).forEach(([severityKey, rules]) => {
        rules?.forEach(rule => {
          if (rule.keyword !== keyword) {return;}

          const error = rule.validator(args);
          if (error) {
            // Construct range from just after keyword to end of line
            const range = Range.create(
              Position.create(lineNumber, keyword.length + 1),
              Position.create(lineNumber, line.length)
            );

            const severity =
              DiagnosticSeverity[severityKey as keyof typeof DiagnosticSeverity] ||
              DiagnosticSeverity.Error;

            diagnostics.push({
              range,
              message: error,
              severity,
              source: 'ac3d-linter',
            });
          }
        });
      });
    }

    // Send diagnostics to the client
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  }

  // Hook document events
  documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
  });

  documents.onDidOpen(event => {
    validateTextDocument(event.document);
  });

  documents.onDidClose(event => {
    // Clear diagnostics on document close
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
  });

  // Optionally validate all open docs on startup
  documents.all().forEach(validateTextDocument);
}
