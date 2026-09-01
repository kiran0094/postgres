import {Client} from "pg"
import express from "express";
const pgClient=new Client("postgresql://neondb_owner:npg_wr9RcQYz0uiv@ep-calm-leaf-ax1o4lki-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

const app= express()

app.use(express.json())

await pgClient.connect();


async function main(){
  
   const user=await pgClient.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); `);

    const orders=await pgClient.query(`CREATE TABLE address (
    city VARCHAR(30),
    state VARCHAR(30),
    country VARCHAR(30),
    street VARCHAR(50),
    pincode VARCHAR(6),
    user_id INT,
    
    FOREIGN KEY (user_id) REFERENCES Users(id)
);`)
 

    //console.log(orders);

}
//main()

app.post('/user',async(req,res)=>{
  try {
   const {username,email,password,city,state,country,street,pincode}=req.body;
   //trnascation 
   
   const insertusers = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id";
   const values:string[] = [username, email, password];
   const insertaddress="INSERT INTO address (city,state,country,street,pincode,user_id) VALUES($1,$2,$3,$4,$5,$6)"
   
   await pgClient.query('BEGIN');
    const insertuser = await pgClient.query(insertusers, values);
    const addvalues:string[]=[city,state,country,street,pincode,insertuser.rows[0].id]   
    const insertaddressres = await pgClient.query(insertaddress, addvalues);
     await pgClient.query("COMMIT");
     res.json({
      "status":200,
      "messsage":'usersuccessfull created ',

     })
  } catch (err) {
    console.error('Error during the insertion:', err);
  } 
})

app.get("/metadata",async(req,res)=>{

  const query=await pgClient.query(`SELECT users.id, users.username, users.email, address.city, address.country, address.street, address.pincode
                         FROM users
                         JOIN address ON users.id = address.user_id
                         WHERE users.id = $1;`,[1]);
  console.log(query);
  res.json({
    data:query
  })



})



app.listen(3000,()=>{
  console.log("app is lising on port 3000")
})

// Example usage
//insertData('username5', 'user5@example.com', 'user_password').catch(console.error);



