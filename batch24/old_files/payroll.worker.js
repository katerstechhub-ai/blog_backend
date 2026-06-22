// import { parentPort, workerData } from 'worker_threads';

// function fib(x) {
//     if (x <= 1) return x;
//     return fib(x - 1) + fib(x - 2);
// }

// const result = fib(workerData.x);

// // send the result back to the main thread
// parentPort.postMessage(result);


import { parentPort, workerData } from 'worker_threads';

const employees = workerData.employees;

const results = [];

for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];

    const tax = emp.basicSalary * 0.10;
    const pension = emp.basicSalary * 0.08;

    let bonus;
    if (emp.performanceScore >= 90) {
        bonus = emp.basicSalary * 0.20;
    } else if (emp.performanceScore >= 75) {
        bonus = emp.basicSalary * 0.10;
    } else {
        bonus = emp.basicSalary * 0.05;
    }

    const netSalary = emp.basicSalary + bonus - tax - pension;

    results.push({
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        basicSalary: emp.basicSalary,
        performanceScore: emp.performanceScore,
        tax: Math.round(tax),
        pension: Math.round(pension),
        bonus: Math.round(bonus),
        netSalary: Math.round(netSalary)
    });
}

parentPort.postMessage(results);