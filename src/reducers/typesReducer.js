import { consts } from '../actions/typesAction'

const initial = {
  types: []
}

export default function reducer(state = initial, action) {
  switch (action.type) {
    case consts.PHONE_EMAIL_TYPES: {
      return {
        ...state,
        types: action.payload
      }
    }
    default:
    return state
  }
}