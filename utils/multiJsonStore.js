// utils/multiJsonStore.js
const fs = require('fs').promises;
const path = require('path');

const storeDir = path.join(__dirname, '..', 'data');

// simple per-file in-process mutexes
class Mutex {
  constructor(){ this.locked = false; this.waiters = []; }
  lock(){
    return new Promise(resolve => {
      if (!this.locked) {
        this.locked = true;
        resolve(this._unlock.bind(this));
      } else {
        this.waiters.push(resolve);
      }
    });
  }
  _unlock(){
    if (this.waiters.length > 0) {
      const next = this.waiters.shift();
      next(this._unlock.bind(this));
    } else {
      this.locked = false;
    }
  }
}
const mutexMap = new Map();

function getMutexFor(file) {
  if (!mutexMap.has(file)) mutexMap.set(file, new Mutex());
  return mutexMap.get(file);
}

async function ensureDir(){
  try { await fs.mkdir(storeDir, { recursive: true }); } catch(e){}
}

function sanitizeName(name){
  // allow only alphanumeric, dash, underscore; prevent path traversal
  if (!name || typeof name !== 'string') throw new Error('Invalid name');
  const ok = /^[a-zA-Z0-9_-]+$/.test(name);
  if (!ok) throw new Error('Invalid file name (allowed: a-zA-Z0-9_- )');
  return name;
}

function filePathFor(name){
  const safe = sanitizeName(name);
  return path.join(storeDir, `${safe}.json`);
}

// read generic JSON file, return defaultValue if missing
async function readJsonFile(name, defaultValue = null) {
  await ensureDir();
  const fp = filePathFor(name);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    if (!raw || raw.trim().length === 0) {
      return defaultValue;
    }
    try {
      return JSON.parse(raw);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return defaultValue;
      }
      throw err;
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return defaultValue;
    }
    throw err;
  }
}

// write generic JSON atomically (tmp -> rename) with optional maxBytes check
async function writeJsonFile(name, data, { maxBytes = 10 * 1024 * 1024 } = {}) {
  await ensureDir();
  const fp = filePathFor(name);
  const tmp = fp + '.tmp';
  const str = JSON.stringify(data, null, 2);
  if (maxBytes && Buffer.byteLength(str, 'utf8') > maxBytes) {
    throw new Error('Payload too large');
  }
  await fs.writeFile(tmp, str, 'utf8');
  await fs.rename(tmp, fp);
}

// high-level locked write helper
async function withFileLock(name, fn) {
  const mutex = getMutexFor(name);
  const release = await mutex.lock();
  try {
    const result = await fn();
    return result;
  } finally {
    release();
  }
}

module.exports = {
  readJsonFile,
  writeJsonFile,
  withFileLock,
  filePathFor,
};
