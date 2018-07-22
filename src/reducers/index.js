import { combineReducers } from 'redux';
import contacts from './contactsReducer';

const stores = combineReducers({
    contacts
});

export default stores;