import * as vscode from 'vscode';
import { activateLSPClient } from './lsp/client';

export function activate(context: vscode.ExtensionContext) {
  activateLSPClient(context);
}
