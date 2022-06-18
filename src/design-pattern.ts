import {RecordHandler, loader} from './loader'

// Design Patterns - https://www.youtube.com/watch?v=D40olxrDw38

// In menory database

interface Pokemon {
  id: string;
  attack: number;
  defence: number;
}

interface BaseRecord {
  id: string;
}

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
  // Observer pattern
  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;

  // Visitor Pattern
  visit(visitor: (item: T) => void): void;
}

// class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
//   private db: Record<string, T> = {}

//   public set(newValue: T): void {
//     this.db[newValue.id] = newValue
//   }

//   public get(id: string): T | undefined {
//     return this.db[id]
//   }
// }

// const pokemonDB = new InMemoryDatabase<Pokemon>()
// pokemonDB.set({ id: '1', attack: 10, defence: 5 })
// console.log('\nIn memory DB example:')
// console.log('Get the pokemon with id 1:', pokemonDB.get('1'))

// Observer Pattern

type Listener<EventType> = (ev: EventType) => void;

// observer
function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

// Factory Pattern with singleton pattern
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    // Singleton pattern: Instead of a getInstance() static method, we
    // can access the instace property to get singleton instance
    // static instance: InMemoryDatabase = new InMemoryDatabase()

    // Create a private constructor so that no one can create a instance of it, static instance property can only be used to access the instance of this createDatabase
    private constructor() {}

    set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });
      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({ value: newValue });
    }

    get(id: string): T | undefined {
      return this.db[id];
    }

    // Observer pattern
    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }

    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }

    // Visitor Pattern
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    // Strategy Pattern
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = { max: 0, item: undefined };

      Object.values(this.db).reduce((acc, val) => {
        const score = scoreStrategy(val);

        if (score > acc.max) {
          (acc.max = score), (acc.item = val);
        }

        return acc;
      }, found);

      return found.item;
    }

    // Singleton Pattern
    // staic methods can only access static property not private variables
    static getInstance(): InMemoryDatabase {
      return new InMemoryDatabase();
    }
  }

  // Factory Pattern
  return InMemoryDatabase;
}

const PokemonDB = createDatabase<Pokemon>();
const pmDB = PokemonDB.getInstance();

// Adapter Pattern
class PokemonDBAdapter implements RecordHandler<Pokemon> {
  addRecord(record: Pokemon) {
    pmDB.set(record)
  }
}

pmDB.onAfterAdd(({ value }) => console.log("onAfterAdd:", { value }));

loader('./db.json', new PokemonDBAdapter())

pmDB.set({ id: "2", attack: 140, defence: 6 });
pmDB.set({ id: "3", attack: 122, defence: 68 });

console.log("\nObserver Pattern:");
// Subscribe to the events
const unsubBeforeAdd = pmDB.onBeforeAdd(({ value, newValue }) =>
  console.log("onBeforeAdd:", { value, newValue })
);  

unsubBeforeAdd();

console.log("\nFactory Pattern:");
console.log("Get the pokemon with id 2:", pmDB.get("2"));

console.log("Visitor Pattern:");
pmDB.visit((item) => console.log(item.id));

console.log("Strategy Pattern:");
const bestAttack = pmDB.selectBest(({ attack }) => attack);
const bestDefense = pmDB.selectBest(({ defence }) => defence);

console.log(`Best attack: ${bestAttack?.id}`);
console.log(`Best defence: ${bestDefense?.id}`);
