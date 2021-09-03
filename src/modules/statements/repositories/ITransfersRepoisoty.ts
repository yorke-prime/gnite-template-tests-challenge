import { ITransferDto } from "../dtos/ITransferDTO";
import { Transfer } from "../entities/Transfer";

interface ITranfersRepository {
  create({amount, description, sender_id }: ITransferDto): Promise<Transfer>;
}

export { ITranfersRepository };
