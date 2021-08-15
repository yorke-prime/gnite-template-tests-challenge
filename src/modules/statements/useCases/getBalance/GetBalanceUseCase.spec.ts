import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("deve ser capaz de buscar o balance", async () => {
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

    const balance = await getBalanceUseCase.execute({
      user_id: userCreated.id as string,
    });

    expect(balance).toHaveProperty("balance");

  });

  it("não deve ser capaz de buscar o balance se o usuario na exisitr", () => {
    expect(async () => {
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

      await createStatementUseCase.execute(statement);

      const balance = await getBalanceUseCase.execute({
        user_id: "2df60d70-cc26-4a73-9635-e1ede65868c8",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
