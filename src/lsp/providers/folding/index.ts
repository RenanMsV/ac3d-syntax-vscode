import {
  FoldingRange,
  FoldingRangeParams,
  FoldingRangeRequest,
  TextDocuments,
  Connection,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

/**
 * Registers a folding range provider in the LSP server.
 * 
 * @param documents The TextDocuments manager instance
 * @param connection The LSP connection to listen for requests and send responses
 */
export function registerFoldingProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  // Listen for folding range requests from the client
  connection.onRequest(FoldingRangeRequest.type, (params: FoldingRangeParams) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {return [];}

    const foldingRanges: FoldingRange[] = [];
    const lines = document.getText().split(/\r?\n/);

    let materialStart: number | null = null;
    let matStart: number | null = null; // MAT and ENDMAT block (for AC3Dc only)
    let objectStart: number | null = null;
    let surfStart: number | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Start of MATERIAL block
      if (line.startsWith('MATERIAL') && materialStart === null) {
        materialStart = i;
      }

      // Start of OBJECT block
      if (line.startsWith('OBJECT')) {
        if (materialStart !== null) {
          foldingRanges.push(FoldingRange.create(materialStart, i - 1));
          materialStart = null;
        }

        // Close previous OBJECT block
        if (objectStart !== null) {
          foldingRanges.push(FoldingRange.create(objectStart, i - 1));
        }
        objectStart = i;
      }

      // Start of MAT block
      if (line.startsWith('MAT ')) {
        // Close previous MAT block
        if (matStart !== null) {
          foldingRanges.push(FoldingRange.create(matStart, i - 1));
        }
        matStart = i;
      }

      // End of MAT block
      if (line.startsWith('ENDMAT')) {
        if (matStart !== null) {
          foldingRanges.push(FoldingRange.create(matStart, i));
        }
      }

      // Start of SURF block
      if (line.startsWith('SURF')) {
        // Close previous SURF block
        if (surfStart !== null) {
          foldingRanges.push(FoldingRange.create(surfStart, i - 1));
        }
        surfStart = i;
      }
    }

    // Close any unclosed block at End Of File
    if (materialStart !== null) {
      foldingRanges.push(FoldingRange.create(materialStart, lines.length - 1));
    }
    if (matStart !== null) {
      foldingRanges.push(FoldingRange.create(matStart, lines.length - 1));
    }
    if (objectStart !== null) {
      foldingRanges.push(FoldingRange.create(objectStart, lines.length - 1));
    }
    if (surfStart !== null) {
      foldingRanges.push(FoldingRange.create(surfStart, lines.length - 1));
    }

    return foldingRanges;
  });
}
