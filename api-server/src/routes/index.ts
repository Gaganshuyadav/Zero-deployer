import { Router } from "express";
import auth from "./auth.route.js";
import user from "./user.route.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post('/', authenticate, (req, res) => {
    console.log(`get request coming... on "/" `)
    res.send('Hello from Nodejs Server!! 😁');
  });
  
  
  router.get('/health', (req, res) => {
    console.log("health check done")
    res.send('Everything is good here 💪');
  });

router.use("/auth",auth);
router.use("/user", user);


export default router;

