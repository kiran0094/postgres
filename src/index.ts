import {Client} from "pg"
import express from "express";
const pgClient=new Client("postgresql://neondb_owner:npg_wr9RcQYz0uiv@ep-calm-leaf-ax1o4lki-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

const app= express()

app.use(express.json())


 async function main(){
    await pgClient.connect();
    const user=await pgClient.query(`CREATE TABLE Users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
    ); `);

    const orders=await pgClient.query(`CREATE TABLE Orders (
    id INT PRIMARY KEY,
    amount DECIMAL(10, 2),
    user_id INT,
    
    FOREIGN KEY (user_id) REFERENCES Users(id)
);`)
 

    console.log(orders);

}
main()

app.post('/user',async(req,res)=>{
  try {
   const {username,email,password}=req.body;
    const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const values:string[] = [username, email, password];
    const res = await pgClient.query(insertQuery, values);
    console.log('Insertion success:', res); // Output insertion result
  } catch (err) {
    console.error('Error during the insertion:', err);
  } 
})

app.listen(3000,()=>{
  console.log("app is lising on port 3000")
})

// Example usage
//insertData('username5', 'user5@example.com', 'user_password').catch(console.error);



