import { logConfig } from "../../config/log";
import { redisConfig } from "../../config/redis";
import { corsConfig } from "../../config/cors";
import { databaseConfig } from "../../config/database";
import { seedDefault } from "../../storage/seeders/seedDefault";
import { logger } from "./logger/logger";
import { SocketIo } from "./socketio/socketio";
import { IndexController } from "../controllers/indexController";
import { AuthController } from "../controllers/user/authController";
import { UserController } from "../controllers/user/userController";
import { ProfileController } from "../controllers/user/profileController";
import { WikiController } from "../controllers/wikiController";
import { ChatController } from "../controllers/chatController";
import { Authenticate } from "../controllers/middlewares/authenticate";
import { ErrorHandler } from "../controllers/middlewares/errorHandler";
import { Base } from "../models/Base";
import { User } from "../models/User";
import { Room } from "../models/Room";
import { Message } from "../models/Message";
import { Wiki } from "../models/Wiki";
import { DatabaseService } from "../services/databaseService";
import { UserService } from "../services/userService";
import { WikiService } from "../services/wikiService";
import { MessageService } from "../services/chat/messageService";
import { RoomService } from "../services/chat/roomService";

// Configs
export { logConfig, redisConfig, corsConfig, databaseConfig };
// Managers
export { logger, SocketIo };
// Database Seeds
export { seedDefault };
// Controllers
export { IndexController, AuthController, UserController, ProfileController, WikiController, ChatController };
// Middlewares
export { Authenticate, ErrorHandler };
// Models
export { Base, User, Room, Message, Wiki };
// Services
export { DatabaseService, UserService, WikiService, MessageService, RoomService };
