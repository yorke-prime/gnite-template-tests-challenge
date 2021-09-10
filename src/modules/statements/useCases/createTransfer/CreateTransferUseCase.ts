import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ITransferDto } from "../../dtos/ITransferDTO";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITranfersRepository } from "../../repositories/ITransfersRepoisoty";
import { CreateStatementError } from "../createStatement/CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITranfersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
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

/*     if('withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    } */

    const transfers = await this.transfersRepository.getTransferBalance(sender_id);
    const balance = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
      with_statement: true,
    });

    let totalTranfer = transfers.balance;
    let totalStatement = balance.balance;

    console.log(`totalTranfer: ${totalTranfer}`);
    console.log(`totalStatement: ${totalStatement}`);

    const total = totalStatement - totalTranfer;

    console.log(`total: ${total}`);

    if(total <= 0) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const transfer = await this.transfersRepository.create({
      amount,
      description,
      sender_id
    });

    return transfer;
  };
}

export { CreateTransferUseCase };
