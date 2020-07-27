import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({
      select: ['value'],
      where: { type: 'income' },
    });

    const outcomeTransactions = await this.find({
      select: ['value'],
      where: { type: 'outcome' },
    });

    const income = incomeTransactions.reduce((acc, current: Transaction) => {
      return acc + current.value;
    }, 0);

    const outcome = outcomeTransactions.reduce((acc, current: Transaction) => {
      return acc + current.value;
    }, 0);

    const total = income - outcome;

    return { income, outcome, total };

    // const { income } = await getConnection()
    //  .createQueryBuilder()
    //  .select('coalesce(sum(transactions.value), 0)', 'income')
    //  .from(Transaction, 'transactions')
    //  .where("type = 'income'")
    //  .getRawOne();
    // const { outcome } = await getConnection()
    //  .createQueryBuilder()
    //  .select('coalesce(sum(transactions.value), 0)', 'outcome')
    //  .from(Transaction, 'transactions')
    //  .where("type = 'outcome'")
    //  .getRawOne();
    //
    // const incomeNumber = Number(income);
    // const outcomeNumber = Number(outcome);
    //
    // const total = incomeNumber - outcomeNumber;
    //
    // return { income, outcome, total };
  }
}

export default TransactionsRepository;
