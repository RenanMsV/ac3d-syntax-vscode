import * as vscode from 'vscode';

export function registerFoldingProvider(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = { language: 'ac3d', scheme: 'file' };

  const provider: vscode.FoldingRangeProvider = {
    provideFoldingRanges(document, context, token) {
      const foldingRanges: vscode.FoldingRange[] = [];
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
            foldingRanges.push(new vscode.FoldingRange(materialStart, i - 1));
            materialStart = null;
          }

          // Close previous OBJECT block
          if (objectStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(objectStart, i - 1));
          }
          objectStart = i;
        }

        // Start of MAT block
        if (line.startsWith('MAT ')) {
          // Close previous MAT block
          if (matStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(matStart, i - 1));
          }
          matStart = i;
        }

        // End of MAT block
        if (line.startsWith('ENDMAT')) {
          if (matStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(matStart, i));
          }
        }

        // Start of SURF block
        if (line.startsWith('SURF')) {
          // Close previous SURF block
          if (surfStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(surfStart, i - 1));
          }
          surfStart = i;
        }
      }

      // Close any unclosed MATERIAL or OBJECT block at EOF
      if (materialStart !== null) {
        foldingRanges.push(new vscode.FoldingRange(materialStart, lines.length - 1));
      }
      if (matStart !== null) {
        foldingRanges.push(new vscode.FoldingRange(matStart, lines.length - 1));
      }
      if (objectStart !== null) {
        foldingRanges.push(new vscode.FoldingRange(objectStart, lines.length - 1));
      }
      if (surfStart !== null) {
        foldingRanges.push(new vscode.FoldingRange(surfStart, lines.length - 1));
      }

      return foldingRanges;
    }
  };

  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(selector, provider)
  );
}
