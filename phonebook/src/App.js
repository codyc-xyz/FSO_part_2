import { useState, useEffect } from 'react'
import Contacts from './Components/Contacts'
import contactService from './services/contacts'
import AddContact from './Components/AddContact'
import SearchField from './Components/SearchField'
import Notification from './Components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    contactService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)})}, [])
  
  const addContact = (event) => {
    event.preventDefault()
    const nameAlreadyExists = persons.some(person => person.name === newName)
    if (nameAlreadyExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(n => n.name === newName)
        const id = person.id
        const changedPerson = {...person, number: newNumber}
        contactService
        .update(id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
        })
        return
      }   
    }
    const nameObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(nameObject))
    
    contactService
    .create(nameObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))})

    setNewName('')
    setNewNumber('')
  }

  const removeContact = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
    contactService.remove(id).then(() => {
    setPersons(persons.filter(person => person.id !== id))
    })
  }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification/>
      <SearchField value={searchTerm} onChange={handleSearch}/>
      <AddContact newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addContact={addContact}/>
      <Contacts filteredPersons={filteredPersons} removeContact={removeContact}/>
    </div>
  )
}

export default App