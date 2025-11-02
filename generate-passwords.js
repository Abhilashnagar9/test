const bcrypt = require('bcrypt');

const password = 'password123';
const users = [
    'testuser',
    'admin', 
    'john_doe',
    'jane_smith'
];

console.log('Generating password hashes for "password123":');
console.log('=============================================\n');

// Sync method use karein taaki proper order mein output mile
users.forEach(username => {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('SQL Insert Command:');
    console.log(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${username}@example.com');`);
    console.log('---\n');
});

console.log('Copy these hashes to your init.sql file!');
