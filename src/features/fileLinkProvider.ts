import * as vscode from 'vscode';
import * as path from 'path';

export function registerFileLinkProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider({ language: 'ac3d' }, new FileLinkProvider())
  );
}

class FileLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = [];
    for (let line = 0; line < document.lineCount; line++) {
      const textLine = document.lineAt(line).text.trim();

      // Quick check: skip lines that don't start exactly with "texture "
      if (!textLine.startsWith('texture ')) continue;

      // Extract the quoted file path after 'texture '
      // Expected format: texture "filename.png"
      const match = textLine.match(/^texture\s+"([^"]+\.(png|jpg|bmp|tga|dds|tif|rgb|gif|ppm))"$/i);
      if (!match) continue;

      const filePath = match[1];
      const start = textLine.indexOf('"') + 1;
      const end = start + filePath.length;

      const range = new vscode.Range(line, start, line, end);
      const fullPath = path.resolve(path.dirname(document.uri.fsPath), filePath);

      links.push(new vscode.DocumentLink(range, vscode.Uri.file(fullPath)));
    }
    return links;
  }
}
