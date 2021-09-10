import { getRepository, Repository } from "typeorm";
import { ITransferDto } from "../dtos/ITransferDTO";
import { Transfer } from "../entities/Transfer";
import { ITranfersRepository } from "./ITransfersRepoisoty";

class TransfersRepository implements ITranfersRepository {
  private repository: Repository<Transfer>;
  constructor() {
    this.repository = getRepository(Transfer);
  }
  async create({
    amount,
    description,
    sender_id,
  }: ITransferDto): Promise<Transfer> {
    const transfer = this.repository.create({
      amount,
      description,
      sender_id,
    });

    await this.repository.save(transfer);

    return transfer;
  }

  async getTransferBalance(sender_id: string): Promise<{ balance: number, transfer: Transfer[] }> {
    const transfer = await this.repository.find({ sender_id });
    const balance = transfer.reduce((acc, operation) => {
      return acc + Number(operation.amount);
    }, 0);
    return { balance, transfer };
  }
}

export { TransfersRepository };
