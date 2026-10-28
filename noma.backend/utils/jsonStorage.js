import fs from 'fs/promises';
import path from 'path';
import { AsyncLocalStorage } from 'async_hooks';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const FILES = {
  internships: path.join(DATA_DIR, 'internships.json'),
  resumes: path.join(DATA_DIR, 'resumes.json'),
  tracked: path.join(DATA_DIR, 'tracked.json'),
  tweaked: path.join(DATA_DIR, 'tweaked.json'),
};

/**
 * Each browser sends its own client id. Internships are shared; resumes,
 * the tracker and AI analyses live in a folder per client, so visitors of
 * the hosted demo never see each other's data. Without an id (local use)
 * everything stays in the top-level files as before.
 */
const SHARED = new Set(['internships']);
const clientContext = new AsyncLocalStorage();

export const runWithClient = (clientId, fn) => clientContext.run(clientId, fn);
export const currentClient = () => clientContext.getStore() ?? null;

export const clientDir = (base) => {
  const id = currentClient();
  return id ? path.join(base, 'clients', id) : base;
};

const fileFor = (type) => {
  const file = FILES[type];
  if (!file || SHARED.has(type) || !currentClient()) return file;
  return path.join(clientDir(DATA_DIR), `${type}.json`);
};

/**
 * Initialize storage directory
 */
export const initStorage = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Create empty files if they don't exist
    for (const [key, filePath] of Object.entries(FILES)) {
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
        console.log(`📝 Created ${key}.json`);
      }
    }
    
    console.log('✅ Storage initialized');
  } catch (error) {
    console.error('❌ Storage init error:', error);
  }
};

/**
 * Read data from JSON file
 */
export const readData = async (type) => {
  try {
    const filePath = fileFor(type);
    if (!filePath) {
      throw new Error(`Unknown data type: ${type}`);
    }

    const content = await fs.readFile(filePath, 'utf-8').catch((e) => (e.code === 'ENOENT' ? '[]' : Promise.reject(e)));
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${type}:`, error.message);
    return [];
  }
};

/**
 * Write data to JSON file
 */
export const writeData = async (type, data) => {
  try {
    const filePath = fileFor(type);
    if (!filePath) {
      throw new Error(`Unknown data type: ${type}`);
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${type}:`, error.message);
    return false;
  }
};

/**
 * Add item to collection
 */
export const addItem = async (type, item) => {
  const data = await readData(type);
  data.push(item);
  await writeData(type, data);
  return item;
};

/**
 * Update item in collection
 */
export const updateItem = async (type, id, updates) => {
  const data = await readData(type);
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  data[index] = { ...data[index], ...updates };
  await writeData(type, data);
  return data[index];
};

/**
 * Delete item from collection
 */
export const deleteItem = async (type, id) => {
  const data = await readData(type);
  const filtered = data.filter(item => item.id !== id);
  
  if (filtered.length === data.length) {
    return false; // Item not found
  }
  
  await writeData(type, filtered);
  return true;
};

/**
 * Find item by ID
 */
export const findById = async (type, id) => {
  const data = await readData(type);
  return data.find(item => item.id === id);
};

/**
 * Find items by query
 */
export const findItems = async (type, query = {}) => {
  const data = await readData(type);
  
  if (Object.keys(query).length === 0) {
    return data;
  }
  
  return data.filter(item => {
    return Object.entries(query).every(([key, value]) => {
      return item[key] === value;
    });
  });
};

/**
 * Clear all data (useful for testing)
 */
export const clearData = async (type) => {
  await writeData(type, []);
  console.log(`🗑️  Cleared ${type} data`);
};

/**
 * Get data stats
 */
export const getStats = async () => {
  const stats = {};
  
  for (const [key, filePath] of Object.entries(FILES)) {
    const data = await readData(key);
    stats[key] = {
      count: data.length,
      file: filePath,
    };
  }
  
  return stats;
};


