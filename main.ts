import { Plugin, TFile } from 'obsidian';

export default class ObsidianMarimoPlugin extends Plugin {
	private marimoInjected = false;

	async onload() {
		this.registerMarkdownCodeBlockProcessor('marimo', (source: string, wrapper: HTMLElement) => {
			// Inject Marimo assets only once, the first time we see a 'marimo' code block
			if (!this.marimoInjected) {
				//this.marimoInjected = true;

				console.log('Injecting Marimo scripts/tags...');
				console.log(wrapper);

				// Inject Marimo Islands.
				const script = document.createElement('script');
				script.type = 'module';
				script.src = 'https://cdn.jsdelivr.net/npm/@marimo-team/islands@0.11.21-dev11/dist/main.min.js';
				wrapper.appendChild(script);
				console.log(script);

				// Inyectar marimo-filename (hidden)
				const marimoFilename = document.createElement('marimo-filename');
				marimoFilename.hidden = true;
				wrapper.appendChild(marimoFilename);

				// Inyectar marimo-mode (hidden, read mode)
				const marimoMode = document.createElement('marimo-mode');
				marimoMode.setAttribute('data-mode', 'read');
				marimoMode.hidden = true;
				wrapper.appendChild(marimoMode);

				// (Optional) inject other assets like Google Fonts or KaTeX here if needed
			}

			// 1) Gather info for data-app-id
			let appId = 'default';
			const activeFile: TFile | null = this.app.workspace.getActiveFile();
			if (activeFile) {
				appId = activeFile.basename;
			}

			// 2) Create the <marimo-island> DOM structure
			const island = document.createElement('marimo-island');
			// Generate a unique ID
			const uniqueId = `cell-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
			island.setAttribute('data-app-id', appId);
			island.setAttribute('data-cell-id', uniqueId);
			island.setAttribute('data-reactive', 'true');

			// Output element with some placeholder text
			const cellOutput = document.createElement('marimo-cell-output');
			cellOutput.textContent = 'loading marimo...';
			island.appendChild(cellOutput);

			// Code element (hidden)
			const cellCode = document.createElement('marimo-cell-code');
			cellCode.hidden = true;
			cellCode.textContent = encodeURIComponent(source);
			island.appendChild(cellCode);

			wrapper.appendChild(island);
			//wrapper.remove();
		});
	}
}
