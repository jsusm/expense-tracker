export interface Transaction {
	id: string;
	amount: number;
	dateTime: string;
	iconName: string,
	category: string,
	tags: string[],
	description: string,
}

export interface Category {
	label: string,
	id: string,
}

const transactions: Transaction[] = [
	{
		"id": "txn_001",
		"amount": 1850.50,
		"dateTime": "2025-04-11T14:30:00Z",
		"iconName": "basket-shopping",
		"category": "Groceries",
		"tags": ["weekly", "market", "food"],
		"description": "Compra semanal en Central Madeirense"
	},
	{
		"id": "txn_002",
		"amount": 55.00,
		"dateTime": "2025-04-11T08:15:00Z",
		"iconName": "bus-simple",
		"category": "Transportation",
		"tags": ["commute", "public transport"],
		"description": "Pasaje Metro Caracas ida y vuelta"
	},
	{
		"id": "txn_003",
		"amount": 320.00,
		"dateTime": "2025-04-10T19:45:00Z",
		"iconName": "utensils",
		"category": "Dining Out",
		"tags": ["dinner", "friends"],
		"description": "Cena en Arepa Factory con amigos"
	},
	{
		"id": "txn_004",
		"amount": 95.75,
		"dateTime": "2025-04-10T09:00:00Z",
		"iconName": "mug-saucer",
		"category": "Coffee Shop",
		"tags": ["morning", "cafe"],
		"description": "Café y cachito en panadería"
	},
	{
		"id": "txn_005",
		"amount": 750.00,
		"dateTime": "2025-04-09T11:20:00Z",
		"iconName": "bolt",
		"category": "Utilities",
		"tags": ["electricity", "monthly bill"],
		"description": "Pago de factura eléctrica Corpoelec"
	},
	{
		"id": "txn_006",
		"amount": 450.00,
		"dateTime": "2025-04-08T16:05:00Z",
		"iconName": "film",
		"category": "Entertainment",
		"tags": ["movie", "cinema"],
		"description": "Entradas de cine Cines Unidos"
	},
	{
		"id": "txn_007",
		"amount": 250.00,
		"dateTime": "2025-04-07T13:10:00Z",
		"iconName": "burger",
		"category": "Lunch",
		"tags": ["work", "fast food"],
		"description": "Almuerzo rápido cerca de la oficina"
	},
	{
		"id": "txn_008",
		"amount": 600.00,
		"dateTime": "2025-04-06T10:00:00Z",
		"iconName": "shirt",
		"category": "Clothing",
		"tags": ["shopping"],
		"description": "Camisa nueva en Sambil"
	},
	{
		"id": "txn_009",
		"amount": 15.99,
		"dateTime": "2025-04-05T00:00:01Z",
		"iconName": "credit-card",
		"category": "Subscriptions",
		"tags": ["streaming", "monthly"],
		"description": "Netflix monthly subscription"
	},
	{
		"id": "txn_010",
		"amount": 300.50,
		"dateTime": "2025-04-04T15:00:00Z",
		"iconName": "gas-pump",
		"category": "Transportation",
		"tags": ["car", "fuel"],
		"description": "Gasolina para el carro"
	},
	{
		"id": "txn_011",
		"amount": 220.00,
		"dateTime": "2025-04-03T18:30:00Z",
		"iconName": "pills",
		"category": "Pharmacy",
		"tags": ["health", "medicine"],
		"description": "Compra en Farmatodo"
	},
	{
		"id": "txn_012",
		"amount": 120.00,
		"dateTime": "2025-04-02T12:15:00Z",
		"iconName": "mobile-screen-button",
		"category": "Utilities",
		"tags": ["phone", "top-up"],
		"description": "Recarga de saldo celular Movistar"
	},
	{
		"id": "txn_013",
		"amount": 4000.00,
		"dateTime": "2025-04-01T09:00:00Z",
		"iconName": "house-chimney-window",
		"category": "Rent",
		"tags": ["housing", "monthly"],
		"description": "Pago alquiler Abril"
	},
	{
		"id": "txn_014",
		"amount": 85.00,
		"dateTime": "2025-03-31T20:00:00Z",
		"iconName": "pizza-slice",
		"category": "Dining Out",
		"tags": ["takeaway", "pizza"],
		"description": "Pizza para llevar"
	},
	{
		"id": "txn_015",
		"amount": 150.00,
		"dateTime": "2025-03-30T11:00:00Z",
		"iconName": "book",
		"category": "Shopping",
		"tags": ["books", "hobby"],
		"description": "Libro en Tecni-Ciencia Libros"
	},
	{
		"id": "txn_016",
		"amount": 65.00,
		"dateTime": "2025-03-29T17:00:00Z",
		"iconName": "car-burst",
		"category": "Transportation",
		"tags": ["car", "maintenance", "repair"],
		"description": "Cambio de aceite"
	}
]

export async function getCategories(): Promise<Category[]> {
	const categories: Record<string, string> = {}
	transactions.forEach(t => {
		categories[t.category] = t.id
	})
	return Object.entries(categories).map(v => ({ id: v[1], label: v[0] }))
}
export async function getTransactions() {
	return transactions
}
export async function getTransactionById(id: string) {
	return transactions.find(t => t.id == id)
}
