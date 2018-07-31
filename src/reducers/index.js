import { combineReducers } from 'redux';
import contacts from './contactsReducer';
import types from './typesReducer'

const stores = combineReducers({
    contacts,
    types
});

export default stores;