import { consts } from '../actions/contactsActions'
import { constsss } from '../actions/addContact'
import { constss } from '../actions/searchContact'
import { constsEdit } from '../actions/editContact'
import { constsStars } from '../actions/mainStarActions'

const initial = {
  contacts: [],
  // id: [],
  fetch: false,
}

export default function reducer(state = initial, action) {
  switch (action.type) {
    case consts.GET_CONTACTS: {
      return {
        ...state,
        contacts: action.payload,
        fetch: action.status === 200 ? true : false
      }
    }
    // case consts.GET_ID: {
    //   return {
    //     ...state,
    //     id: action.payload
    //   }
    // }
    case constss.SEARCH_CONTACT: {
      return {
        ...state,
        contacts: action.payload
      }
    }
    case constsss.ADD_CONTACT: {
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        addContactStatus: action.status
      }
    }
    case constsEdit.EDIT_CONTACT: {
      let {contacts} = state;
      contacts = contacts.map(contact => {
        if(contact.id == action.payload.id) {
          contact = action.payload;
        }
        return contact;
      })
      return {
        ...state,
        contacts
      }
    }
    case constsStars.PHONE_START: {
      let {contacts} = state;
      // console.log('REDUCER', action.payload)
      contacts = contacts.map(contact => {
        
        if(contact.id == action.payload.id) {
          contact = action.payload;
        }
        return contact;
      })
      return {
        ...state,
        contacts
      }
    }
    default:
    return state
  }
}