function cp(...codes) {
  return String.fromCodePoint(...codes);
}

const markerChars = [
  cp(196), // U+00C4
  cp(197), // U+00C5
  cp(313), // U+0139
  cp(258), // U+0102
  cp(194), // U+00C2
  cp(65533), // U+FFFD
  cp(195), // U+00C3
  cp(226, 8364), // U+00E2 U+20AC
];

const mojibakeWords = {
  blad: cp(66, 313, 8218, 196, 8230, 100),
  otworz: cp(79, 116, 119, 258, 322, 114, 122),
  zrodlo: cp(197, 185, 114, 258, 322, 100, 322, 111),
  cyklicznosc: cp(67, 121, 107, 108, 105, 99, 122, 110, 111, 313, 8250, 196, 8225),
};

module.exports = { cp, markerChars, mojibakeWords };
