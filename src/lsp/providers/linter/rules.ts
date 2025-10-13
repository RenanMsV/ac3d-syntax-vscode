import * as vscode from 'vscode';
import { Validators } from './validators';

export interface LintRule {
  keyword: string;
  comment?: string; // internal comment, not shown to user
  validator: (args: string[]) => string | null;
}

export const lintRules: { [K in keyof typeof vscode.DiagnosticSeverity]?: LintRule[] } = {
  Hint: [],

  Information: [],

  Warning: [],

  Error: [
    {
      keyword: 'OBJECT',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(1),
        Validators.oneOf(['world', 'poly', 'group'])
      )
    },
    {
      keyword: 'MATERIAL',
      comment: 'AC3Db material implementation',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(21),
        Validators.numberArgs([2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 20]),
        Validators.numberInRange([2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16], 0, 1),
        Validators.numberInRange([18], 0, 128),
        Validators.numberInRange([20], 0, 1)
      )
    },
    {
      keyword: 'shi',
      comment: 'Material shi',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(1),
        Validators.numberArgs([0]),
        Validators.numberInRange([0], 0, 128),
      )
    },
    {
      keyword: 'trans',
      comment: 'Material trans',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(1),
        Validators.numberArgs([0]),
        Validators.numberInRange([0], 0, 1),
      )
    },
    {
      keyword: 'rgb',
      comment: 'Material rgb',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(3),
        Validators.numberArgs([0, 1, 2]),
        Validators.numberInRange([0, 1, 2], 0, 1),
      )
    },
    {
      keyword: 'amb',
      comment: 'Material amb',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(3),
        Validators.numberArgs([0, 1, 2]),
        Validators.numberInRange([0, 1, 2], 0, 1),
      )
    },
    {
      keyword: 'emis',
      comment: 'Material emis',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(3),
        Validators.numberArgs([0, 1, 2]),
        Validators.numberInRange([0, 1, 2], 0, 1),
      )
    },
    {
      keyword: 'spec',
      comment: 'Material spec',
      validator: Validators.chain(
        Validators.nonEmptyArgs(),
        Validators.paramCount(3),
        Validators.numberArgs([0, 1, 2]),
        Validators.numberInRange([0, 1, 2], 0, 1),
      )
    }
  ]
};
