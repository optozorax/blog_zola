let toc_elements = {};
let previous_top = 0;
let can_change = true;
let scroll_user = 0;

let toc_toggled = false;
function toggle_toc() {
	let button = document.querySelector('.side-button');
	toc_toggled = !toc_toggled;
	if (toc_toggled) {
		button.innerHTML = "❯";
		button.classList.add('button-pressed')
		document.querySelector(`.section-nav`).classList.add('showed-mobile');
	} else {
		button.innerHTML = "❰";
		button.classList.remove('button-pressed')
		document.querySelector(`.section-nav`).classList.remove("showed-mobile");
	}
}

function toc_update() {
	let big_screen = window.matchMedia('(min-width: 75rem)').matches;

	if (!can_change) return;

	let first = true;
	let answer = null;
	document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((element) => {
		let rect = element.getBoundingClientRect();
		let id = element.getAttribute("id");
		let hidden = rect.top == 0 && rect.bottom == 0 && rect.left == 0 && rect.right == 0;
		if (!hidden && toc_elements["#" + id]) {
			let pos = rect.top;

			if (pos > 10 && first) {
				answer = id;
			} else if (pos < 10) {
				answer = id;
			}
			first = false;
		}
	});

	if (answer != null) {
		document.querySelectorAll(`.section-nav a`).forEach((x) => {
			x.classList.remove("active");
			x.classList.remove("selected");
		});
		let sel = document.querySelector(`.section-nav a[href="#${answer}"]`);
		sel.classList.add('active');
		history.pushState(null, null, "#" + answer);

		let parent = sel.parentElement;
		while (true) {
			if (parent.tagName.toLowerCase() == "li") {
				parent.children[0].classList.add('selected');
				parent = parent.parentElement;
			} else if (parent.tagName.toLowerCase() == "ul") {
				// do nothing
				parent = parent.parentElement;
			} else {
				break;
			}
		}

		if (big_screen) {
			let rect = sel.getBoundingClientRect();
			let top = rect.top - window.innerHeight / 2. + previous_top + scroll_user;
			console.log(`set ${top}`);

			if (top > 20) {
				previous_top = top;
				scroll_user = 0;
				top = -top;
				document.querySelector('.section-nav').style["transform"] = `translateY(${top}px)`;
			} else {
				previous_top = 20;
				scroll_user = 0;
				document.querySelector('.section-nav').style["transform"] = ``;
			}

			can_change = false;
			setTimeout(function() {
				can_change = true;
			}, 320)
		}
	}
}

let hammertime = null;

window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll(`.section-nav a`).forEach((x) => {
		toc_elements[x.getAttribute("href")] = true;
	});

	hammertime = new Hammer(document.querySelector('.section-nav'), { touchAction: "none" });

	hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 10 });

	hammertime.on('pan', ev => {
		let big_screen = window.matchMedia('(min-width: 75rem)').matches;
		if (big_screen) return;

		if (ev.pointerType == "mouse") return;

		ev.preventDefault();

		let top = -(previous_top + scroll_user - ev.deltaY);
		if (ev.isFinal) {
			scroll_user = scroll_user - ev.deltaY;
		}
		document.querySelector('.section-nav').style["transform"] = `translateY(${top}px)`;
	});

	toc_update();

	document.querySelector(`.section-nav`).addEventListener("wheel", (e) => {
		e.preventDefault();
		scroll_user = scroll_user + e.deltaY / 2;
		let top = -(previous_top + scroll_user);
		console.log(`set wheel ${top}`);
		document.querySelector('.section-nav').style["transform"] = `translateY(${top}px)`;
	});
});

document.addEventListener("scroll", (e) => {
	toc_update();
});

window.addEventListener('resize', (e) => {
	toc_update();
});
