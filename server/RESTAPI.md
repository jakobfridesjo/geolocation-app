# Definitions of REST-api

## WEB (html forms)

### GET 

---

**Web users page (*works*):** /web/users

**Web friends page (*works*):** /web/friends

**Web trails page (*works*):** /web/trails

### POST

---

#### ADD FUNCTIONS

**Web add user (*works*):** /web/add/user 

    type="text" name="name"
    type="number" min="0" name="age"
    type="text" name="mail"
    type="text" name="password"

**Web add friend (*works*):** /web/add/friend
  
    type="number" name="id"
    type="number" name="id_friend"

#### DELETE FUNCTIONS

**Web delete user (*works*):** /web/del/user 

    type="number" name="id"

**Web delete trail (*works*):** /web/del/trail 

    type="number" name="id"

**Web delete friend (*works*):** /web/del/friend
  
    type="number" name="id"
    type="number" name="id_friend"

## API (json)

### POST 

---

#### FETCH FUNCTIONS 

**Api fetch trails for user id (*works*):** /api/trails

    {
        "id": <int>
    }

    returns:
    {
        [ 
            {
                "id": <int>,
                "start_time": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">,
                "end_time": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">
            }
        ]
    }

**Api fetch user id and name when logging in (*works*):** /api/login

    {
        "mail": <string>
        "password": <string>
    }

    returns:
    { 
        "id": <int>,
        "name": <string>
        "age": <int>
        "mail": <String>
    }

**Api fetch coords for trail id (*works*):** /api/coords
    
    {
        "id": <int>
    } 

    returns:
    {
        [
            { 
                "id": <int>,
                "longitude": <double>,
                "latitude": <double>,
                "timecode": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">
            }
        ]
    }

**Api fetch friends for user id (*wip*):** /api/friends
    
    {
        "id": <int>
    } 

    returns:
    {
        [
            { 
                "id": <int>,
                "name_friend": <string>
            }
        ]
    }

#### ADD FUNCTIONS

**Api add user (*works*):** /api/add/user 

    { 
        "name": <string:(length >= 6)>,
        "age": <int>,
        "mail": <string>,
        "password": <string:(length >= 8)>
    }
    
    returns:
    {
        "id": <int>
    }

**Api add trail for user id (*works*):** /api/add/trail
  
    {
        "id": <int>,
        "start_time": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">,
        "end_time": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">
    }

**Api add coord for trail id (*works*):** /api/add/coord

    { 
        "id": <int>,
        "longitude": <double>,
        "latitude": <double>,
        "timecode": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">
    }

**Api add friend for user id (*works*):** /api/add/friend

    { 
        "id": <int>,
        "id_friend": <int>
    }

#### UPDATE FUNCTIONS

**Api update trail for trail id (*untested*)** /api/update/trail

    {
        "id": <int>,
        "end_time": <string:"YYYY-MM-DDThh24:mi:ssTZH:TZM">
    }

**Api update user name for user id (*untested*)** /api/update/user/name
  
    {
        "id": <int>,
        "password": <String>,
        "name": <String:(length >= 6)>
    }

**Api update user mail for user id (*untested*)** /api/update/user/mail

    {
        "id": <int>,
        "password": <String>,
        "mail": <String>
    }

**Api update user password for user id (*untested*)** /api/update/user/password

    {
        "id": <int>,
        "password": <String>,
        "new_password": <String:(length >= 8)>
    }

#### DELETE FUNCTIONS

**Api delete user for user id (*works*):** /api/del/user 

    {
        "id": <int>
    }

**Api delete trail for trail id (*works*):** /api/del/trail
  
    {
        "id": <int>
    }

**Api delete friend for user id (*works*):** /api/del/friend

    {
        "id": <int>,
        "id_friend": <int>
    }
