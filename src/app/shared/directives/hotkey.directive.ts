import { Directive, ElementRef, HostListener } from '@angular/core';

const VALID = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	"F1",
	"F2",
	"F3",
	"F4",
	"F5",
	"F6",
	"F7",
	"F8",
	"F9",
	"F10",
	"F11",
	"F12",
	"F13",
	"F14",
	"F15",
	"F16",
	"F17",
	"F18",
	"F19",
	"F20",
	"F21",
	"F22",
	"F23",
	"F24",
	"`",
	"~",
	"!",
	"@",
	"#",
	"$",
	"%",
	"^",
	"&",
	"*",
	"(",
	")",
	"-",
	"_",
	"=",
	"+",
	"[",
	"{",
	"]",
	"}",
	";",
	":",
	"'",
	"\"",
	",",
	"<",
	".",
	">",
	"/",
	"?",
	"Space",
	"Capslock",
	"Numlock",
	"Scrolllock",
	"Delete",
	"Insert",
	"Enter",
	"Up",
	"Right",
	"Down",
	"Left",
	"Home",
	"End",
	"PageUp",
	"PageDown",
	"Escape",
	"VolumeUp",
	"VolumeDown",
	"VolumeMute",
	"MediaNextTrack",
	"MediaPreviousTrack",
	"MediaStop",
	"MediaPlayPause",
	"PrintScreen",
	"num0",
	"num1",
	"num2",
	"num3",
	"num4",
	"num5",
	"num6",
	"num7",
	"num8",
	"num9",
	"numdec",
	"numadd",
	"numsub",
	"nummult",
	"numdiv",
];
const SPECIAL = {
	"CapsLock": "Capslock",
	"NumLock": "Numlock",
	"ScrollLock": "Scrolllock",
	"Control": "Ctrl",
	"Meta": "Super",
	" ": "Space",
	"ArrowUp": "Up",
	"ArrowRight": "Right",
	"ArrowDown": "Down",
	"ArrowLeft": "Left",
	"MediaTrackNext": "MediaNextTrack",
	"MediaTrackPrevious": "MediaPreviousTrack",
	"AudioVolumeUp": "VolumeUp",
	"AudioVolumeDown": "VolumeDown",
	"AudioVolumeMute": "VolumeMute",
	"Decimal": "numdec",
	"Add": "numadd",
	"Subtract": "numsub",
	"Divide": "numdiv",
	"Multiply": "nummult",
};
const MODIFIERS = [
	"Control",
	"Alt",
	"Shift",
	"Super",
	"Meta",
];


@Directive({
	selector: 'input[type=text][appHotkey]'
})
export class HotkeyDirective {

	constructor(private input: ElementRef) {}

	@HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent): boolean {
		let key = (event.key in SPECIAL) ? SPECIAL[event.key] : event.key;
		if (/^[a-z]$/.test(key)) key = key.toUpperCase();
		if (key !== "Tab") {
			let hotkey = "";
			if (key === "Backspace") this.input.nativeElement.value = "";
			hotkey += event.shiftKey ? "Shift+" : "";
			hotkey += event.ctrlKey ? "Ctrl+" : "";
			hotkey += event.altKey ? "Alt+" : "";
			hotkey += event.metaKey ? "Super+" : "";
			if (!MODIFIERS.includes(key) && VALID.includes(key)) hotkey += key;
			if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) this.input.nativeElement.value = hotkey;
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
		return true;
	}
}
