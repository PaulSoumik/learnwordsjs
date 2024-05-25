import { sql } from '@vercel/postgres';
import { dataTables } from '../../models/dataModels';

const { db } = require('@vercel/postgres');
var client = null;
export async function dbConnect(){
    client= await db.connect();
    return client; 
}


export async function rollBack(client, rollBackMap){
    //console.log(rollBackMap);

    if(!client) client = await db.connect();
    var dataDeleted = {};
    if(rollBackMap[dataTables.users] && rollBackMap[dataTables.users].length==0){
        dataDeleted.users = await client.sql`DELETE FROM users WHERE id in ${rollBackMap[dataTables.users]}`;
    }
    if(rollBackMap[dataTables.words] && rollBackMap[dataTables.words].length==0){
        dataDeleted.words = await client.sql`DELETE FROM words WHERE id in ${rollBackMap[dataTables.words]}`;
    }
    if(rollBackMap[dataTables.synonyms] && rollBackMap[dataTables.synonyms].length==0){
        dataDeleted.synonyms = await client.sql`DELETE FROM synonyms WHERE id in ${rollBackMap[dataTables.synonyms]}`;
    }
    if(rollBackMap[dataTables.sentences] && rollBackMap[dataTables.sentences].length==0){
        dataDeleted.sentences = await client.sql`DELETE FROM sentences WHERE id in ${rollBackMap[dataTables.sentences]}`;
    }
    if(rollBackMap[dataTables.userwordrelations] && rollBackMap[dataTables.userwordrelations].length==0){
        dataDeleted.userwordrelations = await client.sql`DELETE FROM userwordrelations WHERE id in ${rollBackMap[dataTables.userwordrelations]}`;
    }
    if(rollBackMap[dataTables.usersessions] && rollBackMap[dataTables.usersessions].length==0){
        dataDeleted.usersessions = await client.sql`DELETE FROM users WHERE id in ${rollBackMap[dataTables.usersessions]}`;
    }
    //console.log(dataDeleted);
    return dataDeleted;
}

export async function serverlog(logdata){
    console.log(logdata);
}
export async function serverlog2(logdata1, logdata2){
    console.log(logdata1, logdata2);
}