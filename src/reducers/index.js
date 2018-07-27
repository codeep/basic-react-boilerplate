import { combineReducers } from 'redux';
import contacts from './contactsReducer';
// import searchContacts from './searchReducer'

const stores = combineReducers({
    contacts,
    // searchContacts
});

export default stores;