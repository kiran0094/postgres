import {Client} from "pg"

const pgClient=new Client("postgresql://neondb_owner:npg_wr9RcQYz0uiv@ep-calm-leaf-ax1o4lki-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

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



async function insertData(username: string, email: string, password: string) {
  const client=new Client("postgresql://neondb_owner:npg_wr9RcQYz0uiv@ep-calm-leaf-ax1o4lki-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");


  try {
    await client.connect(); // Ensure client connection is established
    // Use parameterized query to prevent SQL injection
    const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const values = [username, email, password];
    const res = await client.query(insertQuery, values);
    console.log('Insertion success:', res); // Output insertion result
  } catch (err) {
    console.error('Error during the insertion:', err);
  } finally {
    await client.end(); // Close the client connection
  }
}

// Example usage
//insertData('username5', 'user5@example.com', 'user_password').catch(console.error);



