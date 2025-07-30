import express from "express";

import KpiController from "../../controllers/kpi-controller";

const kpiApiRouter = express.Router();

kpiApiRouter.post("/", KpiController.create);
kpiApiRouter.get("/", KpiController.get);
kpiApiRouter.get("/:id", KpiController.getById);
kpiApiRouter.put("/:id", KpiController.update);
kpiApiRouter.get("/user/:user_id", KpiController.getByUserId);
kpiApiRouter.delete("/:id", KpiController.deleteById);

export default kpiApiRouter;
