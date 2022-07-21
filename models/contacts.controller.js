const service = require('./contacts.service')

const getAll = async (req, res, next) => {
    try {
      const allContacts = service.listContacts;
    res.json(await allContacts().then(data=>{return data})) 
    } catch (error) {
      console.error(error)
      next(error)
    }
}

const getById = async (req, res, next) => {
  const {contactId} = req.params
try {
  const contact = await service.getContactById(contactId).then(data=>{return data})
  if (contact) {
    res.json(contact) 
  } else {
    res.status(404).json({message: `Not found contact with id: ${contactId}`})
  }
  
} catch (error) {
  res.status(404).json({error: `incorrect value ${contactId}`})
  next(error)
}
}

const postOne = async (req, res, next) => {
  const { name, email, phone } = req.body
  try {
    const result = await service.addContact({ name, email, phone })

    res.status(201).json(result)
  } catch (error) {
    console.error(error)
    next(error)
  }
};
const deleteById = async (req, res, next) => {
  const {contactId} = req.params
  try {
    const contact = await service.removeContact(contactId).then(data=>{return data})
    if (contact) {
      res.json(contact) 
    } else {
      res.status(404).json({message: `Not found contact with id: ${contactId}`})
    }
    
  } catch (error) {
    res.status(404).json({error: `incorrect value ${contactId}`})
    next(error)
  }
};
const putOne = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const {contactId} = req.params
  try {
    const result = await service.updateContact(contactId, { name, email, phone })

    res.status(201).json({message: `sucess, ${result._id} is updated`})
  } catch (error) {
    console.error(error)
    next(error)
  }
};

const patchOne = async (req, res, next) => {
  const {contactId} = req.params
  try {
    const contact = await service.getContactById(contactId).then(data=>{return data})
    const result = await service.updtFavoriteOption(contactId, { favorite: !contact.favorite })

    res.status(200).json({message: `sucess, ${result._id} is now ${contact.favorite ? `not in favorite` : `in favorite`}`})
  } catch (error) {
    res.status(404).json({error: `incorrect value ${contactId}`})
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  postOne,
  deleteById,
  putOne,
  patchOne
}