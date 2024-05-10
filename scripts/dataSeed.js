const { db } = require('@vercel/postgres');
const {
  synonyms,
  userwordrelations,
  words,
  sentences,
  users,
  userSessions,
} = require('../models/dbPlaceholder.js');
const bcrypt = require('bcrypt');
const moment = require('moment');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql `
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;`;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedWords(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "words" table if it doesn't exist
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS words (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        word VARCHAR(255) NOT NULL,
        definition VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        wordtype VARCHAR(255)
      );
    `;

    console.log(`Created "words" table`);

    // Insert data into the "words" table
    const insertedWords = await Promise.all(
      words.map(
        (word) => client.sql`
        INSERT INTO words ( word, definition, status,wordtype )
        VALUES (${word.word}, ${word.definition}, ${word.status}, ${word.wordtype})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedWords.length} words`);

    return {
      createTable,
      words: insertedWords,
    };
  } catch (error) {
    console.error('Error seeding words:', error);
    throw error;
  }
}

async function seedSynonyms(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "synonyms" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS synonyms (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        synWord_id UUID REFERENCES words(id) on delete cascade,
        synonymTo_id UUID REFERENCES words(id) on delete cascade,
        status VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "synonyms" table`);

    // Insert data into the "synonyms" table
    const insertedSynonyms = await Promise.all(
      synonyms.map(
        (synonym) => client.sql`
        INSERT INTO synonyms (synWord_id, synonymTo_id, status)
        VALUES (${synonym.synWord}, ${synonym.synonymTo}, ${synonym.status})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedSynonyms.length} customers`);

    return {
      createTable,
      synonyms: insertedSynonyms,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedSentences(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "sentences" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS sentences (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        sentence VARCHAR(255) NOT NULL,
        word_id UUID REFERENCES words(id) on delete cascade,
        status VARCHAR(255)
      );
    `;

    console.log(`Created "sentences" table`);

    // Insert data into the "sentences" table
    const insertedSentences = await Promise.all(
      sentences.map(
        (sts) => client.sql`
        INSERT INTO sentences (sentence, word_id)
        VALUES (${sts.sentence}, ${sts.word})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedSentences.length} sentences`);

    return {
      createTable,
      sentences: insertedSentences,
    };
  } catch (error) {
    console.error('Error seeding sentences:', error);
    throw error;
  }
}

async function seedUserWordRelation(client) {
    try {
      await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
      // Create the "userwordrelation" table if it doesn't exist
      const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS userwordrelations (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          word_id UUID REFERENCES words(id) on delete cascade,
          user_id UUID REFERENCES users(id) on delete cascade,
          status VARCHAR(255) NOT NULL,
          notes VARCHAR(255)
        );
      `;
  
      console.log(`Created "userwordrelations" table`);
  
      // Insert data into the "userwordrelations" table
      const insertedUserwordrelations = await Promise.all(
        userwordrelations.map(
          (rel) => client.sql`
          INSERT INTO userwordrelations (word_id, user_id, status)
          VALUES (${rel.word}, ${rel.user}, ${rel.status})
          ON CONFLICT (id) DO NOTHING;
        `,
        ),
      );
  
      console.log(`Seeded ${insertedUserwordrelations.length} customers`);
  
      return {
        createTable,
        userwordrelation: insertedUserwordrelations,
      };
    } catch (error) {
      console.error('Error seeding customers:', error);
      throw error;
    }
  }



async function seedUserSessions(client) {
  try {
    //await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    // const createTable = await client.sql`
    //   CREATE TABLE IF NOT EXISTS usersessions (
    //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    //     sessionID VARCHAR(255) NOT NULL UNIQUE,
    //     user_id UUID REFERENCES users(id) on delete cascade,
    //     createdDate Date NOT NULL
    //   );
    // `;
    // const alterTable = await client.sql`
    //     ALTER TABLE usersessions 
    //     ADD validationEnd VARCHAR(255);
    // `;
    var currDateTime = moment().add(90,'m').utc().format('YYYY-MM-DD HH:MM:SS');

    console.log(`Created "usersessions" table`);
  
      // Insert data into the "userwordrelations" table
    // const insertedUserSessions = await Promise.all(
    // userSessions.map(
    //     (rel) => client.sql`
    //     INSERT INTO usersessions (user_id, sessionID, createdDate)
    //     VALUES (${rel.user}, ${rel.sessionID}, ${rel.createdDate})
    //     ON CONFLICT (id) DO NOTHING;
    // `,
    // ),
    // );
    //const allUserSessions = await sql`SELECT * FROM usersessions`;

    const updateUserSessions = await client.sql`Update usersessions set validationEnd = ${currDateTime}`;
    //console.log(`Seeded ${insertedUserSessions.length} customers`);
    return {
      //createTable,
      //usersessions: insertedUserSessions,
      updatedSessions: updateUserSessions
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function getUsers(client, emails){
  try {
    //console.log(emails);
    var emailsString  =  emails.join('\',\'');
    emailsString = '(\''+emailsString+'\')';
    const users = await client.query(`SELECT * FROM users WHERE email IN ${emailsString}`);
    console.log('Users fetched');
    console.log(users);
    return {users: users.rows};
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return {users: []};
  }
}
async function getWords(client, wordsNames){
  try {
    var wordsNamesString  =  wordsNames.join('\',\'');
    wordsNamesString = '(\''+wordsNamesString+'\')';
    console.log(wordsNamesString);
    const wordsData = await client.query(`SELECT * FROM words WHERE word IN ${wordsNamesString}`);
    console.log('words fetch');
    console.log(wordsData);
    return {words: wordsData.rows};
  } catch (error) {
    console.error('Failed to fetch words:', error);
    return {words: []};
  }
}

async function main() {
  const client = await db.connect();
  //console.log(await bcrypt.hash('adminPass@543',10));
  //console.log(await bcrypt.compare('adminPass@543','$2b$10$ttI8oyY0TxA2MRe5JYrS/OdfAUiDSDvCE/uq03iJ130hc76s5yNVW'));
  /*var userEmails = [];
  //console.log(users);
  users.map(user=>{userEmails.push(user.email);});
  console.log(userEmails);
  var wordsName = [];
  words.map(word=>{wordsName.push(word.word);});
  var userData = await getUsers(client, userEmails);//await seedUsers(client);
  var userMap = {};
  userData.users.map(usr=>{userMap[usr.name] = usr.id;})

  //console.log(words);
  var wordData  = await getWords(client, wordsName);//await seedWords(client);
  var wordsMap = {};
  wordData.words.map(wrd=>{wordsMap[wrd.word] = wrd.id;});
  synonyms.map(synm=>{
    synm.synWord = wordsMap[synm.synWord];
    synm.synonymTo = wordsMap[synm.synonymTo];
  })
  //console.log(synonyms);
  //client.sql`DROP TABLE sentences`;
  //await seedSynonyms(client);
  sentences.map(snt=>{snt.word = wordsMap[snt.word];});
  //await seedSentences(client);
  userwordrelations.map(uwrdrel=>{
    uwrdrel.user = userMap[uwrdrel.user];
    uwrdrel.word = wordsMap[uwrdrel.word];
  });
  //console.log(userwordrelations);
  //await seedUserWordRelation(client);
  userSessions.map(async (usesion)=>{
    usesion.user = userMap[usesion.user];
    usesion.sessionID = await bcrypt.hash(usesion.sessionID, 10);
  })
  console.log(userSessions);*/
  await seedUserSessions(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});