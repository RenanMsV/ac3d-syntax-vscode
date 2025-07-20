import * as vscode from 'vscode';

export function registerColorProvider(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = { language: 'ac3d', scheme: 'file' };

  const provider: vscode.DocumentColorProvider = {
    provideDocumentColors(document) {
      const colorInfos: vscode.ColorInformation[] = [];

      const colorRegex = /\b(rgb|amb|emis|spec)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g;

      for (let line = 0; line < document.lineCount; line++) {
        const text = document.lineAt(line).text;

        // 🚀 Optimization: skip lines that don't start with MATERIAL, rgb, amb, emis, spec
        if (
          !text.trimStart().startsWith('MATERIAL') &&
          !text.trimStart().startsWith('rgb') &&
          !text.trimStart().startsWith('amb') &&
          !text.trimStart().startsWith('emis') &&
          !text.trimStart().startsWith('spec')
        ) {continue;}
        
        let match: RegExpExecArray | null;
        while ((match = colorRegex.exec(text))) {
          const [, keyword, rStr, gStr, bStr] = match;
          const startIndex = match.index + keyword.length + 1;
          const endIndex = match.index + match[0].length;

          const range = new vscode.Range(
            new vscode.Position(line, startIndex),
            new vscode.Position(line, endIndex)
          );

          const r = parseFloat(rStr);
          const g = parseFloat(gStr);
          const b = parseFloat(bStr);

          const color = new vscode.Color(
            Math.min(Math.max(r, 0), 1),
            Math.min(Math.max(g, 0), 1),
            Math.min(Math.max(b, 0), 1),
            1
          );

          colorInfos.push(new vscode.ColorInformation(range, color));
        }
      }

      return colorInfos;
    },

    provideColorPresentations(color) {
      const rgbString = `${formatColorValue(color.red.toFixed(2))} ${formatColorValue(color.green.toFixed(2))} ${formatColorValue(color.blue.toFixed(2))}`;
      return [new vscode.ColorPresentation(rgbString)];
    }
  };

  function formatColorValue(value: string): string {
    if (value === "1.00") {return "1";}
    if (value === "0.00") {return "0";}
    return value;
  }

  context.subscriptions.push(vscode.languages.registerColorProvider(selector, provider));
}
