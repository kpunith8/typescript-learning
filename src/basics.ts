// export {};
let finished: boolean = false;

console.log("boolean value", finished);

function printAge(age: number): string {
  return "The age is " + age;
}

const getFullName = (fName: string, lName: string): string =>
  fName + " " + lName;

console.log("Arrow functions:", getFullName("Punith", "K"));

console.log("Normal functions:", printAge(19));

let favorites: any[] = ["Name", 12]; // mixed array types
// objects
const person: {
  name: string;
  age: number;
  hobbies: string[];
  role: [number, string];
} = {
  name: "Punith",
  age: 30,
  hobbies: ["Sports", "Cooking"], // inferred as array of strings
  role: [2, "author"],
};

// types will inferred implicitly by TS
// no need to specify the type for person object above

// without specifying the tuple types TS allows to modify content of
// the tuple role for ex: person.role.push('name') is allowed even after the tuple mentioned,
// but cannot assign different types
// after specifying the type as tuple [number, string] it complains or errors out

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

// Tuple - fixed array with 2 elements

// Enums - assigns labels to numbers
enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR, // here first element has value 0, READ_ONLY as 1 and so on by default, can be configurable as number or string
}

// assign any number to enum role
enum Color {
  RED = 1,
  BLUE,
  WHITE,
}

console.log(
  "To know the value in a enum access it using value[index]:",
  Color[2]
);

const person1 = {
  name: "Punith",
  age: 30,
  hobbies: ["Sports", "Cooking"], // inferred as array of strings
  role: Role.ADMIN,
};

// any type - it takes any type, kind of no checking done on type

// union types, using '|' ex: string | number
// literal types; conversionType: 'as-number' | 'as-string'

// type aliases
type Combinable = string | number;
type ConversionDescriptor = "as-string" | "as-number";

function combine(
  input1: Combinable,
  input2: Combinable,
  conversionType: ConversionDescriptor
): void {
  console.log(input1, input2, conversionType);
}

combine("Punith", "K", "as-number");

// Function types - describe the function params and its return types
let combineValues: (
  a: Combinable,
  b: Combinable,
  c: ConversionDescriptor
) => void;
combineValues = combine;

combineValues("Check", "it", "as-string");

// Callbacks
function addAndHandle(num1: number, num2: number, cb: (res: number) => void) {
  const res = num1 + num2;
  cb(res);
}

addAndHandle(10, 20, (result) => {
  console.log("callback with types:", result);
});

// unknown type
let userInput: unknown;

/* never Type */
// The never type represents the type of values that never occur
// never is the return type for a function expression or an arrow
// function expression that always throws an exception or one that never returns;
// The never type is a subtype of, and assignable to, every type
function errorWithNever(message: string): never {
  throw new Error(message);
}

// tuple or array destructuring
let [a1, b1]: [number, string] = [10, "20"];

// object destructuring
let fName: string, lName: string;

({ fName, lName } = { fName: "Punith", lName: "K" });

console.log("object destructuring:", fName, lName);

// default values
function keepWholeObject(wholeObject: { a: string; b?: number }) {
  let { a, b = 1001 } = wholeObject;
}

// Destructuring also works in function declarations.
type Conv = { a: string; b?: number };
function f1({ a, b }: Conv): void {
  console.log(a, b);
}

function f2({ a, b = 0 } = { a: "" }): void {
  // ...
}
f2({ a: "yes" }); // ok, default b = 0
f2(); // ok, default to { a: "" }, which then defaults b = 0
// f2({}); // error, 'a' is required if you supply an argument

/* INTERFACES */
interface SquareConfig {
  color?: string; // optional values
  width?: number;
  [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }

  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

console.log("Interfaces:", createSquare({ width: 122 }));

// One final way to get around these checks, which might be a bit surprising,
// is to assign the object to another variable: Since squareOptions won’t undergo excess property checks,
// the compiler won’t give you an error.

let squareOptions = { colour: "red", width: 100 }; // colour doesn't exist as a prop in SquareConfig
let mySquare = createSquare(squareOptions);

// readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 11; // not allowed

// TypeScript comes with a ReadonlyArray<T> type that is the same as Array<T> with all mutating methods removed.
let a: number[] = [1, 2, 3, 4];
let aa: Array<number> = [5, 6, 7, 8];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // error!
// ro.push(5); // error!
// ro.length = 100; // error!
// a = ro; // error!

// Variables use `const` whereas properties use `readonly`.

// Function types
// interfaces are also capable of describing function types.

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (src: string, subStr: string) {
  // types can be ignored here for the params
  let result = src.search(subStr);
  return result > -1;
};

console.log("Interface: function types:", mySearch("Punith", "it"));

// Indexable types
// Indexable types have an index signature that describes the types we can use to
// index into the object, along with the corresponding return types when indexing.
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

console.log("Interface: indexable array:", myStr);

// There are two types of supported index signatures: string and number
// It is possible to support both types of indexers, but the type returned from a numeric
// indexer must be a subtype of the type returned from the string indexer
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok, length is a number
  // name: string;      // error, the type of 'name' is not a subtype of the indexer
}

interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}

// Finally, you can make index signatures 'readonly' in order to prevent assignment to their indices:
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray1: ReadonlyStringArray = ["Alice", "Bob"];
// myArray1[2] = "Mallory"; // error!

// Class types
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  hour: number;
  minutes: number;

  setTime(d: Date) {
    this.currentTime = d;
  }

  constructor(h: number, m: number) {
    this.hour = h;
    this.minutes = m;
  }
}

// Extending interfaces
// Like classes, interfaces can extend each other. This allows you to copy the members of one interface into another,
// which gives you more flexibility in how you separate your interfaces into reusable components
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;

console.log("Interface: extending:", square);

// An interface can extend multiple interfaces, creating a combination of all of the interfaces.
interface PenStroke {
  penWidth: number;
}

interface Square1 extends Shape, PenStroke {
  sideLength: number;
}

let square1 = {} as Square1;
square1.color = "blue";
square1.sideLength = 10;
square1.penWidth = 5.0;

console.log("Interface: extending multiple interfaces:", square1);

// Hybrid types
// example is an object that acts as both a function and an object, with additional properties
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// CLASSES

class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);

class Animal1 {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal1 {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animal1 {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);

// Public, private, and protected modifiers; public by default

// ECMAScript Private Fields - only supported from ES2015
class Animal2 {
  #name: string;
  constructor(theName: string) {
    this.#name = theName;
  }
}

// new Animal2("Cat").#name; // Property '#name' is not accessible outside class 'Animal' because it has a private identifier

// private
// TypeScript also has it’s own way to declare a member as being marked private,
// it cannot be accessed from outside of its containing class. For example:

class Animal3 {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

// new Animal3("Cat").name; // Error: 'name' is private;

// protected
// The protected modifier acts much like the private modifier with the exception
// that members declared protected can also be accessed within deriving classes
class Person {
  protected name: string;
  protected constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name); // error

// A constructor may also be marked protected. This means that the class
// cannot be instantiated outside of its containing class, but can be extended.
// let john = new Person("John"); // Error: The 'Person' constructor is protected

// Readonly modifier
// You can make properties readonly by using the readonly keyword.
// Readonly properties must be initialized at their declaration or in the constructor.

class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}

let dad = new Octopus("Man with the 8 strong legs");
// dad.name = "Man with the 3-piece suit"; // error! name is readonly.

// Parameter properties - Parameter properties let you create and initialize a member in one place
class Octopus1 {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {}
}

// Parameter properties are declared by prefixing a constructor parameter with an
// accessibility modifier or readonly, or both. Using private for
// a parameter property declares and initializes a private member;
// likewise, the same is done for public, protected, and readonly

// Accessors
// TypeScript supports getters/setters as a way of intercepting accesses to a member of an object
const fullNameMaxLength = 10;

class Employee1 {
  constructor(private _fullName: string) {}

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee1("Bob bob");
employee.fullName = "Bob Smith";
if (employee.fullName) {
  console.log(employee.fullName);
}

// Static properties
// static members of a class, those that are visible on the class itself rather than on the instances.
class Grid {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}

let grid1 = new Grid(1.0); // 1x scale

console.log(
  "Classes: static props:",
  grid1.calculateDistanceFromOrigin({ x: 10, y: 10 })
);

// Abstract Classes
// cannot be instantiated directly, can have implementation

// Functions
// using rest params
function buildName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}

console.log(
  "Passing rest params to a function:",
  buildName("Punith", "K", "Anku")
);

interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

console.log("Using this", pickedCard);

/* Generics */

function identity<T>(arg: T): T {
  return arg;
}

const strIdentity = identity<string>("Hello");
const numIdentity = identity<number>(1);

// can also be written with type argument inference
// compiler to set the value of T for us automatically based on the type of the argument we pass in
const numIdentity1 = identity(1);

console.log("Generics:", strIdentity, numIdentity);

function loggingIdentity<T>(arg: T): T {
  // console.log(arg.length);  // Error: T doesn't have .length
  return arg;
}

// It can be written as
function loggingIdentity1<T>(arg: T[]): T[] {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}

// And also can be written as
function loggingIdentity2<T>(arg: Array<T>): Array<T> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Punith",
  age: 32,
};

console.log(user.name, user.age);

class UserAccount {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const userAccount: User = new UserAccount("Murphy", 22);

function getAdminUser(): User {
  return userAccount;
}

function updateUser(user: User) {
  return user;
}

console.log(userAccount.age, getAdminUser());

// Composing types
// 1. Unions
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

function setWindowState(windowState: WindowStates): WindowStates {
  console.log("setWindowState", windowState);
  return windowState;
}

setWindowState("open");

function getLength(obj: string | string[]): number {
  return obj.length;
}

console.log(
  "Length of string or array",
  getLength("Punith"),
  getLength(["1", "2"])
);

// Generics
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// Jack Herrington - Youtube

// Setting type for setting dynamic properties on object
const ids: Record<number, string> = {
  10: "a",
  20: "b",
};

// Throws an error, because property 30 is inferred as a type string
// Use the type, Record specifying the type explicitly
ids[30] = "c";

// Function as a callback
function printToFile(text: string, callback: () => void): void {
  callback();
}

// Function as a callback accepting params
function mutateArray(
  numbers: number[],
  mutate: (n: number) => number
): number[] {
  return numbers.map(mutate);
}

// Declare type for function
type MutationFunction = (v: number) => number;

function mutateArray1(numbers: number[], mutate: MutationFunction): number[] {
  return numbers.map(mutate);
}

// Higher order function
function adder(num: number): (val: number) => number {
  return (val: number) => num + val;
}

// Function overloading
interface Coordinate {
  x: number;
  y: number;
}

function parseCoordinate(str: string): Coordinate;
function parseCoordinate(obj: Coordinate): Coordinate;
function parseCoordinate(x: number, y: number): Coordinate;
function parseCoordinate(arg1: unknown, arg2?: unknown): Coordinate {
  let coord: Coordinate = {
    x: 0,
    y: 0,
  };

  if (typeof arg1 === "object") {
    coord = { ...(arg1 as Coordinate) };
  } else if (typeof arg1 === "string") {
    (arg1 as string).split(",").forEach((str) => {
      const [key, value] = str.split(":");
      coord[key as "x" | "y"] = parseInt(value);
    });
  } else {
    coord = {
      x: arg1 as number,
      y: arg2 as number,
    };
  }

  return coord;
}

console.log(
  "Function overloading:",
  parseCoordinate({ x: 10, y: 20 }),
  parseCoordinate(20, 30),
  parseCoordinate("x:22,y:33")
);


// Optionals