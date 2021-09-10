import { Statement } from "../entities/Statement";
import { Transfer } from "../entities/Transfer";

export class BalanceMap {
  static toDTO({ statement, balance, transfer }: { statement: Statement[], balance: number, transfer: Transfer[] }) {
    // console.log(transfer);
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    const parsedTransfer = transfer.map(({
      id,
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
      sender_id,
      amount: Number(amount),
      description,
      type,
      created_at,
      updated_at
      }
    ));


    return {
      statement: parsedStatement,
      balance: Number(balance),
      transfer: parsedTransfer
    }
  }
}
