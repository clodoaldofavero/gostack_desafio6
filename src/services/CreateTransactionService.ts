import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: 'string';
  value: number;
  type: 'income' | 'outcome';
  category: 'string';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Invalid balance');
    }

    const foundCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id = '0';
    if (!foundCategory) {
      const categoryNew = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryNew);

      category_id = categoryNew.id;
    } else {
      category_id = foundCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
