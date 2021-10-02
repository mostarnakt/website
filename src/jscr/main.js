

// Log welcome message to console when the page is loaded 
document.addEventListener('DOMContentLoaded', () => {
  console.log('Vítejte v Moštárně Klatovy!');
});


// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
	document.body.scrollTop = 0;    // For Safari
	document.documentElement.scrollTop = 0;    // For Chrome, Firefox, IE and Opera	
}


// Include html into an element
function includeHtml(elemId, file, func) {
	console.log("includeHtml(", elemId, ",", file, ",", func, ")");

	let e = document.getElementById(elemId);
	
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) { 
				e.innerHTML = this.responseText; 
				if (func)
					func();
			}
			if (this.status == 404) { e.innerHTML = "File " + file + " not found."; }
		}
	}
	xhttp.open("GET", file, true);
	xhttp.send();	
}


function aktualneShowAllOnClick(btn, elemId, file, func) {
	btn.disabled = true;
	includeHtml(elemId, file, func);
}