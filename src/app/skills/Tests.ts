export class Test {
    skill:string;
    rating:number;
    constructor(a,b) {
      this.skill = a;
      this.rating = b;
    }
  }
  
  
export const TESTS: Test[] = [new Test('C', 5), new Test('C++', 2), new Test('Angular', 3)];

