import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Buscar Informações de Usuario", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("deve ser capaz de buscar informações do usuario", async () => {
    const usuario: ICreateUserDTO = {
      name: "Test",
      email: "test@test.com",
      password: "test123"
    };

    const result = await createUserUseCase.execute(usuario);

    const user = await inMemoryUsersRepository.findById(result.id as string);

    expect(user).toHaveProperty("id");
  });

  it("não deve ser capaz de mostrar um usuario inexistente", () => {
    expect(async () => {
      const usuario: ICreateUserDTO = {
        name: "Test",
        email: "test@test.com",
        password: "test123"
      };

      await createUserUseCase.execute(usuario);

      await inMemoryUsersRepository.findById("9da6e2a8-1fe8-48k9-96f9-6898edadb479");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
