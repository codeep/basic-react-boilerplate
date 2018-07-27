import {Http} from './requests'

export const consts = {  
    DELETE_CONTACT: 'DELETE_CONTACT',
}

export default function deleteContact(data) {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts/delete'
        Http.post(url, [data])
        .then((response) => {
            dispatch({
                type: 'DELETE_CONTACT',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}