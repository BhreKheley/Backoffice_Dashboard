import axios from "axios";


export function login(){
    let data = JSON.stringify({
        "email": "bhrekheley@gmail.com",
        "password": "tesate11*"
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/auth',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    return (
        axios.request(config)
        .then((response: any) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error: any) => {
          console.log(error);
        })
    )
}



