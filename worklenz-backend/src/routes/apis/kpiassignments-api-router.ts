import express from "express";

import KpiassignmentsController from "../../controllers/kpiassignments-controller";

const kpiassignmentsApiRouter = express.Router();

kpiassignmentsApiRouter.post("/", KpiassignmentsController.create);
kpiassignmentsApiRouter.get("/", KpiassignmentsController.getAll);
kpiassignmentsApiRouter.get("/:id", KpiassignmentsController.getById);
kpiassignmentsApiRouter.get("/user/:user_id", KpiassignmentsController.getByUserId); // New endpoint
kpiassignmentsApiRouter.get("/task/:task_id", KpiassignmentsController.getByTaskId); // New endpoint
kpiassignmentsApiRouter.get("/task/:task_id/:user_id", KpiassignmentsController.getByTaskAndUser);
kpiassignmentsApiRouter.get("/user/:user_id/kpi/:kpi_id", KpiassignmentsController.getByUserAndKpi);
kpiassignmentsApiRouter.put("/:id", KpiassignmentsController.update);
kpiassignmentsApiRouter.delete("/:id", KpiassignmentsController.delete);



kpiassignmentsApiRouter.get("/reports/data", KpiassignmentsController.getReport);
kpiassignmentsApiRouter.get("/reports/export", KpiassignmentsController.exportReport);
kpiassignmentsApiRouter.get("/reports/teams", KpiassignmentsController.getTeamsWithKpis);
kpiassignmentsApiRouter.get("/reports/projects", KpiassignmentsController.getProjectsForReport);

export default kpiassignmentsApiRouter;
