// const http = require('http');
// const server = http.createServer((req, res) => {
//     res.write("Hello from Node server");
//     res.end();
// }) 
// const PORT = 3200;
// server.listen(3200, () => console.log(`Server is running on http://localhost:${PORT}`))

// const http = require('http');

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.write('Welcome to our Home page');
//         res.end();
//     }

//     else if (req.url === '/about') {
//         res.write('Welcome to our About page');
//         res.end();
//     }

//     else if (req.url === '/contact') {
//         res.write('Welcome to our Contact page');
//         res.end();
//     }

//     else {
//         res.write('404 Not Found');
//         res.end();
//     }
// })

// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// })



// const express = require('express');

// const app = express();

// const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello World');
// })

// app.get('/contact', (req, res) => {
//     res.send('Welcome to our Contact Page');
// })

// app.get('/about', (req, res) => {
//     res.send('Welcome to our About page');
// })

// app.get('/user', (req, res) => {
//     res.json({
//         name: "Ragnar",
//         age: 25,
//         role: "Developer"
//     });
// });

// app.get('/cpu-blocking',(req, res) => {
//     const n = 10;

//     function fib(x){
//         if(x <= 1) return x;
//         return fib(x - 1) + fib(x - 2);
//     }

//     const start = Date.now();
//     const result = fib(n);
//     const end = Date.now();

//     res.json({
//         input: n,
//         result,
//         timetaken: `${end - start} ms`,
//         messege: "This route is CPU intensive and blocks the loop, causing delays in handling other requests"
//     })
// })


// app.get("/non-blocking", (req, res) => {
//     const n = 50;
//     const memo = {};

//     function fib(x){
//         if(x <= 1) return x;

//         if(memo[x]) return memo[x];

//         memo[x] = fib(x - 1) + fib(x - 2);
//         return memo[x];
//     }

//     const start = Date.now();
//     const result = fib(n);
//     const end = Date.now();

//     res.json({
//         input: n,
//         result: result,
//         timetaken: `${end - start} ms`,
//         message: "This route is CPU intensive and blocks the loop, causing delays in handling other requests"
//     });
// })


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// })





// const express = require('express');

// const app = express();

// const PORT = 4000;

// app.get('/', (req, res) => {
//     res.send('Welcome to the Blocking vs Non-Blocking Demo');
// });

// // BLOCKING ROUTE 
// app.get('/blocking', (req, res) => {
//     const n = 40;

//     function fib(x) {
//         if (x <= 1) return x;
//         return fib(x - 1) + fib(x - 2);
//     }

//     const start = Date.now();
//     const result = fib(n);
//     const end = Date.now();

//     res.json({
//         input: n,
//         result,
//         timetaken: `${end - start} ms`,
//         message: "Blocking route - recalculates every value, hogs the CPU"
//     });
// });

// // NON-BLOCKING ROUTE 
// app.get('/non-blocking', (req, res) => {
//     const n = 40;
//     const memo = {};

//     function fib(x) {
//         if (x <= 1) return x;
//         if (memo[x]) return memo[x];
//         memo[x] = fib(x - 1) + fib(x - 2);
//         return memo[x];
//     }

//     const start = Date.now();
//     const result = fib(n);
//     const end = Date.now();

//     res.json({
//         input: n,
//         result,
//         timetaken: `${end - start} ms`,
//         message: "Non-blocking route - caches values, frees up the event loop faster"
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



// import express from 'express';
// import { Worker } from 'worker_threads';

// const app = express();
// const PORT = 3000;

// // Add this new root route
// app.get('/', (req, res) => {
//     res.json({
//         message: "Server is running!",
//         endpoints: ["/user", "/slow-fib"]
//     });
// });

// app.get('/user', (req, res) => {
//     res.json({
//         name: "Doe",
//         age: 30,
//         status: "Server is still responsive"
//     });
// });

// app.get('/slow-fib', (req, res) => {
//     const worker = new Worker('./fib.worker.js', {
//         workerData: { x: 40 }
//     });
    
//     worker.on('message', (result) => {
//         res.json({
//             input: 40,
//             result: result,
//             message: "Computed in worker thread (non-blocking)"
//         });
//     });

//     worker.on('error', (err) => {
//         console.error('Worker error:', err);
//         res.status(500).json({ error: "An error occurred in the worker thread" });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });



import express from 'express';
import { Worker } from 'worker_threads';
import { readFile } from 'fs/promises';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: "Payroll API is running!",
        endpoints: ["/process-payroll"]
    });
});

app.get('/process-payroll', async (req, res) => {

    // Read the employees json file
    const fileData = await readFile('./employees.json', 'utf-8');
    const employees = JSON.parse(fileData);

    // Send employees to worker thread
    const worker = new Worker('./payroll.worker.js', {
        workerData: { employees }
    });

    worker.on('message', (results) => {
        res.json({
            totalEmployees: results.length,
            processed: results
        });
    });

    worker.on('error', (err) => {
    console.error('Worker error:', err);
    res.status(500).json({ error: err.message });
});

    worker.on('error', (err) => {
        console.error('Worker error:', err);
        res.status(500).json({ error: 'An error occurred in the worker thread' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
