import { consts } from '../actions/contactsActions'
import { constss } from '../actions/searchContact'

const initial = {
  contacts: [],
  id: [],
  types: {
    phoneTypes: [
      {
          "id": 1,
          "name": "Home"
      },
      {
          "id": 2,
          "name": "Mobile"
      },
      {
          "id": 3,
          "name": "Work"
      },
      {
          "id": 4,
          "name": "Fax work"
      },
      {
          "id": 5,
          "name": "Fax home"
      },
      {
          "id": 6,
          "name": "Pager"
      },
      {
          "id": 7,
          "name": "Other"
      },
      {
          "id": 8,
          "name": "Callback"
      },
      {
          "id": 9,
          "name": "Car"
      },
      {
          "id": 10,
          "name": "Company main"
      },
      {
          "id": 11,
          "name": "ISDN"
      },
      {
          "id": 12,
          "name": "Main"
      },
      {
          "id": 13,
          "name": "Other fax"
      },
      {
          "id": 14,
          "name": "Radio"
      },
      {
          "id": 15,
          "name": "Telex"
      },
      {
          "id": 16,
          "name": "TTY TDD"
      },
      {
          "id": 17,
          "name": "Work mobile"
      },
      {
          "id": 18,
          "name": "Work pager"
      },
      {
          "id": 19,
          "name": "Assistant"
      },
      {
          "id": 20,
          "name": "MMS"
      }
  ],
  emailTypes: [
      {
          "id": 1,
          "name": "Home"
      },
      {
          "id": 2,
          "name": "Work email"
      },
      {
          "id": 3,
          "name": "Other email"
      },
      {
          "id": 4,
          "name": "Mobile email"
      },
      {
          "id": 999,
          "name": "Unknown"
      }
  ]
  }
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
    default:
    return state
  }
}