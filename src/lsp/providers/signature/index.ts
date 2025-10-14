import {
  SignatureHelp,
  SignatureInformation,
  ParameterInformation,
  SignatureHelpParams,
  TextDocuments,
  Connection,
  MarkupKind,
} from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';

import rawSignatures from '../../data/signatures.json';

const signatures: SignatureGroup[] = parseSignatures(rawSignatures);

interface RawSignatureGroup {
  name: string;
  sigInfo: {
    label: string;
    documentation: {
      kind: string;
      value: string;
    } | string | undefined;
  };
  parameters: {
    label: string;
    documentation: string;
    count: number;
  }[];
}

interface SignatureGroup {
  name: string;
  sigInfo: SignatureInformation;
  parameters: {
    label: string;
    documentation: string;
    count: number;
  }[];
}

// Helper to parse JSON signature group into proper objects
function parseSignatures(data: RawSignatureGroup[]): SignatureGroup[] {
  return data.map(entry => {
    const sigInfo = SignatureInformation.create('\n' + entry.sigInfo.label);

    const doc = entry.sigInfo.documentation;
    if (typeof doc === 'string' || doc === undefined) {
      sigInfo.documentation = doc;
    } else {
      // Explicitly cast kind to MarkupKind
      sigInfo.documentation = {
        kind: doc.kind as MarkupKind,
        value: doc.value
      };
    }

    return {
      name: entry.name,
      sigInfo,
      parameters: entry.parameters
    };
  });
}

// Tokenizer preserving quoted strings
function tokenizeLinePreservingQuotes(line: string): string[] {
  const regex = /"[^"]*"|\S+/g;
  return line.match(regex) ?? [];
}

export function registerSignatureHelpProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  connection.onSignatureHelp((params: SignatureHelpParams): SignatureHelp | null => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) {return null;}

    const rawLineText = doc.getText({
      start: { line: params.position.line, character: 0 },
      end: { line: params.position.line, character: Number.MAX_SAFE_INTEGER }
    });

    const words = tokenizeLinePreservingQuotes(rawLineText.trim());
    if (words.length === 0) {return null;}

    const command = words[0].toUpperCase();
    const args = words.slice(1);
    const spaceEnded = rawLineText.endsWith(' ');

    // Find matching signature group
    const group = signatures.find(sig => sig.name === command);
    if (!group) {return null;}

    // Determine which parameter the user is currently editing
    let currentIndex = 0;
    let paramIndex = -1;
    for (let i = 0; i < group.parameters.length; i++) {
      currentIndex += group.parameters[i].count;
      if (args.length < currentIndex) {
        paramIndex = i;
        break;
      }
    }
    
    if (!spaceEnded && paramIndex !== 0) {paramIndex -= 1;}
    if (paramIndex === -1) {return null;}

    const paramsInfo = group.parameters.map(p => ParameterInformation.create(p.label, p.documentation));

    const sigInfo = SignatureInformation.create(group.sigInfo.label ?? '');
    sigInfo.documentation = group.sigInfo.documentation;
    sigInfo.parameters = paramsInfo;

    return {
      signatures: [sigInfo],
      activeSignature: 0,
      activeParameter: paramIndex
    };
  });
}
