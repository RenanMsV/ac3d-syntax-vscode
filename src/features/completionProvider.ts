import * as vscode from 'vscode';

const keywordKinds: Record<string, vscode.CompletionItemKind> = {
  // file headers
  AC3Db: vscode.CompletionItemKind.Constant,
  AC3Dc: vscode.CompletionItemKind.Constant,

  // blocks
  MATERIAL: vscode.CompletionItemKind.Keyword,
  MAT: vscode.CompletionItemKind.Keyword,
  ENDMAT: vscode.CompletionItemKind.Keyword,
  OBJECT: vscode.CompletionItemKind.Keyword,
  SURF: vscode.CompletionItemKind.Keyword,

  // properties
  name: vscode.CompletionItemKind.Keyword,
  data: vscode.CompletionItemKind.Keyword,
  texture: vscode.CompletionItemKind.Keyword,
  texrep: vscode.CompletionItemKind.Keyword,
  texoff: vscode.CompletionItemKind.Keyword,
  subdiv: vscode.CompletionItemKind.Keyword,
  crease: vscode.CompletionItemKind.Keyword,
  rot: vscode.CompletionItemKind.Keyword,
  loc: vscode.CompletionItemKind.Keyword,
  url: vscode.CompletionItemKind.Keyword,
  hidden: vscode.CompletionItemKind.Keyword,
  locked: vscode.CompletionItemKind.Keyword,
  folded: vscode.CompletionItemKind.Keyword,

  // geometry
  numvert: vscode.CompletionItemKind.Keyword,
  numsurf: vscode.CompletionItemKind.Keyword,
  kids: vscode.CompletionItemKind.Keyword,
  mat: vscode.CompletionItemKind.Keyword,
  refs: vscode.CompletionItemKind.Keyword,

  // material values
  rgb: vscode.CompletionItemKind.Variable,
  amb: vscode.CompletionItemKind.Variable,
  emis: vscode.CompletionItemKind.Variable,
  spec: vscode.CompletionItemKind.Variable,
  shi: vscode.CompletionItemKind.Variable,
  trans: vscode.CompletionItemKind.Variable
};

export function registerCompletionProvider(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    [
      { language: 'ac3d', scheme: 'file' },
      { language: 'ac3d', scheme: 'untitled' }
    ],
    {
      provideCompletionItems() {
        return Object.entries(keywordKinds).map(([keyword, kind]) => {
          const item = new vscode.CompletionItem(keyword, kind);
          item.insertText = keyword;
          item.detail = `AC3D ${vscode.CompletionItemKind[kind]}`;
          return item;
        });
      }
    },
    '' // Trigger on any character, or use a specific one like ' ' or '\n'
  );

  context.subscriptions.push(provider);
}
