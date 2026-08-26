import {Client} from "pg"

const pgClient=new Client("postgresql://neondb_owner:npg_wr9RcQYz0uiv@ep-calm-leaf-ax1o4lki-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

 async function main(){
    await pgClient.connect();

}
main();


