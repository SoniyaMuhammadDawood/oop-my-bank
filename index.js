#!/usr/bin/env node
import { faker } from '@faker-js/faker';
import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.bold.hex('#FFC0CB')(`\n \t▂▃▅▇█▓▒░ Welcome to the student management system of Giaic ░▒▓█▇▅▃▂\n`));
console.log(chalk.bold.hex('#FFC0CB')(`\t`, `=`.repeat(67), `\n`));
console.log(chalk.bold.hex('#FFC0CB')(` Hint: Account num starting from 1001 to 1010 \n`));
// Customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// Class for Bank
class Bank {
    customers = [];
    accounts = [];
    addCustomer(customer) {
        this.customers.push(customer);
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    transaction(accObj) {
        let newAccount = this.accounts.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.accounts = [...newAccount, accObj];
    }
}
let myBank = new Bank();
// Customer creation
for (let i = 1; i <= 10; i++) {
    let fName = faker.person.firstName();
    let lName = faker.person.lastName();
    let gender = faker.helpers.arrayElement(["male", "female"]);
    let age = 25 * i;
    let mob = parseInt(faker.phone.number('##########'));
    let accNumber = 1000 + i;
    const cus = new Customer(fName, lName, age, gender, mob, accNumber);
    myBank.addCustomer(cus);
    const acc = { accNumber: accNumber, balance: 100 * i };
    myBank.addAccount(acc);
}
// bank functionality
async function bankServices(bank) {
    do {
        let services = await inquirer.prompt([{
                name: "select",
                type: "list",
                message: chalk.hex('#FF1493')("Please select your desired service"),
                // message:  chalk.bold.hex('#FFD700')("Please select your desired service"),
                choices: ["View balance", "Cash withdraw", "Cash deposit"]
            }]);
        // view balance
        if (services.select === "View balance") {
            let response = await inquirer.prompt([{
                    name: "num",
                    message: chalk.bold.greenBright("Please enter your account number"),
                    type: "input"
                }]);
            let accountNumber = myBank.accounts.find((acc) => acc.accNumber == response.num);
            if (!accountNumber) {
                console.log(chalk.bold.italic.redBright(`Invalid account number`));
            }
            if (accountNumber) {
                let name = myBank.customers.find((item) => item.accNumber == accountNumber?.accNumber);
                console.log(`Dear ${name?.firstName} ${name?.lastName} your account balance is: ${chalk.bold.yellow(`$${accountNumber.balance}`)}`);
            }
        }
        // Cash withdraw
        if (services.select === "Cash withdraw") {
            let response = await inquirer.prompt([{
                    name: "num",
                    message: chalk.bold.greenBright("Please enter your account number"),
                    type: "input"
                }]);
            let accountNumber = myBank.accounts.find((acc) => acc.accNumber == response.num);
            if (!accountNumber) {
                console.log(chalk.bold.italic.redBright(`Invalid account number`));
            }
            if (accountNumber) {
                let ans = await inquirer.prompt([{
                        name: "dollar",
                        message: "Please enter the amount to withdraw",
                        type: "number"
                    }]);
                let newBalance = accountNumber.balance - ans.dollar;
                if (newBalance < 0) {
                    console.log(chalk.bold.redBright("Insufficient funds"));
                }
                else {
                    bank.transaction({ accNumber: accountNumber.accNumber, balance: newBalance });
                    console.log(`New balance: ${chalk.bold.yellow(`$${newBalance}`)}`);
                }
            }
        }
        // Cash deposit
        if (services.select === "Cash deposit") {
            let response = await inquirer.prompt([{
                    name: "num",
                    message: chalk.bold.greenBright("Please enter your account number"),
                    type: "input"
                }]);
            let accountNumber = myBank.accounts.find((acc) => acc.accNumber == response.num);
            if (!accountNumber) {
                console.log(chalk.bold.italic.redBright(`Invalid account number`));
            }
            if (accountNumber) {
                let ans = await inquirer.prompt([{
                        name: "dollar",
                        message: "Please enter the amount to deposit",
                        type: "number"
                    }]);
                let newBalance = accountNumber.balance + ans.dollar;
                bank.transaction({ accNumber: accountNumber.accNumber, balance: newBalance });
                console.log(`New balance: ${chalk.bold.yellow(`$${newBalance}`)}`);
            }
        }
    } while (true);
}
bankServices(myBank);
