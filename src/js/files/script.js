// Підключення функціоналу
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// BeforeAfter
const beforeAfter = document.querySelector('.before-after');
if (beforeAfter) {
	const beforeAfterArrow = document.querySelector('.before-after__arrow');
	const afterItem = document.querySelector('.before-after__item--after');
	const beforeAfterArrowWidth = parseFloat(window.getComputedStyle(beforeAfterArrow).getPropertyValue('width'));
	let beforeAfterSizes = {};

	beforeAfter.addEventListener('mouseover', function (e) {
		const targetElement = e.target;
		if (!targetElement.classList.contains('before-after__arrow')) {
			if (targetElement.closest('.before-after__item--before')) {
				beforeAfterArrow.classList.remove('before-after__arrow--right');
				beforeAfterArrow.classList.add('before-after__arrow--left');
			} else {
				beforeAfterArrow.classList.add('before-after__arrow--right');
				beforeAfterArrow.classList.remove('before-after__arrow--left');
			}
		}
	});
	beforeAfter.addEventListener('mouseleave', function () {
		beforeAfterArrow.classList.remove('before-after__arrow--left');
		beforeAfterArrow.classList.remove('before-after__arrow--right');
	});
	isMobile.any() ?
		beforeAfterArrow.addEventListener('touchstart', beforeAfterInit) :
		beforeAfterArrow.addEventListener('mousedown', beforeAfterInit);

	function beforeAfterInit(e) {
		beforeAfterSizes = {
			width: beforeAfter.offsetWidth,
			left: beforeAfter.getBoundingClientRect().left - scrollX
		}
		if (isMobile.any()) {
			document.addEventListener('touchmove', beforeAfterArrowMove);
			document.addEventListener('touchend', function (e) {
				document.removeEventListener('touchmove', beforeAfterArrowMove);
			}, { "once": true });
		} else {
			document.addEventListener('mousemove', beforeAfterArrowMove);
			document.addEventListener('mouseup', function (e) {
				document.removeEventListener('mousemove', beforeAfterArrowMove);
			}, { "once": true });
		}
		document.addEventListener('dragstart', function (e) {
			e.preventDefault();
		}, { "once": true });
	}
	function beforeAfterArrowMove(e) {
		const posLeft = e.type === "touchmove" ?
			e.touches[0].clientX - beforeAfterSizes.left :
			e.clientX - beforeAfterSizes.left;
		if (posLeft <= beforeAfterSizes.width && posLeft > 0) {
			const way = posLeft / beforeAfterSizes.width * 100;
			beforeAfterArrow.style.cssText = `left:calc(${way}% - ${beforeAfterArrowWidth}px)`;
			afterItem.style.cssText = `width: ${100 - way}%`;
		} else if (posLeft >= beforeAfterSizes.width) {
			beforeAfterArrow.style.cssText = `left: calc(100% - ${beforeAfterArrowWidth}px)`;
			afterItem.style.cssText = `width: 0%`;
		} else if (posLeft <= 0) {
			beforeAfterArrow.style.cssText = `left: 0%`;
			afterItem.style.cssText = `width: 100%`;
		}
	}
}

// Doctors
const doctors = document.querySelector('.doctors');
if (doctors) {
	loadDoctors();
}
async function loadDoctors() {
	const response = await fetch("files/data/doctors.json", {
		method: "GET"
	});
	if (response.ok) {
		const responseResult = await response.json();
		initDoctors(responseResult);
	} else {
		alert("Помилка");
	}
}
const doctorsList = document.querySelector('.body-doctors__list');
const doctorsPhoto = document.querySelector('.body-doctors__photo');
const doctorsSkils = document.querySelector('.info-doctors__skils');
const doctorsStat = document.querySelector('.stat-doctors');
const doctorsGallery = document.querySelector('.doctors__works');
const doctorsListActiveElement = `_active`;

function initDoctors(data) {
	let doctorsListElements = ``;
	data.doctors.forEach(doctor => {
		const isActive = doctor.isActive;
		if (isActive) {
			buildDoctor(doctor);
		}
		// List
		doctorsListElements += `
			<a data-id="${doctor.id}" href="#" class="body-doctors__item item-doctors-list ${isActive ? doctorsListActiveElement : null}">
				<div class="item-doctors-list__image-ibg">
					<img src="img/${doctor.media.avatar}" alt="Image">
				</div>
				<div class="item-doctors-list__body">
					<div class="item-doctors-list__name">${doctor.name}</div>
					<div class="item-doctors-list__text">
						${doctor.position}
					</div>
				</div>
			</a>
		`;
	});

	doctorsList.innerHTML = doctorsListElements;

	document.addEventListener('click', doctorsListActions);

	function doctorsListActions(e) {
		const targetElement = e.target;
		if (targetElement.closest('.item-doctors-list')) {
			const currentItem = targetElement.closest('.item-doctors-list');
			const doctorId = +currentItem.dataset.id;
			const activeListItem = document.querySelector('.item-doctors-list._active');
			activeListItem.classList.remove('_active');
			currentItem.classList.add('_active');

			const activeDoctorArray = data.doctors.filter(item => item.id === doctorId);
			const activeDoctor = activeDoctorArray[0];
			buildDoctor(activeDoctor);
			e.preventDefault();
		}
	}
}

function buildDoctor(activeDoctor) {
	let skilItems = ``;
	let statItems = ``;
	let galleryItem = ``;

	const mainPhoto = activeDoctor.media.main;
	const gallerySmallItems = activeDoctor.media.gallery.small;
	const galleryBiglItems = activeDoctor.media.gallery.big;
	const skils = activeDoctor.skils;
	const stats = activeDoctor.stat;

	// Main Photo
	mainPhoto ? doctorsPhoto.innerHTML = `<img src="img/${mainPhoto}" alt="Big Image">` : null;
	// Skils
	for (const item in skils) {
		skilItems +=
			`<div class="skils-item">
						<div style="min-width: ${skils[item]}%;" class="skils-item__info">
							<div class="skils-item__label">${item}</div>
							<div class="skils-item__value">${skils[item]}%</div>
						</div>
						<div style="width: ${skils[item]}%;" class="skils-item__line"></div>
					</div>`;
	}
	doctorsSkils.innerHTML = skilItems;
	// Stats
	for (const item in stats) {
		statItems +=
			`<div class="stat-doctors__item">
						<div data-digits-counter class="stat-doctors__value">${stats[item]}</div>
						<div class="stat-doctors__label">${item}</div>
					</div>`;
	}
	doctorsStat.innerHTML = statItems;

	// Gallery
	gallerySmallItems.forEach((gallerySmallItem, index) => {
		galleryItem +=
			`<a href="img/${gallerySmallItem}" class="doctors__work-ibg">
								<img src="img/${galleryBiglItems[index]}" alt="Image">
						</a>`;
	});
	doctorsGallery.innerHTML = galleryItem;
	flsModules.gallery[0].galleryClass.refresh();
}

// SlideWhenScroll
const gallery = document.querySelector('.gallery-about');
if (gallery && !isMobile.any()) {
	window.addEventListener('scroll', function (e) {
		const gWidth = gallery.offsetWidth;
		const gRow = document.querySelectorAll('.gallery-about__row');
		const wHeight = window.innerHeight;
		gRow.forEach((gRowItem, index) => {
			const gItems = gRowItem.querySelectorAll('.item-gallery-about');
			let dRowWidth = 0;
			gItems.forEach(gItem => {
				dRowWidth += gItem.offsetWidth + 20;
			});

			// Ширина кожного рядка
			dRowWidth = dRowWidth - 20;
			// Шлях який треба пройти
			const gWay = dRowWidth - gWidth;

			if (gWay > 0) {
				const gRowHeight = gRowItem.offsetHeight;
				const gRowTopPos = gRowItem.getBoundingClientRect().top;
				const gRowTop = wHeight - gRowTopPos;

				// Знаходимо парний\непарний рядок
				const slideDirection = index % 2 === 0 ? -1 : 1;

				if (gRowTop >= gRowHeight) {
					const sWay = (gRowTop - gRowHeight) / (wHeight - gRowHeight) * 100;

					gRowItem.style.cssText =
						`transform: translateX(${(gWay / 100 * sWay) * slideDirection}px);`;

					if (gRowTop >= wHeight) {
						gRowItem.style.cssText =
							`transform: translateX(${gWay * slideDirection}px);`;
					}
				} else {
					gRowItem.style.cssText =
						`transform: translateX(0px);`;
				}
			}
		});
	});
}
