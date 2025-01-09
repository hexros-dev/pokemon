export const URLS = {
	NAME: 'https://raw.githubusercontent.com/hexros-dev/pokemon/main/names.txt',
	STATS: 'https://raw.githubusercontent.com/hexros-dev/pokemon/main/pokemon-stats.json',
	MOVES: 'https://raw.githubusercontent.com/hexros-dev/pokemon/main/pokemon-moves.json',
	ITEMS: 'https://raw.githubusercontent.com/hexros-dev/pokemon/main/items.json',
	ABILITIES:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/pokemon-abilities.json',
	TYPE_CHART:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/pokemon-type-chart.json',
	POKEBALL:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/pokeball.json',
	TEAM: 'https://raw.githubusercontent.com/hexros-dev/pokemon/main/teams.json',
	TICK_ICON:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/images/icons/tick-16.png',
	CROSS_ICON:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/images/icons/cross-16.png',
	NAME_JSON:
		'https://raw.githubusercontent.com/hexros-dev/pokemon/main/names.json',
};
//
export const CATEGORY_STYLE = {
	Physical: 'https://img.pokemondb.net/images/icons/move-physical.png',
	Special: 'https://img.pokemondb.net/images/icons/move-special.png',
	Status: 'https://img.pokemondb.net/images/icons/move-status.png',
	None: '',
};
//
export const TYPE_STYLE = {
	Normal: '#9fa19f',
	Fighting: '#ff8000',
	Flying: '#81b9ef',
	Poison: '#9141cb',
	Ground: '#915121',
	Rock: '#afa981',
	Bug: '#91a119',
	Ghost: '#704170',
	Steel: '#60a1b8',
	Fire: '#e62829',
	Water: '#2980ef',
	Grass: '#3fa129',
	Electric: '#fac000',
	Psychic: '#ef4179',
	Ice: '#3fd8ff',
	Dragon: '#5060e1',
	Dark: '#50413f',
	Fairy: '#ef70ef',
};
//
export const RESIZE_CONSTRAINTS = {
	MIN: 40,
	MAX: 200,
	STEP: 20,
	DEFAULT: 80,
};
//
export const STORAGE_KEYS = {
	CONFIG: 'controlPanelConfig',
	IMAGE_SIZE: 'imageSize',
	NAME_STV_SAVE: 'nameSave',
};
//
export const DEFAULT_CONFIG = {
	getNameButton: true,
	nameButton: true,
	copyButton: true,
	reloadButton: true,
	resizeSlider: true,
};
//
export const SELECTORS = {
	IMAGE: '.pokemon-image',
	MOVE: '.pokemon-move',
	ITEMS: '.items',
	ABILITY: '.pokemon-ability',
	TYPE: '.pokemon-type',
	POKEBALL: '.pokemon-ball',
	TEAM: '.teams',
};
//
export const ICON_COLOR = '#a8a8a8';
//
export const SVG_CODE = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
		<g id="icomoon-ignore" />
		<path
			fill="${ICON_COLOR}"
			d="M15.803 4.567c-1.68 0.192 -3.71 0.892 -5.215 1.768 -1.47 0.858 -3.955 3.308 -4.795 4.76 -0.787
			1.313 -1.575 3.57 -1.715 4.865l-0.105 1.015h8.732l0.402 -0.963c0.49 -1.173 1.768 -2.38 2.94 -2.783
			1.365 -0.472 2.643 -0.368 3.92 0.298 1.19 0.613 2.258 1.785 2.555 2.817l0.158 0.542 4.147 0.052C31.605
			16.992 31.185 17.22 30.625 14.875c-1.61 -6.668 -8.015 -11.113 -14.822 -10.307"
		/>
		<path
			fill="${ICON_COLOR}"
			d="M16.293 15.61c-1.015 0.682 -1.33 1.26 -1.33 2.415s0.315 1.733 1.33 2.415c1.19 0.823 3.255 0.263
			3.955 -1.067 0.63 -1.208 0.245 -2.87 -0.858 -3.64 -0.84 -0.613 -2.328 -0.665 -3.097 -0.122"
		/>
		<path
			fill="${ICON_COLOR}"
			d="M4.078 20.09c0.14 1.295 0.927 3.553 1.715 4.865 0.84 1.453 3.325 3.902 4.795 4.76C18.41 34.3
			28.508 29.995 30.625 21.175c0.56 -2.345 0.98 -2.117 -3.797 -2.065l-4.13 0.052 -0.245 0.718c-0.333
			0.998 -1.225 1.995 -2.345 2.607 -0.84 0.472 -1.103 0.525 -2.433 0.525 -1.19 0 -1.627 -0.088 -2.188
			-0.385 -0.927 -0.49 -2.117 -1.785 -2.537 -2.765l-0.333 -0.787H3.973z"
		/>
	</svg>`;
