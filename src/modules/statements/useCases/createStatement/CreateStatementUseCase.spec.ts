import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("deve ser capaz de fazer uma operação DEPOSIT ", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      amount: 100,
      description: "teste de verificação",
      type: OperationType.DEPOSIT,
    }

    const statementOperation = await createStatementUseCase.execute(statement);

    expect(statementOperation).toHaveProperty("id");

  });

  it("deve ser capaz de fazer uma operação withdraw ", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    const userCreated = await createUserUseCase.execute(user);

    const statementDeposit: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      amount: 100,
      description: "teste de verificação",
      type: OperationType.DEPOSIT,
    }

    await createStatementUseCase.execute(statementDeposit);

    const statementWithdraw: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      amount: 100,
      description: "teste de verificação",
      type: OperationType.WITHDRAW,
    }

    const statementResult = await createStatementUseCase.execute(statementWithdraw);

    expect(statementResult).toHaveProperty("id");
  });

  it("não deve ser capaz de fazer uma operação se o usuario não existir ", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      const userCreated = await createUserUseCase.execute(user);

      const statement: ICreateStatementDTO = {
        user_id: "2df60d70-cc26-4a73-9635-e1ede65868c8",
        amount: 100,
        description: "teste de verificação",
        type: OperationType.DEPOSIT,
      }

      const statementOperation = await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError);

  });

  it("não deve ser capaz de fazer uma operação withdraw se os fundos forem insuficiente ", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      const userCreated = await createUserUseCase.execute(user);

      const statementDeposit: ICreateStatementDTO = {
        user_id: userCreated.id as string,
        amount: 100,
        description: "teste de verificação",
        type: OperationType.DEPOSIT,
      }

      await createStatementUseCase.execute(statementDeposit);

      const statementWithdraw: ICreateStatementDTO = {
        user_id: userCreated.id as string,
        amount: 1,
        description: "teste de verificação",
        type: OperationType.WITHDRAW,
      }

      const statementOperation = await createStatementUseCase.execute(statementWithdraw);

      expect(statementOperation).toHaveProperty("id");

    }).rejects.toBeInstanceOf(CreateStatementError);
  });


});
