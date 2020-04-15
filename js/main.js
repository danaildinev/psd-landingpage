document.addEventListener("DOMContentLoaded", function () {

	//first create header ripple effect
	createRippleEffect(214, 7, "#ripple-header");

	//menu
	const navToggle = document.querySelector("#toggle-main-nav"),
		navToggleIcon = document.querySelector(`#toggle-main-nav .nav-icon`),
		navMain = document.querySelector("#site-header .main-nav");

	navToggle.addEventListener("click", function () {
		if (!navMain.classList.contains("expanded")) {
			navToggleIcon.classList.add("close");
			navMain.classList.add("expanded");
		} else {
			navToggleIcon.classList.remove("close");
			navMain.classList.remove("expanded");
		}
	});

	//let's move the waves
	const stepsList = document.querySelector('.steps-list'),
		waveContainer = document.querySelector('.wave-container'),
		stepsListContents = document.querySelectorAll('.steps-list .step-content'),
		wavesImagesContainer = document.querySelector('.waves-container'),
		waveImage = document.querySelector('.waves-container img.wave'),
		attrWavesOffset = "data-wavesoffset",
		attrTopOffset = "data-topoffset";

	if (waveContainer.hasAttribute(attrWavesOffset)) {
		waveContainer.style.height = (stepsList.clientHeight + parseInt(waveContainer.getAttribute(attrWavesOffset))) + "px";
	}

	if (stepsListContents.length > 0) {
		stepsListContents.forEach(step => {
			if (step.hasAttribute(attrTopOffset)) {
				step.style.marginTop = step.getAttribute(attrTopOffset) + "px";
			}
		})
	}

	//because svg width is low... lets clone some!
	var leftWave = waveImage.cloneNode(true),
		rightWeave = waveImage.cloneNode(true);
	leftWave.style.transform = "scaleX(-1) translateX(150%)";
	rightWeave.style.transform = "scaleX(-1) translateX(-50%)";
	wavesImagesContainer.insertBefore(leftWave, waveImage);
	wavesImagesContainer.insertBefore(rightWeave, waveImage);

	// percentages
	const percentages = document.querySelectorAll(".track-percentage"),
		gradient = [
			{
				"color": "rgba(248, 87, 166, 1)",
				"offset": "0%"
			}, {
				"color": "rgba(255, 88, 88, 1)",
				"offset": "100%"
			}
		];
	var delay = 0, percentageDone;

	//init carousels
	const carousel = new DDCarousel({
		container: ".testimonials-list",
		items: 3,
		dots: false,
		nav: true,
		itemPerPage: true,
		callbacks: true,
		mouseDrag: false,
		labelNavPrev: '<span><img src="img/svg/arrow.svg" alt="&lt;"/></span>',
		labelNavNext: '<span><img src="img/svg/arrow.svg" alt="&gt;" style="transform:scaleX(-1)"/></span>',
		responsive: {
			1200: {
				nav: false,
				dots: true
			},
			992: {
				items: 2
			},
			768: {
				items: 1
			}
		}
	});

	//hover effect for partners
	const partners = document.querySelectorAll(".partners-list .partner img");
	partners.forEach(item => {
		item.hasAttribute('data-imgfull');
		if (item.hasAttribute('data-imgfull')) {
			var orig = item.src;
			item.addEventListener("mouseover", () => {
				item.src = item.getAttribute('data-imgfull');
			});
			item.addEventListener("mouseleave", () => {
				item.src = orig;
			});
		}
	});

	//more ripples
	createRippleEffect(80, 3, ".video-container .ripples");
	createRippleEffect(214, 7, "#ripple-download");

	window.addEventListener("scroll", () => {
		//activate percentage circles
		if (!percentageDone) {
			if (isScrolledIntoView(document.querySelector("section.track-section"), 500)) {
				percentages.forEach(item => {
					item.appendChild(createPercentageSvg(item.getAttribute("data-percentage"), gradient, 2, "track-circle", delay));
					delay += 500;
				});
				percentageDone = true;
			}
		}
	})
});

const createRippleEffect = (size, rings, outputElement, customclass) => {
	const output = document.querySelector(outputElement),
		multiplier = size,
		delay = 0.2;
	var animDelay = 0;

	output.style.width = `${size}px`;
	output.style.height = `${size}px`;

	for (var i = 0; i < rings; i++) {
		const ring = document.createElement("span");
		ring.classList.add("ripple-ring");
		ring.style.width = `${size}px`;
		ring.style.height = `${size}px`;
		ring.style.animationDelay = `${animDelay}s`;
		if (customclass !== undefined)
			ring.classList.add(customclass);

		animDelay += delay;
		if (i < rings - 1) size += multiplier;

		output.appendChild(ring);
	}
}

const createPercentageSvg = (percentage, gradientstops, stroke, animation, delay) => {
	const svgNamespace = "http://www.w3.org/2000/svg",
		svg = document.createElementNS(svgNamespace, "svg"),
		path = document.createElementNS(svgNamespace, "path");

	//path
	path.setAttribute("d", "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831");
	if (animation !== undefined)
		path.setAttribute("class", animation);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke-width", stroke);
	path.setAttribute("stroke-linecap", "round");
	path.setAttribute("stroke-dasharray", `${percentage}, 100`);

	//gradient
	addSvgToGradient(svg, "Gradient", gradientstops, 0, 1, 0, 0);
	path.setAttribute('stroke', 'url(#Gradient)');

	//svg
	svg.setAttribute("viewBox", "0 0 36 36");

	if (delay !== undefined) {
		setTimeout(() => {
			svg.appendChild(path);
		}, delay)
	} else {
		svg.appendChild(path);
	}

	return svg;
}

const addSvgToGradient = (svg, id, stops, x1, x2, y1, y2) => {
	const svgNamespace = "http://www.w3.org/2000/svg",
		gradient = document.createElementNS(svgNamespace, 'linearGradient'),
		defs = document.createElementNS(svgNamespace, 'defs');

	gradient.id = id;
	gradient.setAttribute('x1', x1);
	gradient.setAttribute('x2', x2);
	gradient.setAttribute('y1', y1);
	gradient.setAttribute('y2', y2);
	defs.appendChild(gradient);

	stops.forEach(item => {
		var stop = document.createElementNS(svgNamespace, 'stop');
		stop.setAttribute('offset', item.offset);
		stop.setAttribute('stop-color', item.color);
		gradient.appendChild(stop);
	});

	svg.appendChild(defs);
}

function isScrolledIntoView(el, offset) {
	var rect = el.getBoundingClientRect();
	var elemTop = rect.top;
	var elemBottom = rect.bottom;

	var isVisible = elemTop + offset < window.innerHeight && elemBottom >= 0;
	return isVisible;
}