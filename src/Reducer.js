/* global BigInt */

const randojs = require("@nastyox/rando.js");
const rando = randojs.rando;

export const initialState = {
  p: "0",
  q: "0",
  n: "0",
  phi: "0",
  e: "0",
  d: "0",
  cipher: "",
  message: "",
  errorbag: [],
};

const power = (a, b, n) => {
  [a, b, n] = [BigInt(a), BigInt(b), BigInt(n)];
  let res = BigInt(1);
  a %= n;
  while (b > BigInt(0)) {
    if (b & BigInt(1)) res = (res * a) % n;
    b >>= BigInt(1);
    a = (a * a) % n;
  }
  return res;
};

function modInverse(a, m) {
  [a, m] = [BigInt(a), BigInt(m)];

  a = ((a % m) + m) % m;
  if (!a || m < BigInt(2)) {
    return NaN; // invalid input
  }
  // find the gcd
  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== BigInt(1)) {
    return NaN; // inverse does not exists
  }
  // find the inverse
  let x = BigInt(1);
  let y = BigInt(0);
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * (s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}

const millerTest = (d, n) => {
  [d, n] = [BigInt(d), BigInt(n)];
  const a =
    BigInt(2) +
    (BigInt(rando(100000000, 10000000000000000000000)) % (n - BigInt(4)));
  let p = power(a, d, n);
  if (p === BigInt(1) || p === n - BigInt(1)) return true;

  while (d !== n - BigInt(1)) {
    p = (p * p) % n;
    d *= BigInt(2);

    if (p === BigInt(1)) return false;

    if (p === n - BigInt(1)) return true;
  }
  return false;
};

const checkPrime = (n) => {
  n = BigInt(n);

  if (n <= BigInt(1) || n === BigInt(4)) return false;
  if (n <= BigInt(3)) return true;
  let d = n - BigInt(1);

  while (d % BigInt(2) === BigInt(0)) d /= BigInt(2);
  for (var i = 0; i < 2000; ++i) {
    if (!millerTest(d, n)) return false;
  }
  return true;
};

const gcd = (a, b) => {
  [a, b] = [BigInt(a), BigInt(b)];
  if (a === BigInt(0)) return b;
  if (b === BigInt(0)) return a;
  return gcd(b, a % b);
};

const encryptMessage = (message, e, n, phi) => {
  [e, n] = [BigInt(e), BigInt(n)];

  if (e <= BigInt(1) || e >= BigInt(phi)) return "";
  if (n <= BigInt(127)) return "";

  const cipher = [];

  for (var i = 0; i < message.length; ++i) {
    const character = BigInt(message.charCodeAt(i));
    const encrypted = power(character, e, n);
    cipher.push(encrypted.toString());
  }
  return String.fromCharCode(...cipher);
};

const decryptCipher = (cipher, d, n) => {
  [d, n] = [BigInt(d), BigInt(n)];

  if (d <= BigInt(0)) return "";
  if (n <= BigInt(127)) return "";

  const originalMessage = [];

  for (var i = 0; i < cipher.length; ++i) {
    const character = BigInt(cipher.charCodeAt(i));
    const decrypted = power(character, d, n);
    originalMessage.push(decrypted.toString());
  }
  return String.fromCharCode(...originalMessage);
};

const reducer = (state, action) => {
  console.log(action);
  console.log(state);
  switch (action.type) {
    case "SET_P_AND_Q": {
      const p = BigInt(action.item.p);
      const q = BigInt(action.item.q);
      if (!checkPrime(p) || !checkPrime(q)) {
        return {
          ...state,
          errorbag: [{ message: "P and Q should be prime numbers." }],
        };
      }
      if (p * q <= 127) {
        return {
          ...state,
          errorbag: [{ message: "P * Q is less than 127." }],
        };
      }
      const n = p * q;
      const phi = (p - BigInt(1)) * (q - BigInt(1));
      return {
        ...state,
        p: p.toString(),
        q: q.toString(),
        n: n.toString(),
        phi: phi.toString(),
        errorbag: [],
      };
    }
    case "SET_E": {
      const e = BigInt(action.item.e);

      if (e <= 1 || e >= BigInt(state.phi)) {
        return {
          ...state,
          errorbag: [
            { message: "e must be greater than 1 and less than phi." },
          ],
        };
      }

      if (gcd(e, state.phi) !== BigInt(1)) {
        return {
          ...state,
          errorbag: [{ message: "The gcd of e and phi is not 1." }],
        };
      }

      const d = BigInt(modInverse(e, state.phi));

      return {
        ...state,
        e: e.toString(),
        d: d.toString(),
        errorbag: [],
      };
    }
    case "Encrypt": {
      const message = action.item.message;
      const cipher = encryptMessage(message, state.e, state.n, state.phi);

      console.log(cipher);

      return {
        ...state,
        cipher,
        errorbag: [],
      };
    }
    case "Decrypt": {
      const cipher = action.item.cipher;
      const message = decryptCipher(cipher, state.d, state.n);

      return {
        ...state,
        message,
        errorbag: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;
