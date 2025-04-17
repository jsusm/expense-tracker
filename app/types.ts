export type Budget = {
  label: string;
  id: number;
}

export type Transaction = {
  id: number,
  amount: number,
  datetime: string,
  budget: Budget,
  tags: string[],
  description: string,
}

export type Tag = {
  label: string,
}
