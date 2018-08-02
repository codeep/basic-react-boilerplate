import { Http } from './requests'


export const consts = {  
    GET_CONTACTS: 'GET_CONTACTS',
    GET_ID: 'GET_ID',
}


export default function getContacts() {
    return dispatch => {
        const url = 'https://prod.mcontrol.com/contacts'
        Http.get(url)
        .then((response) => {
            dispatch({
                type: 'GET_CONTACTS',
                payload: response.data,
                status: response.status
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

// export default function getContacts() {
//     return async dispatch => {
//         try {
//             const url = 'https://prod.mcontrol.com/contacts'
//             const response = await Http.get(url)
//             dispatch({
//                 type: 'GET_CONTACTS',
//                 payload: response.data
//             })
//         }
//         catch(e) {
//             console.log(e)
//         }
//     }
// }

export function getprofile(id) {
    return dispatch => {
        const url = `https://prod.mcontrol.com/contacts/profile?id=${id}`
        Http.get(url)
        .then((response) => {
            dispatch({
                type: 'GET_ID',
                payload: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

// export function getprofile(id) {
//     return async dispatch => {
//         try {
//             const url = `https://prod.mcontrol.com/contacts/profile?id=${id}`
//             const response = await Http.get(url)
//             dispatch({
//                 type: 'GET_ID',
//                 payload: response.data
//             })
//         }
//         catch(e) {
//             console.log(e)
//         }
//     }
// }
