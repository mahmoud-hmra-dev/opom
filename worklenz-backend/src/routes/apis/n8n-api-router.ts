import express from "express";
import n8nAuthMiddleware from "../../middlewares/n8n-auth-middleware";
import KpiController from "../../controllers/kpi-controller";

const n8nApiRouter = express.Router();

// KPI Routes
n8nApiRouter.post("/kpi", n8nAuthMiddleware(KpiController.create));
n8nApiRouter.get("/kpi",  n8nAuthMiddleware(KpiController.get));
n8nApiRouter.get("/kpi:id", n8nAuthMiddleware(KpiController.getById));
n8nApiRouter.put("/kpi:id", n8nAuthMiddleware(KpiController.update));
n8nApiRouter.get("/user/kpi:user_id", n8nAuthMiddleware(KpiController.getByUserId));
n8nApiRouter.delete("/kpi:id", n8nAuthMiddleware(KpiController.deleteById));


export default n8nApiRouter;
