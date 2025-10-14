import {
  CompletionItem,
  CompletionItemKind,
  Connection,
  TextDocuments,
  TextDocumentPositionParams
} from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';

const kindNames: Record<CompletionItemKind, string> = {
  [CompletionItemKind.Text]: "Text",
  [CompletionItemKind.Method]: "Method",
  [CompletionItemKind.Function]: "Function",
  [CompletionItemKind.Constructor]: "Constructor",
  [CompletionItemKind.Field]: "Field",
  [CompletionItemKind.Variable]: "Variable",
  [CompletionItemKind.Class]: "Class",
  [CompletionItemKind.Interface]: "Interface",
  [CompletionItemKind.Module]: "Module",
  [CompletionItemKind.Property]: "Property",
  [CompletionItemKind.Unit]: "Unit",
  [CompletionItemKind.Value]: "Value",
  [CompletionItemKind.Enum]: "Enum",
  [CompletionItemKind.Keyword]: "Keyword",
  [CompletionItemKind.Snippet]: "Snippet",
  [CompletionItemKind.Color]: "Color",
  [CompletionItemKind.File]: "File",
  [CompletionItemKind.Reference]: "Reference",
  [CompletionItemKind.Folder]: "Folder",
  [CompletionItemKind.EnumMember]: "EnumMember",
  [CompletionItemKind.Constant]: "Constant",
  [CompletionItemKind.Struct]: "Struct",
  [CompletionItemKind.Event]: "Event",
  [CompletionItemKind.Operator]: "Operator",
  [CompletionItemKind.TypeParameter]: "TypeParameter"
};

const keywordKinds: Record<string, CompletionItemKind> = {
  // file headers
  AC3Db: CompletionItemKind.Constant,
  AC3Dc: CompletionItemKind.Constant,

  // blocks
  MATERIAL: CompletionItemKind.Keyword,
  MAT: CompletionItemKind.Keyword,
  ENDMAT: CompletionItemKind.Keyword,
  OBJECT: CompletionItemKind.Keyword,
  SURF: CompletionItemKind.Keyword,

  // properties
  name: CompletionItemKind.Keyword,
  data: CompletionItemKind.Keyword,
  texture: CompletionItemKind.Keyword,
  texrep: CompletionItemKind.Keyword,
  texoff: CompletionItemKind.Keyword,
  subdiv: CompletionItemKind.Keyword,
  crease: CompletionItemKind.Keyword,
  rot: CompletionItemKind.Keyword,
  loc: CompletionItemKind.Keyword,
  url: CompletionItemKind.Keyword,
  hidden: CompletionItemKind.Keyword,
  locked: CompletionItemKind.Keyword,
  folded: CompletionItemKind.Keyword,

  // geometry
  numvert: CompletionItemKind.Keyword,
  numsurf: CompletionItemKind.Keyword,
  kids: CompletionItemKind.Keyword,
  mat: CompletionItemKind.Keyword,
  refs: CompletionItemKind.Keyword,

  // material values
  rgb: CompletionItemKind.Variable,
  amb: CompletionItemKind.Variable,
  emis: CompletionItemKind.Variable,
  spec: CompletionItemKind.Variable,
  shi: CompletionItemKind.Variable,
  trans: CompletionItemKind.Variable
};


export function registerCompletionProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  connection.onCompletion(
    (_params: TextDocumentPositionParams): CompletionItem[] => {
      return Object.entries(keywordKinds).map(([keyword, kind]) => ({
        label: keyword,
        kind,
        detail: `AC3D ${kindNames[kind]}`,
        insertText: keyword
      }));
    }
  );
}
