import { consts } from '../actions/contactsActions'
import { constsss } from '../actions/addContact'
import { constss } from '../actions/searchContact'

const initial = {
  contacts: [],
  id: [],
}

export default function reducer(state = initial, action) {
  switch (action.type) {
    case consts.GET_CONTACTS: {
      return {
        ...state,
        contacts: action.payload
      }
    }
    case consts.GET_ID: {
      return {
        ...state,
        id: action.payload
      }
    }
    case constss.SEARCH_CONTACT: {
      return {
        ...state,
        contacts: action.payload
      }
    }
    case constsss.ADD_CONTACT: {
      console.log('||REDUCER||', action.status)
      return {
        ...state,
        addContactStatus: action.status
      }
    }
    default:
    return state
  }
}