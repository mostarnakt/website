
// Log welcome message to console when the page is loaded 
document.addEventListener('DOMContentLoaded', () => {
  console.log('Vítejte v Moštárně Klatovy!');
});


// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
	document.body.scrollTop = 0;    // For Safari
	document.documentElement.scrollTop = 0;    // For Chrome, Firefox, IE and Opera	
}
