SemanticScholarSearch = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],
	
	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},
	
	log(msg) {
		Zotero.debug("Semantic Scholar Search: " + msg);
	},
	
	addToWindow(window) {
		let doc = window.document;
		
		// Use Fluent for localization
		window.MozXULElement.insertFTLIfNeeded("semantic-scholar-search.ftl");
		
		// Add context menu item
		let menuitem = doc.createXULElement('menuitem');
		menuitem.id = 'semantic-scholar-search-item';
		menuitem.setAttribute('data-l10n-id', 'semantic-scholar-search-open');
		menuitem.addEventListener('command', () => {
			SemanticScholarSearch.openSemanticScholar(window);
		});
		
		// Add to the Zotero item context menu
		let popup = doc.getElementById('zotero-itemmenu');
		if (popup) {
			popup.appendChild(menuitem);
			this.storeAddedElement(menuitem);
		} else {
			this.log("Could not find zotero-itemmenu");
		}
	},
	
	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},
	
	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="semantic-scholar-search.ftl"]')?.remove();
	},
	
	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},
	
	openSemanticScholar(window) {
		let ZoteroPane = Zotero.getActiveZoteroPane();
		let selectedItems = ZoteroPane.getSelectedItems();
		if (!selectedItems || selectedItems.length === 0) {
			this.log("No items selected");
			return;
		}
		
		// For simplicity, we'll just use the first selected item
		let item = selectedItems[0];
		let title = item.getField('title');
		
		let creators = item.getCreators();
		let author = creators.length > 0 ? creators[0].lastName : '';
		
		let query = '';
		if (title) {
			query += title;
		}
		if (author) {
			query += ' ' + author;
		}
		
		if (query) {
			let url = `https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`;
			Zotero.launchURL(url);
		} else {
			this.log("Selected item has no title or author");
		}
	},
};