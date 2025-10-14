import { Hover, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import rawHoverInfo from '../../data/hover.json';

const hoverInfo = rawHoverInfo as Record<string, string>;

function getWordAtPosition(doc: TextDocument, pos: { line: number; character: number }): string | null {
  const line = doc.getText({
    start: { line: pos.line, character: 0 },
    end: { line: pos.line + 1, character: 0 }
  });

  const regex = /\b\w+\b/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line))) {
    const start = match.index;
    const end = start + match[0].length;
    if (pos.character >= start && pos.character <= end) {
      return match[0];
    }
  }
  return null;
}

export function handleHoverProvider(
  document: TextDocument,
  params: TextDocumentPositionParams
): Hover | null {
  const word = getWordAtPosition(document, params.position);
  if (!word) {return null;}

  const message = hoverInfo[word];
  if (!message) {return null;}

  return {
    contents: {
      kind: 'markdown',
      value: `**${word}** ${message}`
    }
  };
}
