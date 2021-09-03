import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ITransferDto } from "../../dtos/ITransferDTO";
import { Transfer } from "../../entities/Transfer";
import { ITranfersRepository } from "../../repositories/ITransfersRepoisoty";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITranfersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}
  async execute({
    amount,
    description,
    sender_id,
  }: ITransferDto, recipient_id: string): Promise<Transfer> {

    const recipient = await this.usersRepository.findById(recipient_id);


    if (!recipient) {
      throw new AppError("User does not exist");
    }

    const transfer = await this.transfersRepository.create({
      amount,
      description,
      sender_id
    });
    console.log(transfer);


    return transfer;
  };
}

export { CreateTransferUseCase };
