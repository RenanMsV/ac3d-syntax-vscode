import * as assert from 'assert';
import * as vscode from 'vscode';

suite('AC3D Extension Test Suite', () => {
  test('VS Code API is available', () => {
    assert.ok(vscode.version, 'VS Code API not initialized');
    assert.doesNotThrow(() => {
      vscode.window.showInformationMessage('Notification test');
    }, 'VS Code notification could not be displayed');
  });

  test('Extension loads', async () => {
    const ext = vscode.extensions.getExtension('Renan-MsV.ac3d-syntax');
    assert.ok(ext, 'Extension not found');
    await ext?.activate();
    assert.ok(ext.isActive, 'Extension did not activate');
  });

  test('Can open an AC3Db file', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'ac3d',
      content: 'AC3Db\nMATERIAL "ac3dmat0" rgb 1 1 1  amb 0.2 1 0.2  emis 0.42 0 0  spec 0.2 0.59 0.81  shi 128  trans 0\nOBJECT world\nkids 0'
    });
    assert.strictEqual(doc.languageId, 'ac3d');
  });

  test('Can open an AC3Dc file', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'ac3d',
      content: 'AC3Dc\nMAT "ac3dmat0"\nrgb 1 1 1\namb 1 1 1\nemis 1 1 1\nspec 1 1 1\nshi 128\ntrans 0\ndata 0\nENDMAT\nOBJECT world\nkids 0'
    });
    assert.strictEqual(doc.languageId, 'ac3d');
  });
});