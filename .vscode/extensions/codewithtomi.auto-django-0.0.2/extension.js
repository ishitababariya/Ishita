const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "auto-django" is now active!');

    let disposable = vscode.commands.registerCommand('auto-django.autoDjango', function () {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('Please open an HTML file to edit.');
            return;
        }

        let fullText = editor.document.getText();

        const patterns = {
            img: /(<[a-zA-Z]*[^>]+src\s*=\s*['"])(?!{% static ')(?!http)([^'"]+)(['"][^>]*>)/gm,
            css: /(<link[^>]+href\s*=\s*['"])(?!{% static ')(?!http)([^'"]+\.css)(['"][^>]*>)/gm,
            js: /(<script[^>]+src\s*=\s*['"])(?!{% static ')(?!http)([^'"]+\.js)(['"][^>]*>)/gm
        };

        for (let type in patterns) {
            fullText = fullText.replace(patterns[type], function(match, p1, p2, p3) {
                return `${p1}{% static '${p2}' %}${p3}`;
            });
        }

        const fullRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
        editor.edit(editBuilder => {
            editBuilder.replace(fullRange, fullText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Static tags have been added! Please drop a review');
            } else {
                vscode.window.showErrorMessage('Failed to add static tags.');
            }
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
