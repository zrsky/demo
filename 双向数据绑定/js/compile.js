function nodeToFragment() {
	var fragment = document.createDocumentFragment();
	var child = el.firstChild;
	while(child) {
		fragment.appendChild(child);
		child = child.firstChild;
	}
	return fragment;
}
