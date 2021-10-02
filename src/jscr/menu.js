

function burgerMenuAddListener() {	
	const burgerMenu = document.querySelector('#burgerMenu');
	const navMenu = document.querySelector('#navMenu');
	burgerMenu.addEventListener('click', () => {
			navMenu.classList.toggle('is-active');
		}
	);
}


burgerMenuAddListener();
