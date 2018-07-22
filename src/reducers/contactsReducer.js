import { consts } from '../actions/contactsActions'

const initial = {
  contacts: [],
  id: []
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
    default:
    return state
  }
}