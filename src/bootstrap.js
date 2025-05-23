var SemanticScholarSearch;

function log(msg) {
	Zotero.debug("Semantic Scholar Search: " + msg);
}

function install() {
	log("Installed 1.0");
}

async function startup({ id, version, rootURI }) {
	log("Starting 1.0");
	
	Services.scriptloader.loadSubScript(rootURI + 'semantic-scholar-search.js');
	SemanticScholarSearch.init({ id, version, rootURI });
	SemanticScholarSearch.addToAllWindows();
}

function onMainWindowLoad({ window }) {
	SemanticScholarSearch.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	SemanticScholarSearch.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down 1.0");
	SemanticScholarSearch.removeFromAllWindows();
	SemanticScholarSearch = undefined;
}

function uninstall() {
	log("Uninstalled 1.0");
}