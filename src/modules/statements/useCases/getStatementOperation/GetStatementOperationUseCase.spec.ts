import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IGetStatementOperationDTO } from "./IGetStatementOperationDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("deve ser capaz de buscar as informações da operação", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    const userCreated = await createUserUseCase.execute(user);

    // console.log(userCreated);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      amount: 100,
      description: "teste de verificação",
      type: OperationType.DEPOSIT,
    }

    const statementResult = await createStatementUseCase.execute(statement);

    const operation: IGetStatementOperationDTO = {
      user_id: userCreated.id as string,
      statement_id: statementResult.id as string
    }

    const info = await getStatementOperationUseCase.execute(operation);

    expect(info).toHaveProperty("id");

  });

  it("não deve ser capaz de buscar as informações da operação se o usuario não existir", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      const userCreated = await createUserUseCase.execute(user);

      // console.log(userCreated);

      const statement: ICreateStatementDTO = {
        user_id: userCreated.id as string,
        amount: 100,
        description: "teste de verificação",
        type: OperationType.DEPOSIT,
      }

      const statementResult = await createStatementUseCase.execute(statement);

      const operation: IGetStatementOperationDTO = {
        user_id: "8df60d70-cc26-4a73-9635-e1ede65868c6",
        statement_id: statementResult.id as string
      }

      const info = await getStatementOperationUseCase.execute(operation);
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });

  it("não deve ser capaz de buscar as informações da operação se o statement não existir", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      const userCreated = await createUserUseCase.execute(user);

      // console.log(userCreated);

      const statement: ICreateStatementDTO = {
        user_id: userCreated.id as string,
        amount: 100,
        description: "teste de verificação",
        type: OperationType.DEPOSIT,
      }

      await createStatementUseCase.execute(statement);

      const operation: IGetStatementOperationDTO = {
        user_id: userCreated.id as string,
        statement_id: "8df60d70-cc26-4a73-9635-e1ede65868c6"
      }

      const info = await getStatementOperationUseCase.execute(operation);
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });
});
