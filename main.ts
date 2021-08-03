import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// this.addSettingTab(new SampleSettingTab(this.app, this));

		function doneTyping() {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				return;
			}
			let selection = activeView.sourceMode.getSelection()
			if (selection) {
				return;
			}
			cursorpos = activeView.sourceMode.cmEditor.getCursor()
			this.app.workspace.activeLeaf.setViewState({state: {file: this.app.workspace.getActiveFile().path, mode: "preview"}, type: "markdown"})
		}

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			if(evt.key === 'Control') {
				return;
			}
			clearTimeout(typingTimer);
			let v = this.app.workspace.activeLeaf.getViewState()
			if(v.state.mode === 'preview'){
				this.app.workspace.activeLeaf.setViewState({state: {file: this.app.workspace.getActiveFile().path, mode: "source"}, type: "markdown"})
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeView) {
					return;
				}
				let editor = activeView.sourceMode.cmEditor;
    		editor.focus();
				if(cursorpos) {
					editor.setCursor({ line: cursorpos.line, ch: cursorpos.ch });
				} else {
					editor.setCursor(editor.lastLine());
				}
			}
		});
		let typingTimer: any
		let cursorpos: any

		this.registerDomEvent(document, 'mousedown', (evt: MouseEvent) => {
			clearTimeout(typingTimer);
		});

		this.registerDomEvent(document, 'mouseup', (evt: MouseEvent) => {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(doneTyping, 2000);
		});

		this.registerDomEvent(document, 'keyup', (evt: KeyboardEvent) => {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(doneTyping, 2000);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		let {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue('')
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
