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
            console.log('phoneData', phoneData)
            let headers = {
                'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFfZ2FzQGljbG91ZC5jb20iLCJleHAiOjE1MTYzNjAwNjAsInVzZXJfaWQiOjcsInVzZXJuYW1lIjoiYV9nYXNAaWNsb3VkLmNvbSJ9.-YVUDeuNGayYl-e1ICucRYzRq8jyo0GPSV2-U_dV75s',
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