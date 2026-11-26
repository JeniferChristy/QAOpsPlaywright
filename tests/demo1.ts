import { Expect, type Locator, type Page } from "@playwright/test";


let message1 :string ="Hello Jenifer";
message1="bye";
console.log(message1);
let age1: number=20;
console.log(age1);
let isActive: boolean =false;

let numbers1: number[] = [1,2,3];

let data: any ="hello ji";
data=55;

//adding functions
function add(a:number,b:number): number
{
    return a+b;
}
 add(3,4);
 console.log(add);

 //declaring objects
 let user: {name:string, age:number,location:string} ={name:"Joy", age:30, location:"coimbatore"};
 user.location="Coimbatore";

 class CartPage
{
    page:Page;
    cartProducts: Locator;
    checkoutButton: Locator;
    constructor(page:any)
    {
        this.page = page;
        this.cartProducts = page.locator("div li h3");
        this.checkoutButton = page.locator("text=Checkout");
    }
}
