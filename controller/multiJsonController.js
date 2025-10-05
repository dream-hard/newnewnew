// controllers/multiJsonController.js
const { Product, Currency, Product_image, Category } = require('../models');
const { readJsonFile, writeJsonFile, withFileLock, filePathFor } = require('../utils/multiJsonStore');
const path = require('path')/**
 * GET /api/json/:name
 * return whole file content (or {} / [] default)
 * query param: default=array|object (choose default type)
 */
exports.getFile = async (req, res) => {
  try {
    const name = req.params.name;
    const defType = req.query.default === 'array' ? [] : {};
    const data = await readJsonFile(name, defType);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/json/:name/replace
 * body: <any json>  -> replace whole file
 */


// Controller: fetch products from JSON file
exports.fetchProductsFromJson = async (req, res) => {
  try {
    const fileName = req.params.fileName; // e.g., categories.json
    const data =await readJsonFile(fileName);
    const result = {};

    const values = Object.values(data);

    const hasCategories = values.every(v => Array.isArray(v));

    if (hasCategories) {
      // كل category fetch المنتجات
      for (const [catKey, arr] of Object.entries(data)) {
        const ids = arr.map(obj => Object.values(obj)[0]); // ناخد UUID
        const products = await Product.findAll({
          where: { uuid: ids },
          raw: true,
        });
        // const products={};
        // ترتيب حسب ids
        const byId = new Map(products.map(p => [p.uuid, p]));
        const ordered = ids.map(id => byId.get(id)).filter(Boolean);

        result[catKey] = ordered;
      }
    } else {
      // بدون categories، كل keys -> fetch
      const ids = Object.keys(data);
      const products = await Product.findAll({
        where: { uuid: ids },
        raw: true,
      });
      for (const key of ids) {
        const p = products.find(pr => pr.uuid === key);
        if (p) result[key] = p;
      }
    }
    
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

async function getCategoryInfoFromDB(catKey) {
  
  try {
    const where = {
      slug:catKey
    };
    // pick some useful attributes (adjust as your model fields)
    const cat = await Category.findOne({
      where,
      attributes: [ 'display_name','name', 'slug'],
      raw: true
    });
    return cat || null;
  } catch (err) {
    // if anything goes wrong, just return null (we'll fallback to JSON meta)
    return null;
  }
}
exports.fetchProductsFromJsonWithCategoryInfo = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ ok: false, error: 'fileName required in route' });
    }

    const data = await readJsonFile(fileName, {});
    let result = {};
    const values = Object.values(data);
    const hasCategories = values.length > 0 && values.every(v => Array.isArray(v));

    if (hasCategories) {
      // For each category key (catKey -> array of {someKey: uuid} )
      for (const [catKey, arr] of Object.entries(data)) {
        // extract ids: support array of objects like { id1: "uuid" } or raw uuids
        const ids = arr.map(item => {
          if (!item) return null;
          if (typeof item === 'string') return item;
          // take the first value in the object
          const vals = Object.values(item);
          return vals.length ? vals[0] : null;
        }).filter(Boolean);

        // fetch products in a single query
        const products = ids.length
          ? await Product.findAll({ where: { uuid: ids ,softdelete:false},include:[
            {model:Category },
            {model: Currency, attributes: ["currency_iso", "symbol"] },
            {model: Product_image, attributes: ["filename" ],where:{image_type:"main"}}] })
          : [];

        // reorder according to ids
        const byId = new Map(products.map(p => [String(p.uuid), p]));
        const orderedProducts = ids.map(id => byId.get(String(id))).filter(Boolean);

        // get category info: DB first, then file fallback
        let info = await getCategoryInfoFromDB(catKey);
        if (!info) info = catKey;

        // attach
        result[catKey] = {
          category: info || null,
          products: orderedProducts
        };
      }
    } else {

      // flat object: keys are uuids or keys->values: we will fetch by keys
          const ids = Object.values(data);
          const products = ids.length
          ? await Product.findAll({ where: { uuid: ids ,softdelete:false},include:[
            {model:Category,attributes:["slug","display_name"]},
            {model: Currency, attributes: ["currency_iso", "symbol"] },
            {model: Product_image, attributes: ["filename" ],where:{image_type:"main"}}] })
          : [];

        
      // map each key -> product (if exists)
          const byId = new Map(products.map(p => [String(p.uuid), p]));
        const orderedProducts = ids.map(id => byId.get(String(id))).filter(Boolean);
      result['products']=orderedProducts;
      
    }

    res.json({ ok: true,data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
exports.checkifexist=async(req,res)=>{
    try {
      const fileName=req.params.fileName;
        if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ ok: false, error: 'fileName required in route' });
        }
          const data = (await readJsonFile(fileName, {})) || {};
          const values = Object.values(data);

      if( Object.keys(data).length===0){
        
        return res.json({success:true,result:false});
      }
      res.status(200).json({success:true,result:true});
    } catch (error) {
      res.status(500).json({error:error.message});
    }
}

exports.replaceFile = async (req, res) => {
  try {
    const name = req.params.name;
    const incoming = req.body;
    if (incoming === undefined) return res.status(400).json({ error: 'body required' });

    await withFileLock(name, async () => {
      await writeJsonFile(name, incoming);
    });

    res.json({ ok: true, name, data: incoming });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/json/:name/merge
 * used when file is object and you want to shallow-merge: body = { key: value, ... }
 * if file is array this will push items (if body is array)
 */
exports.mergeFile = async (req, res) => {
  try {
    const name = req.params.name;
    const incoming = req.body;
    if (incoming === undefined) return res.status(400).json({ error: 'body required' });

    const result = await withFileLock(name, async () => {
      const cur = await readJsonFile(name, typeof incoming === 'object' && !Array.isArray(incoming) ? {} : []);
      let updated;
      if (Array.isArray(cur) && Array.isArray(incoming)) {
        // append unique items
        const set = new Set(cur.map(String));
        const add = incoming.filter(i => !set.has(String(i)));
        updated = cur.concat(add);
      } else if (!Array.isArray(cur) && !Array.isArray(incoming)) {
        updated = { ...cur, ...incoming };
      } else {
        throw new Error('Cannot merge array with object');
      }
      await writeJsonFile(name, updated);
      return updated;
    });

    res.json({ ok: true, name, data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/json/:name/clear
 * clears the file to empty array/object. Query default= array|object
 */
exports.clearFile = async (req, res) => {
  try {
    const name = req.params.name;
    const def = req.query.default === 'array' ? [] : {};
    await withFileLock(name, async () => {
      await writeJsonFile(name, def);
    });
    res.json({ ok: true, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/json/:name/item/add
 * For files that are arrays: body: { item, pos? } -> append or insert
 */
exports.addItem = async (req, res) => {
  try {
    const name = req.params.name;
    const item = req.body && req.body.item;
    const pos = req.body && req.body.pos;
    if (item === undefined) return res.status(400).json({ error: 'item required' });

    const updated = await withFileLock(name, async () => {
      const arr = await readJsonFile(name, []);
      if (!Array.isArray(arr)) throw new Error('target file is not an array');
      const copy = arr.slice();
      if (pos !== undefined && Number.isInteger(pos) && pos >= 0 && pos <= copy.length) {
        copy.splice(pos, 0, item);
      } else {
        copy.push(item);
      }
      await writeJsonFile(name, copy);
      return copy;
    });

    res.json({ ok: true, name, data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/json/:name/item/remove
 * For arrays: body { predicate } where predicate is simple equality object { key: value } or index
 * or body { index: 2 } to remove by index
 */
exports.removeItem = async (req, res) => {
  try {
    const name = req.params.name;
    const index = req.body && req.body.index;
    const predicate = req.body && req.body.predicate; // { key: value }

    const updated = await withFileLock(name, async () => {
      const arr = await readJsonFile(name, []);
      if (!Array.isArray(arr)) throw new Error('target file is not an array');
      let copy = arr.slice();
      let removed;
      if (index !== undefined) {
        if (!Number.isInteger(index) || index < 0 || index >= copy.length) throw new Error('invalid index');
        removed = copy.splice(index, 1);
      } else if (predicate && typeof predicate === 'object') {
        const [k, v] = Object.entries(predicate)[0] || [];
        const idx = copy.findIndex(item => item && item[k] == v);
        if (idx === -1) throw new Error('no matching item found');
        removed = copy.splice(idx, 1);
      } else {
        throw new Error('provide index or predicate');
      }
      await writeJsonFile(name, copy);
      return { arr: copy, removed: removed[0] };
    });

    res.json({ ok: true, name, ...updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
