# Tickets

## Routes

|      Route       | Method |              Body              |               Purpose                |
| :--------------: | :----: | :----------------------------: | :----------------------------------: |
|   /api/tickets   |  GET   |              ---               |         Retrieve all tickets         |
| /api/tickets/:id |  GET   |              ---               | Retrieve a ticket with a specific ID |
|   /api/tickets   |  POST  | {title: string, price: string} |           Create a ticket            |
|   /api/tickets   |  PUT   | {title: string, price: string} |           Update a ticket            |
