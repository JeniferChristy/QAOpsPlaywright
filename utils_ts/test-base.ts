import{test as baseTest} from '@playwright/test';
import { env } from '../utils/credentials';
interface TestDataForOrder
{
    username:string;
    password:string;
    productName:string;
};
export const customTest = baseTest.extend<{testDataForOrder: TestDataForOrder}>(
    {
    testDataForOrder : {
    username:env('ECOM_EMAIL'),
    password:env('ECOM_PASSWORD'),
    productName:"Zara Coat 3"
    }
    }
)