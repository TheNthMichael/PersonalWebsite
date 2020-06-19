export class Test {
    skill:string;
    rating:number;
    constructor(a,b) {
      this.skill = a;
      this.rating = b;
    }
  }
  
  
export const TESTS: Test[] = [
  new Test('C', 3), 
  new Test('C++', 3), 
  new Test('Angular', 2),
];

export const TESTS2: Test[] = [
  new Test('Python', 2),
  new Test('Java', 3),
  new Test('NodeJS', 2)
];


