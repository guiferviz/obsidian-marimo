import { Plugin, TFile } from 'obsidian';

export default class ObsidianMarimoPlugin extends Plugin {
	private marimoInjected = false;

	async onload() {
		this.registerMarkdownCodeBlockProcessor('marimo', (source: string, wrapper: HTMLElement) => {
			console.log('Injecting Marimo scripts/tags...');

			if (!this.marimoInjected) {
				const script = document.createElement('script');
				script.type = 'module';
				script.src = 'https://cdn.jsdelivr.net/npm/@marimo-team/islands@0.11.21-dev11/dist/main.min.js';
				document.body.appendChild(script);
				this.marimoInjected = true;
			}

			let appId = 'default';
			const activeFile: TFile | null = this.app.workspace.getActiveFile();
			if (activeFile) {
				appId = activeFile.basename;
			}

			const uniqueId = `cell-${Math.floor(Math.random() * 1000000)}`;

			wrapper.insertAdjacentHTML('beforeend', `
				<marimo-filename hidden=""></marimo-filename>
				<marimo-mode data-mode="read" hidden=""></marimo-mode>
				<marimo-island
					data-app-id="${appId}"
					data-cell-idx="0"
					data-cell-id="${uniqueId}"
					data-reactive="true"
				>
					<marimo-cell-output>Loading Marimo...</marimo-cell-output>
					<marimo-cell-code hidden="">${encodeURIComponent(source)}</marimo-cell-code>
				</marimo-island>
			`);
		});
	}
}
