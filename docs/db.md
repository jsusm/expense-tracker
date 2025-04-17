# Database docs

## Dataase Schema
### Categories
- id
- label
- description

### Tags
- id
- label
- description

### Transactions
- id
- date_time
- description
- category_id
- amount
- currency

### Transactions_Tags
- transaction_id
- tag_id

## Procedures
When a transaction is created it will create categories and tags and
insert necesary relation Fields


