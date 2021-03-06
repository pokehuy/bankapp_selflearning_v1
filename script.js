'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(account, sorted = false) {
  containerMovements.textContent = '';
  const accs = sorted ? account.movements.slice().sort((a, b) => a - b) : account.movements
  
  accs.forEach(function(value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${value}???</div>
    </div>`

    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}

//displayMovements(account1.movements);

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
}
createUsernames(accounts);

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((pre,cur) => pre + cur,0);
  labelSumIn.textContent = `${incomes}???`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((pre,cur) => pre + cur,0);
  labelSumOut.textContent = `${outcomes}???`;

  const interest = acc.movements
    .filter(movement => movement > 0)
    .map(movement => movement * acc.interestRate / 100)
    .filter(int => int >= 1) // ? kh??ng c???n b??? gi?? tr??? nh??? h??n 1
    .reduce((pre, cur) => pre + cur, 0);
  labelSumInterest.textContent = `${interest}???`
}

//calcDisplaySummary(account1.movements);

const calcPrintBalance = function(account){
  account.balance = account.movements.reduce(((pre, cur) => pre + cur),0);
  labelBalance.textContent = account.balance + '???';
}

//calcPrintBalance(account1.movements);

///////////////////////////////////////////

// UPDATE UI
const updateUI = function(account){
  //calculate balance
  calcPrintBalance(account);
  //calculate summary
  calcDisplaySummary(account);
  //display movements
  displayMovements(account);
}
// LOGIN  
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value)
  //console.log(currentAccount);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //display UI and message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // remove the focus(cursor) out of input pin field, 
    
    updateUI(currentAccount);

    //set logout for 5 minutes

  }

})

// TRANSFER

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const accountReceiver = accounts.find(account => account.username === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';


  if(amount > 0 && 
    accountReceiver && 
    currentAccount.balance >= amount && 
    accountReceiver?.username !== inputTransferTo.value) {

      currentAccount.movements.push(-amount);
      accountReceiver.movements.push(amount);

      updateUI(currentAccount);

      inputTransferAmount.blur();
    }
  
})

// LOAN

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const anyDeposit = currentAccount.movements.some(mov => mov >= Number(inputLoanAmount.value) * 0.1);
  if(anyDeposit && Number(inputLoanAmount.value) > 0) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    console.log(currentAccount.movements);
    updateUI(currentAccount);
  }
})

// DELETE 

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(account => account.username === inputCloseUsername.value)
    accounts.splice(index, 1); // at index remove 1 element
    //accounts = [...accounts.slice(0,index),...accounts.slice(index+1)]; // accounts phai la let ko duoc la const
    inputCloseUsername.value = inputClosePin.value = '';
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
})

// SORT
let sort = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;

  // ch???nh l???i tr?????ng h???p x???p desc v?? kh??ng x???p, kh??ng n??n thay ?????i arr n??n ph???n n??y k d??ng, ch???nh t??? display movement
  /* switch (btnSort.textContent){
    case '??? SORT':
      currentAccount.movements.sort((a, b) => a - b);
      console.log(currentAccount.movements);
      updateUI(currentAccount);
      btnSort.textContent = '??? SORT';
      break;
    case '??? SORT':
      currentAccount.movements.sort((a, b) => b - a);
      console.log(currentAccount.movements);
      updateUI(currentAccount);
      btnSort.textContent = '??? SORT';
      break;
  } */

});

labelBalance.addEventListener('click', function() {
  const balanceUI = Array.from(document.querySelectorAll('.movements__value'));
  console.log(balanceUI.map(el => el.textContent.replace('???', '')));

})

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

//Maximum value using reduce
//REDUCE : CALLBACK C???A REDUCE S??? TR??? V??? GI?? TR??? N??O ???? M?? N?? S??? ???????C G??N L???I AUTO V??O BI???N PRE


//c??ch 1
//const max = account1.movements.reduce(((pre, cur) => {
  //if(cur >= pre){
  //  pre = cur;
  //}
  //return pre;
//}),account1.movements[0]);  // ??? ????y ko th??? l?? kh??ng v?? c??n gi?? tr??? ??m n???a, n???u c??? array c?? s??? ??m th?? sao??

// c??ch 2
const max = account1.movements.reduce((pre, cur) =>  (cur >= pre)?cur:pre,account1.movements[0]);
console.log(max);


// --------Code challenge 2----------

/* const calcAverageHumanAge = function(arr) {
  const changeToHumanAge = arr.map((value, i, arr) => (value <= 2 ? value * 2 : 16 + value * 4)); //  ??? ????y ko c???n g??n value = n???a v?? n?? t??? nh??n value ???? v???i gi?? tr??? r???i

  const filterArr = changeToHumanAge.filter((value, i, arr) => value >= 18)

  //const averageAge = filterArr.reduce(((pre, cur, i, arr) => pre + cur),0) / filterArr.length; // ho???c l??m theo c??ch d?????i , v?? (2+3)/2 = 2/2+3/2
  const averageAge = filterArr.reduce((pre, cur, i, arr) => pre + cur / filterArr.length,0);
  return averageAge;
} 


console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/

/*
const depositsToUSD = function (movements) {
  return movements.filter(mov => mov > 0)
  .map((mov,i,arr) => {
    console.log(arr); // check array if filter, map , ... do the right thing 
    return mov * 1.2
  })
  .reduce(((pre,cur) => pre+cur),0);
}

const newDepositToUSD = depositsToUSD(account1.movements);
console.log(newDepositToUSD);
*/

/*
const deposits = account1.movements.filter(function(mov) {
  return mov >= 0; // return boolean value
});

console.log(deposits);

const depositsFor = [];
for(const mov of account1.movements) if(mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdraws = account1.movements.filter(mov => mov < 0);
console.log(withdraws);

/////////////////////////////////////////////////
// S??? KH??C NHAU GI???A MAP V?? FOREACH 
//-> MAP PH???I C?? RETURN V?? N?? TR??? V??? 1 ARRAY V???I ????? D??I T????NG T??? ARRAY G???C, C?? TH??? D??NG ????? G???I C??C H??M KH??C ??? SAU NH?? FILTER, REDUCE
// -> FOREACH TH???C HI???N H??NH ?????NG XONG S??? C?? TR??? V??? L?? UNDEFINED -> KH??NG TH???C HI???N H??NH ?????NG G?? ??? SAU ???????C


const balance = account1.movements.reduce((pre, cur, i, arr) => {
  console.log(`Iteration ${i} : ${pre}`);
  return pre + cur;
},100)
console.log(balance); // tr??? v??? gi?? tr??? pre + cur cu???i c??ng

let acc = 100;
console.log(`Iteration 0 : ${acc}`);
for(const [key, mov] of account1.movements.entries()){
  console.log(`Iteration ${key+1} : ${acc += mov}`);
}



/////////////////////////////////////////////////


// ----Code challenge 1----

const checkDogs = function(dogsJulia, dogsKate) {
  const copyJulia = dogsJulia.slice(1,-2);
  //const correctData = [...copyJulia,...dogsKate];
  const correctData = copyJulia.concat(dogsKate);
  correctData.forEach(function(dog, i){
    if(dog >= 3) console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    else console.log(`Dog number ${i + 1} is still a puppy`);
  })
}
checkDogs([3,5,2,12,7],[4,1,15,8,3]);
console.log('-------------');
checkDogs([9,16,6,8,3],[10,5,6,1,4]);


// --------Code challenge 2----------




const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const euroToUSD = 1.2;

//const movMap = movements.map((value,i,array) => {
//  return value * euroToUSD; // nh??? ph???i return
//})
const movMap = movements.map((value, i, array) => value * euroToUSD);
console.log(movMap);

const movementsUSDfor = [];
for( const mov of movements) {
  movementsUSDfor.push(mov * euroToUSD);
}
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i, arr) => 
    `Movements ${i + 1} : You ${mov > 0 ?'deposited':'withdrew'} ${Math.abs(mov)}`
)

console.log(movementsDescriptions);

for(const movement of movements){
  if(movement > 0){
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

//--------FOREACH WITH MAP ---------
currencies.forEach(function(element, i, map) {
  console.log(`${i} : ${element}`);
});

//------FOREACH WITH SET----------
const  currenciesSet = new Set(['USD', 'GBP', 'EUR', 'EUR', 'JPY', 'JPY']);
Set.forEach(function(value, _, set){
  console.log(`${value}`); // key and value will be the same bcz set does not have key
})

//------FOREACH---------
//CAUTION: break and continue only be used with for loop, not forEach() function
movements.forEach((element,i, array) => (element>0)?console.log(`${i + 1}: You deposited ${element}`):console.log(`${i + 1}: You withdrew ${Math.abs(element)}`));

const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
const arr2 = ['m', 'l', 'k', 'i', 'h', 'g'];
//slice - immutable the array // d??ng ???????c cho c??? m???ng v?? string
console.log(arr.slice(2));
console.log(arr.slice(2,4));
console.log(arr.slice(-2));
console.log(arr.slice(2,-1));
console.log(arr.slice(-3,-1));
console.log(arr.slice(-1));
console.log(arr);
//splice // ch??? d??ng ???????c cho m???ng // c?? ph??p c???t ph???n t??? trong m???ng splice(from[,until]) , c?? ph??p th??m, ho???c ghi ???? splice(from,number,value1,...) => number = 0 add, = 1 | ... ghi ???? t??? 1 tr??? l??n
console.log(arr2.splice(2));
console.log(arr2);
console.log(arr2.splice(-1));
console.log(arr2);
//concat
console.log(arr2.concat(arr));
console.log([...arr2,...arr]);
//join
console.log(arr.join('-'));
console.log(arr.join(''));
console.log(arr.join(' x '));
//reverse
console.log(arr.reverse());
//


// ---------SOME AND EVERY------------
// n???u in ra some v?? every , k???t q???a s??? nh?? sau: ?????i v???i some ch????ng tr??nh s??? in ra ( c??ng l?? c??ch ct ch???y) t??? ?????u ?????n ??i???u ki???n
// ?????u ti??n th???a m??n, ?????i v???i every, ch????ng tr??nh s??? ch???y t??? ?????u cho t???i khi t??m ???????c ??i???u ki???n kh??ng th???a m??n ho???c ?????n cu???i
console.log(account2.movements.includes(-150));
console.log(account2.movements.some(mov => mov === -150)); // check if any element 
console.log(account2.movements.filter(move => move === -150));
console.log(account2.movements.every(mov => mov === -150)); // check every element
console.log(account4.movements.every(mov => mov > 0));

// -----------FLAT AND FLATMAP------------

const arr3 = [[1,[2,3]],4,5,[[6,7],8],9];
console.log(arr3.flat());
console.log(arr3.flat(1));
console.log(arr3.flat(2));
console.log(arr3.flat(3));

// t??nh t???ng balance c???a t???t c??? t??i kho???n

const balance11 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((pre,cur) => pre + cur, 0);

console.log(balance11);

const balance22 = accounts
  .flatMap(acc => acc.movements)
  .reduce((pre,cur) => pre + cur, 0);

console.log(balance22);

console.log(accounts.map(acc => acc.owner));

*/
// -----------SORT------------

//const movs = [200, 450, -400, 3000, -650, -130, 70, 1300];
//const owners = ['Jonas','Zach','Adam','Martha'];


//console.log(owners.sort()); // sort string
//console.log(owners); // mutatable the array !!!

// Numbers
//console.log(movs);

// h??m built-in sort() trong javascript s??? nh???n 1 call-back function v?? n?? return 1 gi?? tr??? v???i quy t???c sau:
// return < 0 th?? A, B gi??? nguy??n th??? t???
// return > 0 th?? A, B ?????o th??? t???

//Ascending

//movs.sort(function(a, b ) {
//  if(a < b) return -1;
//  if(a > b) return 1;
//});
// !! quy t???c ????n gi???n -> a < b th?? a - b < 0 lu??n, a > b th?? a - b > 0 n??n ta c?? th??? vi???t g???n nh?? sau:
//movs.sort((a, b) => a - b);

//console.log(movs);

//Descending

//movs.sort(function(a, b){
//  if(a < b) return 1;
//  if(a > b) return -1; 
//});
//movs.sort((a, b) => b - a);

//console.log(movs);


/*
// ARRAY FROM

const newArr = [1,2,3,4,5,6,7,8];
const newAr = new Array(1,2,3,4,5,6,7,8,9);

//array r???ng v?? fill()
const newA = new Array(7); // khai b??o chu???i r???ng c?? 7 k?? t???
//newA.fill(7); // fill all the array with number 7
newArr.fill(8,5); //fill array with number 8 begin with the index 5
newAr.fill(9,3,6); // fill the array with number 9 from index 3 to 5
newA.map(e => e = 3); // doesnt work
newA.map(e => 3) // doesnt work
// => kh?? l??m g?? v???i array r???ng tr??? l???nh fill


// Array.from()
const x = Array.from({length: 8}, () => 1);
const x2 = Array.from({length: 9}, (val, i) => val = i*2); // c?? th??? chuy???n val th??nh _ nh?? v?? d??? tr??n ???????c v?? val ko c?? gi?? tr???
const y = Array.from('foo');

// Array.from with set
const set = new Set(['foo', 'bar', 'baz', 'foo']);
console.log(set);
console.log(Array.from(set));

//Array.from with map
const map = new Map([[1,2], [2,4], [4,8]]);
console.log(map);
console.log(Array.from(map));
console.log(Array.from(map.values()));
console.log(Array.from(map.keys()));

// RETURN ARGUMENTS TO ARRAY
const f = function(){
  return Array.from(arguments);
}

// WORKING WITH NODELIST

const nodeList = Array.from(document.querySelectorAll('.movements__value'), el => el.textContent.slice(0,-1));


console.log(nodeList);
console.log(f(2,3,4,5));
console.log(newA);
console.log(newArr);
console.log(newAr);
console.log(x);
console.log(x2);
console.log(y);
// => Array.from chuy???n c?? th??? chuy???n map, set ra likeArray
*/


///////////////////////////////////////
//CHALLENGE #3
/*
const calcAverageHumanAgeArrow = array => 
array
.map(value => (value <= 2)?(value * 2):(16 + value * 4))
.filter(age => age >= 18)
.reduce((pre, cur , i, arr) => pre + cur / arr.length, 0);


console.log(calcAverageHumanAgeArrow([5,2,4,1,15,8,3]));
console.log(calcAverageHumanAgeArrow([16,6,10,5,6,1,4]));
*/

//////////////////////////////////////////////
//PRACTICE

//1.
//const bankDepositSum = accounts.map(acc => acc.movements).flat()
const bankDepositSum = accounts.flatMap(acc => acc.movements)
  .filter(bal => bal > 0)
  .reduce((pre, cur) => pre + cur, 0);

console.log(bankDepositSum);

//2.
//const deposite1000 = accounts.flatMap(acc => acc.movements)
//  .filter(bal => bal >= 1000).length;

const deposite1000 = accounts.flatMap(acc => acc.movements)
  .reduce((pre, cur) => (cur >= 1000 ? ++pre : pre),0);

console.log(deposite1000);

// ch?? ?? pre ??? tr??n kh??ng ???????c d??ng pre++ v?? pre++ tr??? l???i gi?? tr??? tr?????c ???? c???a pre tr?????c khi ++, ta ph???i d??ng ++pre
let a = 10;
//console.log(a++);
console.log(++a);
console.log(a);

/////////////////////////////////////////////////////
//V?? D??? QUAN TR???NG
// 3.
// c??ch vi???t h???n
/* const sumOfDepWith = accounts.flatMap(acc => acc.movements)
  .reduce(function(sums, cur) {
    if(cur >= 0) {
      sums.deposit = sums.deposit + cur;
    } else {
      sums.withdrawal = sums.withdrawal + cur;
    }
    return sums;
  }, {deposit: 0, withdrawal: 0})

  console.log(sumOfDepWith);
*/

// vi???t r??t g???n , ch?? ?? ph???i c?? return tr??? l???i v?? ph????ng th???c arrow c?? {} 
const {deposit, withdrawal} = accounts.flatMap(acc => acc.movements)
  .reduce((sums,cur) => {
    //cur >= 0 ? sums.deposit += cur : sums.withdrawal += cur
    sums[cur >= 0 ? 'deposit' : 'withdrawal'] += cur;
    return sums;
  }, {deposit: 0, withdrawal: 0} )

  console.log(deposit);
  console.log(withdrawal);

/////////////////////////////////////////////////////

// 4.

const convertTitleCase = function(title){
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const upperStr = str => str.replace(str[0], str[0].toUpperCase()) // d??ng replace ho???c ????n gi???n d??ng el[0].toUpperCase() + el.slice(1)
  const titleCase = title.toLowerCase()
    .split(' ')
    .map(el => exceptions.includes(el) ? el : upperStr(el)) 
    .join(' ')
    /* .map(el => expections.includes(el)?el:el.replace(el[0], el[0].toUpperCase()))
    .reduce((pre, cur) => pre + ' ' + cur); */

  return upperStr(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE')); // AND ?????NG ?????U KH??NG ???????C VI???T HOA => T???O FUNCTION M???I CHO C??? EL V?? titleCase

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) ????
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them ????
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];


//1.
dogs.forEach(dog => dog.reFood = dog.weight ** 0.75 * 28);
console.log(dogs);
//2.
console.log(dogs.filter(dog => dog.owners.includes('Sarah')).map(dog => dog.curFood > dog.reFood ? 'Eating too much' : 'Eating too little'));
//3.
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.reFood).flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.reFood).flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);
//4.
console.log(ownersEatTooMuch.join(' and ') + "'s dogs eat too much");
console.log(ownersEatTooLittle.join(' and ') + "'s dogs eat too little");
//5.
console.log(dogs.some(dog => dog.curFood === dog.reFood));
//6.
const check = dog => dog.curFood > dog.reFood * 0.9 && dog.curFood < dog.reFood * 1.1;
//console.log(dogs.some(dog => check(dog)));
console.log(dogs.some(check));
//7.
//const listDogs = dogs.filter(dog => check(dog));
const listDogs = dogs.filter(check);
console.log(listDogs);
//8.
console.log(dogs.slice().sort((a, b) => a.reFood - b.reFood));
