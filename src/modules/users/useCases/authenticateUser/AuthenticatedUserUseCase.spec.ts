import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Atenticação de usuario", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("deve ser capaz de autenticar usuario", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    await createUserUseCase.execute(user);

    const login = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });


    expect(login).toHaveProperty("token");
  });

  it("não deve ser capaz de autenticar um usuário inexistente", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@look.com",
        password: "teste123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("não deve ser capaz de autenticar com senha incorreta", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "test1@test.com",
        password: "testabc",
        name: "Test",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "test1@test.com",
        password: "testabcd",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
