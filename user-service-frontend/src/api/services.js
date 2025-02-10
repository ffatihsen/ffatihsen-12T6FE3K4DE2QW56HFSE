// api.js
export const fetchUsers = async (search,page,pageSize) => {
    const apiURL=process.env.REACT_APP_API_URL
    let url = `${apiURL}/users?page=${page}&pageSize=${pageSize} `

    if(search){
        url = url + `&search=${search}`
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  export const fetchUserById = async (id) => {
    const apiURL=process.env.REACT_APP_API_URL
    let url = `${apiURL}/users`

    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    return data;
  };

  export const saveUser = async (userData) => {
    const apiURL=process.env.REACT_APP_API_URL
    const response = await fetch(`${apiURL}/users/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response
  };
  
  export const updateUser = async (id, userData) => {
    const apiURL=process.env.REACT_APP_API_URL
    const response = await fetch(`${apiURL}/users/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response
  };
  