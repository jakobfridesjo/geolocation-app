import moment from 'moment/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

  let id_trail = 0;

  const getTrails = (id) => {
    console.log("Getting trails");
    return fetch('http://81.170.129.11:3000/api/trails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
    });
  }

  const createUser = (user) => {
    console.log("cretaing a user");
    const {mail, password, name, age} = user

    fetch('http://81.170.129.11:3000/api/add/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, age, mail, password})
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      let id = parseInt(data.slice(6,-1));
      const userData = {id, age, mail, name};
      storeUserData(userData);
    })
    .catch(error => {
      console.log("error: ", error);
    });
  }

  async function loginUser(userLogin) {
    console.log("Loging in user");
    const {mail, password} = userLogin;

    await fetch('http://81.170.129.11:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({mail, password})
    })
    .then(response => {
      return response.text();
    })
    .then( data => {
      storeUserData(data);
    })
    .catch(error => {
      console.log("error: ", error);
    });
  }

  const createTrail = (id) => {
    console.log("creating a trail");
    let start_time = moment().format();

    fetch('http://81.170.129.11:3000/api/add/trail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, start_time}),
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      id_trail = parseInt(data.slice(6,-1));
      console.log(data, "==> ", id_trail);
    })
    .catch(error => {
      console.log("error: ", error);
    });
  }

  const updateTrail = () => {
    console.log("updating end time");

    let end_time = moment().format();
    id = id_trail;

    fetch(`http://81.170.129.11:3000/api/update/trail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, end_time}),
    })
    .catch(error => {
      console.log("error: ", error);
    });
  }

  const createCoords = (body) => {
    const { longitude, latitude, timecode } = body
    console.log("creating a coordinate: ", id_trail, longitude, latitude, timecode);
    id = id_trail;

    fetch('http://81.170.129.11:3000/api/add/coord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, longitude, latitude, timecode}),
    })
    .catch(error => {
      console.log("error: ", error);
    });
  }

  const getCoords = (id) => {
    console.log("Getting coordinates");

    return fetch('http://81.170.129.11:3000/api/coords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
    });
  }

  const addFriend = (ids) => {
    const {id, id_friend} = ids;

    fetch('http://81.170.129.11:3000/api/add/friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, id_friend})
    })
        .then(response => {
          return response.text();
        })
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log("error: ", error);
        });
  }

  const getFriend = (id) => {
    console.log("Getting friends");

    return fetch('http://81.170.129.11:3000/api/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id}),
    });
  }

  const storeUserData = async (value) => {
    try {
      await AsyncStorage.setItem('@userData', value)
    } catch (e) {
      console.error(e)
    }
  }

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userData')
      if(value !== null) {
        var obj = JSON.parse(value);
        return obj;
      }
      } catch(e) {
        console.log(e);
        return -1;
      }
  }

module.exports = {
    getTrails,
    createTrail,
    updateTrail,
    createCoords,
    getCoords,
    addFriend,
    getFriend,
    createUser,
    loginUser,
    getUserData,
    storeUserData,
  }
