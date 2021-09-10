import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITranfersRepository } from "../../repositories/ITransfersRepoisoty";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface total {

}

interface IResponse {
  statement: Statement[];
  balance: number;
  transfer: Transfer[];
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('TransfersRepository')
    private transfersRepository: ITranfersRepository
  ) {}

  async execute({ user_id }: IRequest): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const transfers = await this.transfersRepository.getTransferBalance(user_id);
    console.log(transfers)
    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true,
    });
    const balanceTotal = balance.balance - transfers.balance;

    const total = Object.assign( balance, transfers );

    total.balance = balanceTotal;
    console.log(total);

    return total;
  }
}
