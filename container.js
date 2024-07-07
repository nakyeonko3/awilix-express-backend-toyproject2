import awilix from "awilix";
import { UserRepository, UserController, UserService } from "./users/index.js";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  userRepository: awilix.asClass(UserRepository),
  userService: awilix.asClass(UserService),
  userController: awilix.asClass(UserController),
});

export { container };
