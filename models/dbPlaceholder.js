// This file contains placeholder data for sample
const users = [
    {
        name: 'adminUser',
        email: 'adminUser@yopmail.com',
        password: 'myAdmin@234'
    }
];

const words = [
    {
        word : 'vacillate',
        definition : 'To waver between different opinions or actions / waver between different opinions or actions, be indecisive',
        status : 'Active',
        wordtype: 'Verb'

    },
    {
    word : 'capricious',
    definition : 'Given to sudden and unaccountable changes of mood or behaviour',
    status : 'Active',
    wordtype: 'Adj'

    },
    {
    word : 'inconstant',
    definition : 'Frequently changing; variable or irregular / Not faithful and dependable',
    status : 'Active',
    wordtype: 'Adj'

    }
];

const synonyms = [
    {
    synWord: 'capricious',
    synonymTo: 'inconstant',
    status: 'Active'
    }
];
const sentences = [
    {
    word: 'vacillate',
    sentence: 'Undergraduate students often vacillate among various majors before deciding which degree to pursue.'
    },
    {
    word : 'capricious',
    sentence: 'The capricious supervisor would hand out raises one day and fire his entire staff the next.'
    },
    {
    word: 'inconstant',
    sentence: 'The most inconstant man in the world.'
    },
    {
    word: 'inconstant',
    sentence: 'The exact dimensions aren\'t easily measured since they are inconstant.'
    }
];
const userwordrelations = [
    {
    word: 'inconstant',
    user: 'adminUser',
    status: 'New',
    Notes: ''
    },
    {
    word: 'capricious',
    user: 'adminUser',
    status: 'New',
    Notes: ''
    }
];

const userSessions = [
];
    
module.exports = {
    users,
    words,
    sentences,
    synonyms,
    userwordrelations,
    userSessions,
};