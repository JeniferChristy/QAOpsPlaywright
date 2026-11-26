Feature: : Ecommerce validations
    @Validation
    Scenario Outline: Placing the order
        Given a login to Ecommerce2 application with "<username>" and "<password>"
        Then verify Error message is displayed

        Examples:
        | username                                 | password   |
        | ${ECOM_EMAIL}                            | ${ECOM_PASSWORD} |
        | hello@123.com                            | Iamhello1234 |





