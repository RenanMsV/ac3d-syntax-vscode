// Import core LSP server modules (using Node.js transport layer)
import {
  createConnection,
  TextDocuments,
  TextDocumentSyncKind,
  Hover,
  ProposedFeatures,
  InitializeParams,
  TextDocumentPositionParams
} from 'vscode-languageserver/node';

// Import the text document helper class (to work with open documents)
import { TextDocument } from 'vscode-languageserver-textdocument';

// Import all features modules
import { handleHoverProvider } from './providers/hover';
import { registerLintProvider } from './providers/linter';
import { registerFoldingProvider } from './providers/folding';
import { registerDocumentLinkProvider } from './providers/link';
import { registerColorProvider } from './providers/color';
import { registerCompletionProvider } from './providers/completion';
import { registerSignatureHelpProvider } from './providers/signature';

export function createServer() {
  // Create the LSP connection to the client (e.g. VSCode)
  // This connection uses Node's IPC and enables all proposed LSP features
  const connection = createConnection(ProposedFeatures.all);
  // Create a manager for text documents opened in the editor
  // It keeps track of the content of each file in memory as it's being edited
  const documents = new TextDocuments(TextDocument);

  // Handle the "initialize" request from the client (when the language server starts)
  connection.onInitialize((_params: InitializeParams) => {
    return {
      capabilities: {
        hoverProvider: true,
        foldingRangeProvider: true,
        colorProvider: true,
        documentLinkProvider: {
          resolveProvider: false
        },
        completionProvider: {
          resolveProvider: false,
          triggerCharacters: []
        },
        signatureHelpProvider: {
          triggerCharacters: [' '],
          retriggerCharacters: [' ']
        },
        // Enable real-time syncing for open documents (like typing, edits)
        textDocumentSync: TextDocumentSyncKind.Incremental
      }
    };
  });

  // Handle the "hover" request from the client when the user hovers over a symbol
  connection.onHover((params: TextDocumentPositionParams): Hover | null => {
    // Get the document the user is hovering in
    const document = documents.get(params.textDocument.uri);
    if (!document) {return null;}
    // Delegate the hover logic to our modular handler
    return handleHoverProvider(document, params);
  });

  // Initialize providers
  registerLintProvider(documents, connection);
  registerFoldingProvider(documents, connection);
  registerDocumentLinkProvider(documents, connection);
  registerColorProvider(documents, connection);
  registerCompletionProvider(documents, connection);
  registerSignatureHelpProvider(documents, connection);

  // Start listening for document events (open, change, save, close)
  documents.listen(connection);

  // Start the language server, listening for incoming requests from the client
  connection.listen();
}

// Run if this file is executed directly via CLI (not when imported)
if (require.main === module) {
  createServer();
}
