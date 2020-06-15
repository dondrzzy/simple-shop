## Node Express Simple Shop API
This is a simple shop API that allows users to
- register
- login with jwt
- create, read, update and delete products
- create, read and delete orders to products


## To run locally
1. Git clone this repository
2. Create these environment variables in any way you would like depending on where your database is hosted. These will be used in the construction of your `db_uri` string. I add a nodemon.json file in the root directory and run the app with `nodemon` command.
```
    {
        "env": {
            "SS_ADMIN_USERNAME": "",
            "SS_ADMIN_PWD": "",
            "SS_CLUSTER": "",
            "SS_DB_NAME": "",
            "SS_SECRET": ""
        }
    }
```
3. Set the port env variable. it will default to 3000 if not set.
4. Start the application with
> node server.js or nodemon

4. API structure follows `http://localhost:3000/...`
