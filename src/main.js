import './meta?userscript-metadata';
import {
	URLS,
	CATEGORY_STYLE,
	SELECTORS,
	STORAGE_KEYS,
	ICON_COLOR,
	SVG_CODE,
	TYPE_STYLE,
	RESIZE_CONSTRAINTS,
	DEFAULT_CONFIG,
} from './configs/constants';
import DoubleArrayTrie from './classes/DoubleArrayTrie';
import sleep from './utils/sleepUtils';
import { GetAllElements, GetElement } from './utils/DOMUtils';

const DATrie = new DoubleArrayTrie();

Object.entries(CATEGORY_STYLE).forEach(([key, value]) => {
	GM_addStyle(`
			.${key}::before {
				content: "";
				display: inline-block;
				width: 50px;
				height: 30px;
				background-image: url("${value}");
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				vertical-align: middle;
			}

			.${key} {
				line-height: 30px;
			}
    	`);
});

GM_addStyle(`
		#namewd {
			outline: none;
		}

		.notification-pokedex {
			width: 350px;
			opacity: 0;
			visibility: hidden;
		}

		.notification-pokedex.show {
			opacity: 1;
			visibility: visible;
		}

		.notification-pokedex div {
			font-size: 14px;
			padding: 0 10px;
		}

		.notification-pokedex div h2 {
			font-size: 28px;
			margin: 1rem 0;
			text-align: left;
		}

		.notification-pokedex div p {
			margin: 0 0 1rem;
		}

		.notification-pokedex div p.type-list {
			margin-left: 1.5rem;
		}

		.notification-pokedex table {
			width: 100%;
			table-layout: auto;
			border-collapse: collapse;
			line-height: 1.5;
		}

		.notification-pokedex th,
		.notification-pokedex td {
			border-width: 1px 0;
			border-style: solid;
			border-color: #f0f0f0;
			padding: 4px 10px;
		}

		.notification-pokedex th {
			color: #737373;
			font-size: 0.875rem;
			font-weight: normal;
			text-align: right;

			width: 1px;
			white-space: nowrap;
		}

		.notification-pokedex td {
			color: #404040;
			font-size: 1rem;
			text-align: left;
		}

		.notification-pokedex h2 {
			text-transform: capitalize;
			margin: 0 60px;
			text-align: center;
		}

		.pokemon-image {
			display: inline-block;
			width: 80px;
			height: 80px;
			cursor: pointer;
			transition: transform 0.3s ease;
		}
		.pokemon-image.clicked {
			animation: float 1.5s ease-in-out infinite;
		}
			
		.pokemon-type {
			display: inline-block;
			width: 35px;
			height: 35px;
			cursor: pointer;
			transition: transform 0.3s ease;
			transform: scale(1);
		}
		.pokemon-type.clicked {
			transform: scale(1.2);
		}

		.pokemon-ball,
		.items {
			display: inline-block;
			width: 40px;
			cursor: pointer;
		}

		.teams {
			display: inline-block;
			width: 50px;
			height: 50px;
			cursor: pointer;
		}
		
		.type {
			font-weight: bold;
		}
		
		i:has(.pokemon-image),
		.pokemon-ability {
			color: #FFEBC6 !important;
		}
		
		i:has(img),
		i:has(span) {
			white-space: nowrap;
		}

		i:has(.pokemon-image),
		.pokemon-ability,
		.pokemon-move {
			font-weight: bold;
		}

		.contentbox > i > img {
			display: inline-block;
			margin-top: -5px;
		}

		.text-muted {
			color: #737373;
		}
			
		@keyframes float {
			0% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-10px);
			}
			100% {
				transform: translateY(0);
			}
		}

		@media (max-width: 500px) {
			.notification-pokedex {
				width: calc(100% - 20px);
			}
		}

		.pokemon-icon svg {
			width: 20px;
			height: 20px;
			margin-top: -2px;
			margin-left: 2px;
			transition: transform 0.3s ease;
			transform: rotate(0deg);
		}

		.pokemon-icon svg path {
			fill: #a8a8a8;
		}

		.pokemon-icon.clicked svg path {
			fill: #ff4b33;
		}

		.pokemon-icon.clicked svg {
			transform: rotate(90deg);
		}

		.icon-16 {
			width: 16px;
			height: 16px;
		}

		.icon-string {
			padding-left: 0.2rem;
			vertical-align: middle;
		}
	`);

Object.entries(TYPE_STYLE).forEach(([key, value]) => {
	GM_addStyle(`
			.${key} {
				color: ${value};
			}
			`);
});

function processTags(tags, datrie, data_json) {
	for (let i = 0; i < tags.length; i++) {
		let currentText = tags[i].getAttribute('t');
		let longestMatch = '';
		let h = tags[i].getAttribute('h');
		let v = tags[i].getAttribute('v');
		let j = i;

		while (j < tags.length && datrie.search(currentText)) {
			if (data_json.hasOwnProperty(currentText)) {
				longestMatch = currentText;
				if (j != i) {
					h = h + ' ' + tags[j].getAttribute('h');
					v = v + ' ' + tags[j].getAttribute('v');
				}
				console.table([currentText, h, v]);
			}

			j++;
			if (j < tags.length) {
				currentText += tags[j].getAttribute('t');
			}
		}

		if (longestMatch !== '') {
			if (longestMatch.includes('常磐森林')) {
				console.log(`Founded at ${tags[i].getAttribute('id')}`);
			}
			tags[i].innerHTML = data_json[longestMatch];
			tags[i].setAttribute('t', longestMatch);
			tags[i].setAttribute('h', h);
			tags[i].setAttribute('v', v);
			tags[i].setAttribute('isname', 'true');
			for (let k = i + 1; k < j; k++) {
				tags[k].remove();
			}
		}
	}
}
let userConfig = { ...DEFAULT_CONFIG };
let currentImageSize = RESIZE_CONSTRAINTS.DEFAULT;
// HELPER FUNCTIONS
const saveToStorage = (key, value) => {
	GM_setValue(key, JSON.stringify(value));
};
const loadFromStorage = (key, defaultValue) => {
	const savedValue = GM_getValue(key);
	return savedValue ? JSON.parse(savedValue) : defaultValue;
};
const clearFromStorage = (key) => {
	GM_deleteValue(key);
};
const createDOMElement = (tag, attributes = {}, styles = {}) => {
	const element = document.createElement(tag);
	Object.assign(element, attributes);
	Object.assign(element.style, styles);
	return element;
};
// DATA FLETCHING AND SETUP
const fetchName = async (url) => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		console.error('Error fetching Pokémon data:', error);
		return null;
	}
};
const fetchPokemonData = async (url) => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching Pokémon data:', error);
		return null;
	}
};
const setupPokemonData = async () => {
	const urls = Object.values(URLS).slice(1, 8);
	const [stats, moves, items, abilities, typeChart, pokeball, teams] =
		await Promise.all(urls.map(fetchPokemonData));

	return [
		{
			data: stats,
			printFunction: printPokemonStats,
			selector: SELECTORS.IMAGE,
		},
		{
			data: moves,
			printFunction: printPokemonMove,
			selector: SELECTORS.MOVE,
		},
		{
			data: items,
			printFunction: printItem,
			selector: SELECTORS.ITEMS,
		},
		{
			data: abilities,
			printFunction: printPokemonAbility,
			selector: SELECTORS.ABILITY,
		},
		{
			data: typeChart,
			printFunction: printPokemonType,
			selector: SELECTORS.TYPE,
		},
		{
			data: pokeball,
			printFunction: printPokeBall,
			selector: SELECTORS.POKEBALL,
		},
		{
			data: teams,
			printFunction: printTeams,
			selector: SELECTORS.TEAM,
		},
	];
};
// UI COMPONENTS
const createButton = ({ label, onClick, styles = {} }) => {
	return createDOMElement(
		'button',
		{
			textContent: label,
			onclick: onClick,
		},
		{
			fontSize: '14px',
			outline: 'none',
			borderRadius: '100%',
			height: '50px',
			width: '50px',
			marginBottom: '10px',
			cursor: 'pointer',
			border: '1px solid #ccc',
			backgroundColor: '#f0f0f0',
			transition: 'background-color 0.3s',
			...styles,
		},
	);
};
const createResizeSlider = () => {
	const dataList = createDOMElement('datalist', { id: 'size-list' }, {});

	for (
		let i = RESIZE_CONSTRAINTS.MIN;
		i <= RESIZE_CONSTRAINTS.MAX;
		i += RESIZE_CONSTRAINTS.STEP
	) {
		const option = createDOMElement('option', { value: i }, {});
		dataList.appendChild(option);
	}

	const slider = createDOMElement(
		'input',
		{
			type: 'range',
			min: RESIZE_CONSTRAINTS.MIN,
			max: RESIZE_CONSTRAINTS.MAX,
			step: RESIZE_CONSTRAINTS.STEP,
			value: currentImageSize,
			oninput: handleSliderChange,
		},
		{
			width: '200px',
			height: '8px',
			borderRadius: '5px',
			outline: 'none',
			marginLeft: '5px',
			appearance: 'auto',
			display: 'flex',
		},
	);
	slider.setAttribute('list', 'size-list');

	const container = createDOMElement('label', { textContent: 'Resize:' });

	container.append(dataList, slider);
	return container;
};
const createConfigMenu = () => {
	const modal = createDOMElement(
		'div',
		{},
		{
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: '1000',
		},
	);

	const menuContent = createDOMElement(
		'div',
		{},
		{
			backgroundColor: 'white',
			padding: '20px',
			borderRadius: '10px',
			maxWidth: '300px',
			width: '90%',
		},
	);

	const title = createDOMElement(
		'h2',
		{ textContent: 'Configuration' },
		{ marginTop: '0', marginBottom: '20px', textAlign: 'left' },
	);
	menuContent.appendChild(title);

	Object.entries(userConfig).forEach(([key, value]) => {
		const label = createDOMElement(
			'label',
			{
				textContent: key
					.replace(/([A-Z])/g, ' $1')
					.replace(/^./, (str) => str.toUpperCase()),
			},
			{ display: 'flex', alignItems: 'center', marginBottom: '10px' },
		);

		const checkbox = createDOMElement(
			'input',
			{
				type: 'checkbox',
				checked: value,
				onchange: (e) => (userConfig[key] = e.target.checked),
			},
			{ appearance: 'auto', marginRight: '10px' },
		);

		label.prepend(checkbox);
		menuContent.appendChild(label);
	});

	const buttonContainer = createDOMElement(
		'div',
		{},
		{
			display: 'flex',
			justifyContent: 'space-between',
			marginTop: '20px',
		},
	);

	const saveButton = createButton({
		label: 'Save',
		onClick: () => {
			saveConfig();
			modal.remove();
			location.reload();
		},
		styles: { borderRadius: '5px', flex: '1', marginRight: '10px' },
	});

	const cancelButton = createButton({
		label: 'Cancel',
		onClick: () => modal.remove(),
		styles: { borderRadius: '5px', flex: '1' },
	});

	buttonContainer.append(saveButton, cancelButton);
	menuContent.appendChild(buttonContainer);
	modal.appendChild(menuContent);

	document.body.appendChild(modal);
};

const namewd = document.querySelector('#namewd');
const handleSaveNameClick = async (e) => {
	try {
		const name = namewd?.value;

		saveToStorage(STORAGE_KEYS.NAME_STV_SAVE, name);

		e.target.textContent = 'Done!';
	} catch (err) {
		e.target.textContent = 'Error!';
	} finally {
		setTimeout(() => {
			e.target.textContent = 'Save Name';
		}, 2000);
	}
};
const handleLoadNameClick = async (e) => {
	try {
		const name = loadFromStorage(STORAGE_KEYS.NAME_STV_SAVE, null);

		if (name) {
			namewd.value = name;
			clickButton('saveNS();excute();');
		}

		e.target.textContent = 'Done!';
	} catch (err) {
		e.target.textContent = 'Error!';
	} finally {
		setTimeout(() => {
			e.target.textContent = 'Load Name';
		}, 2000);
	}
};
const handleClearNameClick = async (e) => {
	try {
		clearFromStorage(STORAGE_KEYS.NAME_STV);

		e.target.textContent = 'Done!';
	} catch (err) {
		e.target.textContent = 'Error!';
	} finally {
		setTimeout(() => {
			e.target.textContent = 'Clear Name';
		}, 2000);
	}
};
const handleGetNameClick = async (e) => {
	try {
		const name = await fetchName(URLS.NAME);

		namewd.value = `\n${name}`;
		clickButton('saveNS();excute();');

		e.target.textContent = 'Done!';
	} catch (err) {
		e.target.textContent = 'Error!';
	} finally {
		setTimeout(() => {
			e.target.textContent = 'Get Name';
		}, 2000);
	}
};
const handleCopyClick = async (e) => {
	try {
		const copyText = namewd?.value || '';
		await navigator.clipboard.writeText(copyText);
		e.target.textContent = 'Copied!';
	} catch (err) {
		e.target.textContent = 'Error!';
	} finally {
		setTimeout(() => {
			e.target.textContent = 'Copy';
		}, 2000);
	}
};
const handleSliderChange = (e) => {
	currentImageSize = e.target.value;
	saveToStorage(STORAGE_KEYS.IMAGE_SIZE, currentImageSize);
	updateImageSizes();
};
//FUNCTIONS
const loadConfig = () => {
	userConfig = loadFromStorage(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
	currentImageSize = loadFromStorage(
		STORAGE_KEYS.IMAGE_SIZE,
		RESIZE_CONSTRAINTS.DEFAULT,
	);
};
const saveConfig = () => {
	saveToStorage(STORAGE_KEYS.CONFIG, userConfig);
};
const setupControlPanel = () => {
	const controlPanel = createDOMElement(
		'div',
		{},
		{
			position: 'fixed',
			bottom: '100px',
			right: '10px',
			display: 'flex',
			alignItems: 'end',
			flexDirection: 'column',
			zIndex: '1',
			width: '0',
		},
	);

	const buttons = [
		// {
		// 	condition: 'getNameButton',
		// 	label: 'Get Name',
		// 	onClick: handleGetNameClick,
		// },
		// {
		// 	condition: 'nameButton',
		// 	label: 'Name',
		// 	onClick: () => clickButton('showNS()'),
		// },
		// {
		// 	condition: 'copyButton',
		// 	label: 'Copy',
		// 	onClick: handleCopyClick,
		// },
		{
			condition: 'reloadButton',
			label: 'Reload',
			// onClick: () => clickButton('excute()'),
			onClick: () => location.reload(),
		},
		{ condition: true, label: 'Config', onClick: createConfigMenu },
	];

	buttons.forEach(({ condition, ...props }) => {
		if (userConfig[condition] || condition === true) {
			controlPanel.appendChild(createButton(props));
		}
	});

	if (userConfig.resizeSlider) {
		controlPanel.appendChild(createResizeSlider());
	}

	const toolbar = document.querySelector('#toolbar');
	toolbar.style.height = 'auto';

	const nameButtonBox = createDOMElement(
		'div',
		{ id: 'toolbar-button' },
		{ clear: 'both' },
	);

	const saveNameButton = createDOMElement(
		'button',
		{
			type: 'button',
			className: 'toolbar',
			textContent: 'Save Name',
			onclick: handleSaveNameClick,
		},
		{
			display: 'inline-block',
			outline: 'none',
			float: 'none',
			width: '80px',
		},
	);

	const loadNameButton = createDOMElement(
		'button',
		{
			type: 'button',
			className: 'toolbar',
			textContent: 'Load Name',
			onclick: handleLoadNameClick,
		},
		{
			display: 'inline-block',
			outline: 'none',
			float: 'none',
			width: '80px',
		},
	);

	const clearNameButton = createDOMElement(
		'button',
		{
			type: 'button',
			className: 'toolbar',
			textContent: 'Clear Name',
			onclick: handleClearNameClick,
		},
		{
			display: 'inline-block',
			outline: 'none',
			float: 'none',
			width: '80px',
		},
	);

	nameButtonBox.append(saveNameButton, loadNameButton, clearNameButton);
	toolbar.appendChild(nameButtonBox);

	document.body.appendChild(controlPanel);
};

const clickButton = (selector) => {
	document.querySelector(`button[onclick='${selector}']`)?.click();
};

const updateImageSizes = () => {
	document.querySelectorAll('.pokemon-image').forEach((image) => {
		image.style.width = `${currentImageSize}px`;
		image.style.height = `${currentImageSize}px`;
	});
};

const fixContentDisplay = () => {
	document.querySelectorAll('i').forEach((tag) => {
		if (/<img|<span/.test(tag.textContent)) {
			tag.innerHTML = tag.textContent;
		}
	});
};
// Pokedex element creation and event handling
const initializePokedex = (pokemonData, notificationManager) => {
	pokemonData.forEach((data) =>
		createPokedexElement({ ...data, notificationManager }),
	);
};

const createPokedexElement = ({
	data,
	selector,
	printFunction,
	notificationManager,
}) => {
	document.querySelectorAll(selector).forEach((target) => {
		const key = target.dataset.pokedex?.trim() || null;
		const pokemonInfo =
			selector === SELECTORS.TYPE ? setupTypeData(key, data) : data[key];
		if (pokemonInfo) {
			const clickTarget =
				selector.includes('move') || selector.includes('ability')
					? createPokemonIcon()
					: target;
			if (clickTarget !== target) {
				target.parentElement.appendChild(clickTarget);
			}
			setupPokedexEventListener({
				target: clickTarget,
				printFunction,
				notificationManager,
				pokemonInfo,
			});
		}
	});
};

const createPokemonIcon = () => {
	const iconElement = document.createElement('span');
	iconElement.className = 'pokemon-icon';
	iconElement.style.cursor = 'pointer';
	iconElement.innerHTML = SVG_CODE;
	return iconElement;
};

const setupPokedexEventListener = ({
	target,
	printFunction,
	notificationManager,
	pokemonInfo,
}) => {
	target.addEventListener('click', (event) => {
		event.stopPropagation();
		resetClickedElements();
		target.classList.add('clicked');
		notificationManager.showNotification(printFunction(pokemonInfo));
	});
};

const resetClickedElements = () => {
	document.querySelector('.clicked')?.classList.remove('clicked');
};

// NOTIFICATION MANAGER
const createNotificationManager = () => {
	const notificationBox = document.createElement('div');

	Object.assign(notificationBox.style, {
		fontFamily: '"Fira Sans", sans-serif',
		position: 'fixed',
		top: '0',
		right: '0',
		margin: '10px',
		padding: '10px',
		backgroundColor: '#fff',
		color: '#404040',
		borderRadius: '5px',
		zIndex: '1000',
		cursor: 'pointer',
		boxShadow:
			'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
	});

	notificationBox.classList.add('notification-pokedex');
	document.body.appendChild(notificationBox);

	document.addEventListener('click', (event) => {
		if (
			notificationBox &&
			notificationBox.classList.contains('show') &&
			!notificationBox.contains(event.target)
		) {
			notificationBox.classList.remove('show');
			resetClickedElements();
		}
	});

	return {
		showNotification: (message) => {
			notificationBox.innerHTML = message;
			notificationBox.classList.add('show');
		},
		hideNotification: () => {
			notificationBox.classList.remove('show');
		},
	};
};

const renderTable = (title, data) => {
	return `
		<table>
			<h2>${title}</h2>
			${Object.entries(data)
				.map(
					([key, value]) => `
					<tr>
						<th>${key}</th>
						<td>${value}</td>
					</tr>
				`,
				)
				.join('')}
		</table>`;
};

function printPokemonStats(pokemon) {
	const abilitiesMap = {
		ability1: 1,
		ability2: 2,
		hidden: '(hidden ability)',
	};

	// Lọc và đếm số abilities không null
	const abilityCount = Object.entries(pokemon.abilities).filter(
		([key, value]) => key !== 'hidden' && value !== null,
	).length;

	const formattedAbilities = Object.entries(pokemon.abilities)
		.filter(([_, value]) => value !== null)
		.map(([key, value]) => {
			let prefix = '';
			if (key === 'hidden') {
				// Đặt prefix là số tiếp theo của các abilities đã đếm
				prefix = `${abilityCount + 1}. `;
			} else {
				// Đặt prefix theo abilitiesMap nếu không phải hidden
				prefix = `${abilitiesMap[key]}. `;
			}
			const suffix = key === 'hidden' ? ` ${abilitiesMap[key]}` : '';
			return `<span class="text-muted">${prefix}</span>${value}<small class="text-muted">${suffix}</small>`;
		})
		.join('<br>');

	const stats = {
		Name: `<strong>${pokemon.name}</strong>`,
		Ndex: `<strong>${pokemon.number.replace('#', '')}</strong>`,
		Type: pokemon.type
			.map(
				(type) =>
					`<span class="${type}"><strong>${type}</strong></span>`,
			)
			.join(', '),
		Abilities: formattedAbilities,
		HP: pokemon.hp,
		Attack: pokemon.attack,
		Defense: pokemon.defense,
		'Sp. Atk': pokemon.spAttack,
		'Sp. Def': pokemon.spDefense,
		Speed: pokemon.speed,
		Total: `<strong>${pokemon.total}</strong>`,
	};

	return renderTable('Pokémon', stats);
}

function printPokemonMove(move) {
	const moveInfo = {
		Name: `<strong>${move.name}</strong>`,
		Type: `<span class="${move.type}"><strong>${move.type}</strong></span>`,
		Category: move.category,
		Power: move.power,
		Accuracy: move.accuracy,
		PP: move.pp,
		Effect: move.effect || 'None',
	};
	return renderTable('Move', moveInfo);
}

function printItem(item) {
	const itemInfo = {
		Image: `<img src="${item.image}" style="display: inline-block; width: 90px;" />`,
		Name: `<strong>${item.name}</strong>`,
		Category: item.category || 'Others',
		Effect: item.effect || 'None',
	};
	return renderTable('Item', itemInfo);
}

function printPokemonAbility(ability) {
	const abilityInfo = {
		Name: `<strong>${ability.name}</strong>`,
		Description: ability.description,
	};
	return renderTable('Ability', abilityInfo);
}

function printPokeBall(pokeball) {
	const pokeballInfo = {
		Image: `<img src="${pokeball.image}" style="display: inline-block; width: 80px; height: 80px;" />`,
		Name: `<strong>${pokeball.name}</strong>`,
		Effect: pokeball.effect,
		Description: pokeball.description,
	};
	return renderTable('Poké Ball', pokeballInfo);
}

function printTeams(team) {
	const teamInfo = {
		Name: team.name,
		'Leader(s)': team.leader.join(', '),
		'Region(s)': team.region.join(', '),
		'Admin(s)': team.admins.join(', '),
		'Base Location(s)': team.base.join(', '),
	};
	return renderTable('Team', teamInfo);
}

function setupTypeData(type, typeChart) {
	const EFFECTIVENESS = {
		NO_EFFECT: 0,
		NOT_VERY_EFFECTIVE: 0.5,
		NEUTRAL: 1,
		SUPER_EFFECTIVE: 2,
	};

	const getTypeEffectiveness = (attackType, typeChart) => {
		const effectiveness = {
			noEffect: [],
			notVeryEffective: [],
			superEffective: [],
		};

		Object.entries(typeChart[attackType]).forEach(
			([defenseType, value]) => {
				if (value === EFFECTIVENESS.NO_EFFECT) {
					effectiveness.noEffect.push(defenseType);
				} else if (value === EFFECTIVENESS.NOT_VERY_EFFECTIVE) {
					effectiveness.notVeryEffective.push(defenseType);
				} else if (value === EFFECTIVENESS.SUPER_EFFECTIVE) {
					effectiveness.superEffective.push(defenseType);
				}
			},
		);

		return effectiveness;
	};

	const getDefenseEffectiveness = (defenseType, typeChart) => {
		const effectiveness = {
			noEffect: [],
			notVeryEffective: [],
			superEffective: [],
		};

		Object.entries(typeChart).forEach(([attackType, values]) => {
			const defenseEffectiveness = values[defenseType];
			if (defenseEffectiveness === EFFECTIVENESS.NO_EFFECT) {
				effectiveness.noEffect.push(attackType);
			} else if (
				defenseEffectiveness === EFFECTIVENESS.NOT_VERY_EFFECTIVE
			) {
				effectiveness.notVeryEffective.push(attackType);
			} else if (defenseEffectiveness === EFFECTIVENESS.SUPER_EFFECTIVE) {
				effectiveness.superEffective.push(attackType);
			}
		});

		return effectiveness;
	};

	return {
		type,
		attackEffectiveness: getTypeEffectiveness(type, typeChart),
		defenseEffectiveness: getDefenseEffectiveness(type, typeChart),
	};
}

function printPokemonType(typeData) {
	const { type, attackEffectiveness, defenseEffectiveness } = typeData;

	const createEffectivenessSection = (iconUrl, title, types) => {
		if (types.length === 0) return '';
		return `
				<p>
					<img class="icon-16" src="${iconUrl}" />
					<span class="icon-string">${title}</span>
				</p>
				<p class="type-list">${types
					.map(
						(t) =>
							`<span class="${t}"><strong>${t}</strong></span>`,
					)
					.join(', ')}</p>
			`;
	};

	const renderAttackEffectiveness = () => {
		const { superEffective, notVeryEffective, noEffect } =
			attackEffectiveness;
		return [
			createEffectivenessSection(
				URLS.TICK_ICON,
				`${type} moves are super-effective against:`,
				superEffective,
			),
			createEffectivenessSection(
				URLS.CROSS_ICON,
				`${type} moves are not very effective against:`,
				notVeryEffective,
			),
			createEffectivenessSection(
				URLS.CROSS_ICON,
				`${type} moves have no effect on:`,
				noEffect,
			),
		].join('');
	};

	const renderDefenseEffectiveness = () => {
		const { noEffect, notVeryEffective, superEffective } =
			defenseEffectiveness;
		return [
			createEffectivenessSection(
				///
				URLS.TICK_ICON,
				`These types have no effect on ${type} Pokémon:`,
				noEffect,
			),
			createEffectivenessSection(
				URLS.TICK_ICON,
				`These types are not very effective against ${type} Pokémon:`,
				notVeryEffective,
			),
			createEffectivenessSection(
				URLS.CROSS_ICON,
				`These types are super-effective against ${type} Pokémon:`,
				superEffective,
			),
		].join('');
	};

	return `
			<div>
				<h2>Attack <i class="text-muted">pros &amp; cons</i></h2>
				${renderAttackEffectiveness()}
				<h2>Defense <i class="text-muted">pros &amp; cons</i></h2>
				${renderDefenseEffectiveness()}
			</div>
		`;
}

try {
	const response = await fetch(URLS.NAME_JSON);
	const data = await response.json();
	DATrie.insertFromJSON(data);
	await sleep(3000);
	console.clear();
	const tags = GetAllElements('.contentbox > i');
	processTags(tags, DATrie, data);
} catch (error) {
	console.error(error);
}

const init = async () => {
	const notificationManager = createNotificationManager();
	const pokemonData = await setupPokemonData();

	loadConfig();
	setupControlPanel();
	fixContentDisplay();
	updateImageSizes();

	initializePokedex(pokemonData, notificationManager);
};
setTimeout(init, 1000);
