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
}

export { TransfersRepository };
