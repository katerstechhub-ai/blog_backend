// const math = require('./c_modules/math');
// const num = require('./c_modules/num');
// const multiply = require('./c_modules/multiply');
// console.log(math.multiply(5, 5))

// console.log(num('Ragnar'))

// const os = require('os');
// const fs = require('fs');
// const readline = require('readline')

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// const userDB = {
//     username: 'Ragnar',
//     password: '123456'
// };

// console.log("-------Welcome to the login system--------");

// rl.question('Enter youtr username;', (username) => {
//     rl.question('Enter your password:', (password) => {
//         if(username === userDB.username && password === userDB.password){
//             console.log("\nLogin successfull Welcome ");
//             console.log("Welcome back," +username + "!");
//         }else{
//             console.log("\nLogin failed! Invalid username or password");
//         }
//         rl.close();
//     })
// })




// console.log(os.platform());
// console.log(os.arch());
// console.log(os.freemem());
// console.log(os.totalmem());
// console.log(os.hostname());

// fs.writeFileSync('jasmine.txt', 'Hello my name is Jasmine and I am 8 years old')
// console.log('File created successfully');

// // const data = fs.readFileSync('jasmine.txt', 'utf-8');
// // console.log(data);

// fs.appendFileSync('jasmine.txt', '\nI am a student of class 3rd');
// // console.log('Data appended successfully');

// fs.readFile('jasmine.txt', 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })



const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("-------Welcome to the Registration System--------");

rl.question('Enter a username: ', (username) => {
    rl.question('Enter a password: ', (password) => {
        rl.question('Enter your email: ', (email) => {

            if (!username || !password || !email) {
                console.log('\nAll fields are required!');
                rl.close();
                return;
            }

            if (password.length < 6) {
                console.log('\nPassword must be at least 6 characters!');
                rl.close();
                return;
            }

            if (!email.includes('@')) {
                console.log('\nInvalid email address!');
                rl.close();
                return;
            }

            if (fs.existsSync('users.txt')) {
                const fileData = fs.readFileSync('users.txt', 'utf-8');
                const lines = fileData.split('\n').filter(line => line.trim() !== '');

                for (let i = 0; i < lines.length; i++) {
                    const parts = lines[i].split('username: ')[1].split(',')[0];
                    if (parts === username) {
                        console.log('\nUsername already taken. Please try a different one.');
                        rl.close();
                        return;
                    }
                }
            }

            const newUserEntry = `username: ${username}, password: ${password}, email: ${email}\n`;
            fs.appendFileSync('users.txt', newUserEntry);
            console.log(`\nRegistration successful! Welcome, ${username}!`);

            rl.close();
        });
    });
});
