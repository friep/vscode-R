'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, window, commands, ExtensionContext} from 'vscode';
import cp = require('child_process');

let outputChennel = window.createOutputChannel("r");
let config = workspace.getConfiguration('r');
let Rterm;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "r" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    function createRterm() {
        // let termName = workspace.getConfiguration('r').get<string>('rterm.windows');
        let path = window.activeTextEditor.document.fileName;
        let termName;
        
        if (process.platform == 'win32') {
            window.showErrorMessage("R: Sorry, this function is not implemented yet");
            return;
        } else if (process.platform == 'darwin' || process.platform == 'linux') {
            termName = "R"
            Rterm = window.createTerminal(termName);
            Rterm.show();
        } else{
            window.showErrorMessage(process.platform + "can't use R");
            return;
        }
    }

    function runR()  {
        let path = window.activeTextEditor.document.fileName;
        let cmd;
        
        if (process.platform == 'win32') {
            cmd = config.get('rterm.windows');
            
            let args = ["--no-restore",
            "--no-save",
            "--quiet",
            "--file=" + path];
            cp.execFile(cmd, args, {}, (err, stdout, stderr) => {
                try {
                    if (err) {
                        console.log(err);
                    }
                    outputChennel.show(true);
                    outputChennel.append(stdout);
                } catch (e) {
                    window.showErrorMessage(e.message);
                }
            });
        } else if (process.platform == 'darwin' || process.platform == 'linux') {
            if (!Rterm){
                createRterm();
            }
            Rterm.show();
            Rterm.sendText("source("+ path + ")");
        } else {
            window.showErrorMessage(process.platform + "can't use R");
            return;
        }
    }

    context.subscriptions.push(
        commands.registerCommand('r.createRterm', createRterm),
        commands.registerCommand('r.runR', runR)
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}