import { db } from "./dbConnect.js";
const coll = db.collection('candy');

const toArray = (collection) => collection.docs.map(doc => ({ id: doc.id, ...doc.data() }));

export async function getAllCandy(req, res) {
  try {
    const allCandy = await coll.get();
    res.send(toArray(allCandy));
  } catch(err) {
    res.status(500).send(err);
  }
}

export async function addNewCandy(req, res) {
  try {
    const newCandy = req.body;
    if(!newCandy.name || !newCandy.price || !newCandy.size) {
      res.status(401).send({ success: false, message: 'Required fields missing' })
      return
    }
    await coll.add(newCandy);
    getAllCandy(req, res);
  } catch(err) {
    res.status(500).send(err);
  }
}

export async function updateCandyById(req, res) {
  try {
    // const candyId = req.params.candyId
    const { candyId } = req.params; // which candy are we changing
    const updatedInfo = req.body; // what changes are we making (e.g. { price: 2.99 })
    await coll.doc(candyId).update(updatedInfo); // update the doc with new info
    getAllCandy(req, res);
  } catch(err) {
    res.status(500).send(err);
  }
}
