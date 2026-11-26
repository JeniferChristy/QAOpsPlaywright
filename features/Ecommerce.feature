Feature: : Ecommerce validations
    @Regression
    Scenario: Placing the order
        Given a login to Ecommerce application with "${ECOM_EMAIL}" and "${ECOM_PASSWORD}"
        When Add "zara coat 3" to cart
        Then Verify "zara coat 3" is dispalyed in the cart
        When Enter valid details and place the order
        Then verify order is present in the OrderHistory

      @Validation
    Scenario Outline: Placing the order
        Given a login to Ecommerce2 application with "<username>" and "<password>"
        Then verify Error message is displayed

        Examples:
        | username                                 | password   |
        | ${ECOM_EMAIL}                            | ${ECOM_PASSWORD} |
        | hello@123.com                            | Iamhello1234 |



