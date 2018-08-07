import axios from 'axios'

export const Http = {
    get: (url) => {
        return new Promise((resolve, reject) => {
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2NCwiZXhwIjoxNTI4Njk2Njg0LCJ1c2VybmFtZSI6Im5hdmFzYXJkeWFuLmVkZ2FyQGdtYWlsLmNvbSIsImVtYWlsIjoibmF2YXNhcmR5YW4uZWRnYXJAZ21haWwuY29tIn0.q3Gz41o0GtLaaN35UYk69Nvimj_ZDO0pKhJI8F-x8mM'
            }
            axios.get(url, {
                headers: headers
            }) 
            .then((response) => resolve(response))
            .catch((err) => reject(err))
        })
    },
    post: (url, phoneData) => {
        return new Promise((resolve, reject) => {
            // console.log('phoneData', phoneData)
            let headers = {
                'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2NCwiZXhwIjoxNTI4Njk2Njg0LCJ1c2VybmFtZSI6Im5hdmFzYXJkeWFuLmVkZ2FyQGdtYWlsLmNvbSIsImVtYWlsIjoibmF2YXNhcmR5YW4uZWRnYXJAZ21haWwuY29tIn0.q3Gz41o0GtLaaN35UYk69Nvimj_ZDO0pKhJI8F-x8mM',
                'Content-Type': 'application/json'  
            }
            axios.post(url, phoneData, {
                headers: headers
            })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
        })
    }
}