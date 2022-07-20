
const Contact = require('./contacts.schema')

const listContacts = async () => {
  return await Contact.find()
}

const getContactById = async (contactId) => {
    return Contact.findOne({ _id: contactId })
}

const removeContact = async (contactId) => {
    return Contact.deleteOne({_id: contactId})
}

const addContact = async (body) => {
    return Contact.create(body)
}

const updateContact = async (contactId, body) => {
    return Contact.findOneAndUpdate({_id: contactId}, body)
}

const updtFavoriteOption = async (contactId, body) => {
    return Contact.findOneAndUpdate({_id: contactId}, body)
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updtFavoriteOption
}
