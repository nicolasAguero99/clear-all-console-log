const vscode = require('vscode');
const fs = require('fs/promises');

const clearConsoleProject = vscode.commands.registerCommand('clear-console-project', async function () {
  try {
    const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,cpp}', '**/node_modules/**');

    if (files.length === 0) {
      vscode.window.showInformationMessage('No files (.js, .ts, .jsx, .tsx .cpp) found.');
      return;
    }

    for (const file of files) {
      try {
        const document = await vscode.workspace.openTextDocument(file);
        const lines = document.getText().split('\n');
        const updatedLines = lines.map(line => {
          const regex = /\s*(console\.\w+\([^)]*\);?|(?:std::)?cout\s*<<[^;]*;)/;

          if (regex.test(line)) {
            if (line.trim().match(regex)?.[0] === line.trim()) {
              return null;
            }
            return line.replace(regex, '').trim();
          }

          return line;
        }).filter(line => line !== null);

        const updatedContent = updatedLines.join('\n');

        if (updatedContent !== document.getText()) {
          await fs.writeFile(file.fsPath, updatedContent, 'utf-8');
        }
      } catch (error) {
        vscode.window.showErrorMessage('Error to find files: ' + error.message);
      }
    }

    vscode.window.showInformationMessage(`${files.length} files processed.`);
  } catch (error) {
    vscode.window.showErrorMessage('Error to find files: ' + error.message);
  }
});

const clearConsoleFile = vscode.commands.registerCommand('clear-console-file', async function () {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor.');
    return;
  }

  const document = editor.document;
  const regex = /\s*(console\.\w+\([^)]*\);?|(?:std::)?cout\s*<<[^;]*;)/;
  const text = document.getText();
  const lines = text.split('\n');

  const updatedLines = lines.map(line => {
    if (regex.test(line)) {
      // Si la línea solo contiene un "console", eliminarla
      if (line.trim().match(regex)?.[0] === line.trim()) {
        return null;
      }
      // Si la línea tiene más contenido, solo elimina el "console"
      return line.replace(regex, '').trim();
    }
    return line;
  }).filter(line => line !== null);

  const updatedText = updatedLines.join('\n');

  // Aplicar los cambios
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );

  editor.edit(editBuilder => {
    editBuilder.replace(fullRange, updatedText);
  }).then(success => {
    if (success) {
      vscode.window.showInformationMessage('All "console" were removed.');
    } else {
      vscode.window.showErrorMessage('Changes could not be applied.');
    }
  });
});

const clearConsoleProjectExceptError = vscode.commands.registerCommand('clear-console-project-except-error', async function () {
  try {
    const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,cpp}', '**/node_modules/**');

    if (files.length === 0) {
      vscode.window.showInformationMessage('No files (.js, .ts, .jsx, .tsx .cpp) found.');
      return;
    }

    for (const file of files) {
      try {
        const document = await vscode.workspace.openTextDocument(file);
        const lines = document.getText().split('\n');
        const updatedLines = lines.map(line => {
          const regex = /\s*(console\.\w+\([^)]*\);?|(?:std::)?cout\s*<<[^;]*;)/;

          if (regex.test(line)) {
            if (line.trim().match(regex)?.[0] === line.trim()) {
              return null;
            }
            return line.replace(regex, '').trim();
          }

          return line;
        }).filter(line => line !== null);

        const updatedContent = updatedLines.join('\n');

        if (updatedContent !== document.getText()) {
          await fs.writeFile(file.fsPath, updatedContent, 'utf-8');
        }
      } catch (error) {
        vscode.window.showErrorMessage('Error to find files: ' + error.message);
      }
    }

    vscode.window.showInformationMessage(`${files.length} files processed.`);
  } catch (error) {
    vscode.window.showErrorMessage('Error to find files: ' + error.message);
  }
});

const clearConsoleFileExceptError = vscode.commands.registerCommand('clear-console-file-except-error', async function () {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor.');
    return;
  }

  const document = editor.document;
  const regex = /\s*(console\.\w+\([^)]*\);?|(?:std::)?cout\s*<<[^;]*;)/;
  const text = document.getText();
  const lines = text.split('\n');

  const updatedLines = lines.map(line => {
    if (regex.test(line)) {
      // Si la línea solo contiene un "console", eliminarla
      if (line.trim().match(regex)?.[0] === line.trim()) {
        return null;
      }
      // Si la línea tiene más contenido, solo elimina el "console"
      return line.replace(regex, '').trim();
    }
    return line;
  }).filter(line => line !== null);

  const updatedText = updatedLines.join('\n');

  // Aplicar los cambios
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );

  editor.edit(editBuilder => {
    editBuilder.replace(fullRange, updatedText);
  }).then(success => {
    if (success) {
      vscode.window.showInformationMessage('All "console" were removed (except "console.error").');
    } else {
      vscode.window.showErrorMessage('Changes could not be applied.');
    }
  });
});


module.exports = {
  clearConsoleProject,
  clearConsoleFile,
  clearConsoleProjectExceptError,
  clearConsoleFileExceptError
};