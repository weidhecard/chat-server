import {
    IndexController,
    WikiController,
    AuthController,
    UserController,
    ProfileController,
    ChatController,
} from "../managers/autoload";
import { Authenticate, ErrorHandler } from "../managers/autoload";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();
const indexController = new IndexController();
const authController = new AuthController();
const userController = new UserController();
const profileController = new ProfileController();
const wikiController = new WikiController();
const chatController = new ChatController();

// Middlewares top
router.use("/users/profile", Authenticate.check);

// Index
router.get("/", indexController.index.bind(indexController));
router.get("/.well-known/openid-configuration", indexController.openIdConfig.bind(userController));

// Auth
router.post("/users/auth/token", authController.getToken.bind(authController));
router.post("/users/auth", authController.authenticate.bind(authController));
router.post("/users/auth/sso", authController.authenticateSSO.bind(authController));
router.get("/users/auth/logout", authController.logout.bind(authController));

// User
router.post("/users/create", userController.create.bind(userController));

// Profile
router.get("/users/profile", profileController.get.bind(profileController));
router.put("/users/profile", profileController.update.bind(profileController));

// Chat
router.get("/chat/messages/:roomId", chatController.getMessages.bind(chatController));
router.post("/chat/rooms", chatController.getRooms.bind(chatController));

// Wiki API
router.get("/wiki", wikiController.getAll.bind(wikiController));
router.get("/wiki/:id", wikiController.get.bind(wikiController));
router.delete("/wiki", wikiController.deleteMany.bind(wikiController));

// Middlewares Bottom
router.use("/token", ErrorHandler.default);
router.use("/users", ErrorHandler.default);
router.use("/users/create", ErrorHandler.default);
router.use("/users/profile", ErrorHandler.default);
router.use("/wiki", ErrorHandler.default);

export { router as indexRouter };
