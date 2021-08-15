import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Criar User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("deve ser capaz de criar um usuario", async () => {
    const user:ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    const resultUser = await createUserUseCase.execute(user);

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("deve ser capaz de vereficar se um usario já existe", () => {
    expect(async () => {
      const user = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
