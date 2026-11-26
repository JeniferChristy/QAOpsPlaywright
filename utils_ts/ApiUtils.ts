export class ApiUtils
{
    apiContext:any;
    loginPayLoad:string;

    constructor(apiContext:any, loginPayLoad:string)
    {
        this.apiContext= apiContext;
        this.loginPayLoad= loginPayLoad;
    }
    async getToken()
    {
    const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad,
        })

        //expect((loginResponse).ok()).toBeTruthy();                          //checking response code is success
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        console.log(token);
        return token;

    }

    async createOrder(orderPayload:string)
    {
        let response= {token:String,orderId:String};
        response.token = await this.getToken();
        const orderResponse =await  this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",     //create order api
                {
                    data : orderPayload,
                    headers:{
                                'Authorization' : response.token,
                                'Content-Type' : 'application/json'
                            },
                });
                //expect(orderResponse.ok()).toBeTruthy();
                const orderResponseJson= await orderResponse.json();
                console.log(orderResponseJson);
                
                const orderId= orderResponseJson.orders[0];
                response.orderId= orderId;
                return response;
                
    }
}
module.exports={ApiUtils};