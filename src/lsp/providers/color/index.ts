import {
  TextDocuments,
  ColorInformation,
  Color,
  ColorPresentation,
  Connection,
  DocumentColorParams,
  Range,
  ColorPresentationParams
} from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';


// Register the color provider on the server
export function registerColorProvider(
  documents: TextDocuments<TextDocument>,
  connection: Connection
) {
  // Handle request to provide color ranges in the document
  connection.onDocumentColor((params: DocumentColorParams): ColorInformation[] => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {return [];}

    const colorInfos: ColorInformation[] = [];
    const colorRegex = /\b(rgb|amb|emis|spec)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g;
    const lines = document.getText().split(/\r?\n/);

    for (let line = 0; line < lines.length; line++) {
      const text = lines[line];

      const trimmed = text.trimStart();
      if (
        !trimmed.startsWith('MATERIAL') &&
        !trimmed.startsWith('rgb') &&
        !trimmed.startsWith('amb') &&
        !trimmed.startsWith('emis') &&
        !trimmed.startsWith('spec')
      ) {
        continue;
      }

      let match: RegExpExecArray | null;
      while ((match = colorRegex.exec(text))) {
        const [, keyword, rStr, gStr, bStr] = match;
        const startIndex = match.index + keyword.length + 1;
        const endIndex = match.index + match[0].length;

        const range: Range = {
          start: { line, character: startIndex },
          end: { line, character: endIndex }
        };

        const r = parseFloat(rStr);
        const g = parseFloat(gStr);
        const b = parseFloat(bStr);

        const color: Color = {
          red: Math.min(Math.max(r, 0), 1),
          green: Math.min(Math.max(g, 0), 1),
          blue: Math.min(Math.max(b, 0), 1),
          alpha: 1
        };

        colorInfos.push({ range, color });
      }
    }

    return colorInfos;
  });

  // Handle request to display color as a string
  connection.onColorPresentation((params: ColorPresentationParams): ColorPresentation[] => {
    const { red, green, blue } = params.color;

    const rgbString = [
      formatColorValue(red),
      formatColorValue(green),
      formatColorValue(blue)
    ].join(' ');

    return [
      {
        label: rgbString
      }
    ];
  });
}

function formatColorValue(value: number): string {
  const fixed = value.toFixed(2);
  if (fixed === '1.00') {return '1';}
  if (fixed === '0.00') {return '0';}
  return fixed;
}
