import { IWorkLenzRequest } from "../interfaces/worklenz-request";
import { IWorkLenzResponse } from "../interfaces/worklenz-response";

import db from "../config/db";
import { ServerResponse } from "../models/server-response";
import WorklenzControllerBase from "./worklenz-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";
import { v4 as uuidv4 } from "uuid";
import { IKpiReportResponse } from "../interfaces/kpi-report.interface";
import { logger } from "../utils/logger";


export default class KpiassignmentsController extends WorklenzControllerBase {


  @HandleExceptions()
public static async getByUserAndKpi(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
  const { user_id, kpi_id } = req.params;

  if (!user_id || !kpi_id) {
    return res.status(400).json(new ServerResponse(false, "User ID and KPI ID are required"));
  }

  const queryText = `
    SELECT
      ka.*,
      k.name as kpi_name,
      k.description as kpi_description,
      k.target_value,
      k.unit
    FROM kpi_assignments ka
    JOIN kpis k ON ka.kpi_id = k.id
    JOIN team_members tm ON ka.team_member_id = tm.id
    WHERE tm.user_id = $1 AND ka.kpi_id = $2
    ORDER BY ka.created_at DESC;
  `;

  try {
    const result = await db.query(queryText, [user_id, kpi_id]);
    return res.status(200).json(new ServerResponse(true, result.rows || []));
  } catch (err: unknown) {
    logger.error("Error fetching user KPI assignments for KPI:", (err as Error).stack);
    return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignments"));
  }
}

  @HandleExceptions()
  public static async create(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { kpi_id, team_member_id, task_id, project_id, current_value, start_date, end_date } = req.body;

    if (!team_member_id && !task_id && !project_id) {
      return res.status(400).json(new ServerResponse(false, "Must assign to either team member, task, or project"));
    }

    const queryText = `
      INSERT INTO kpi_assignments (
        id, kpi_id, team_member_id, task_id, project_id,
        current_value, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryText, [
        uuidv4(),
        kpi_id,
        team_member_id || null,
        task_id || null,
        project_id || null,
        current_value,
        start_date || null,
        end_date || null
      ]);
      return res.status(201).json(new ServerResponse(true, result.rows[0]));
    } catch (err: unknown) {
      logger.error("Error creating KPI assignment:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error creating KPI assignment"));
    }
  }

  @HandleExceptions()
  public static async getAll(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const queryText = `
      SELECT * FROM kpi_assignments
      ORDER BY created_at DESC;
    `;

    try {
      const result = await db.query(queryText);
      return res.status(200).json(new ServerResponse(true, result.rows));
    } catch (err: unknown) {
      logger.error("Error fetching KPI assignments:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignments"));
    }
  }

  @HandleExceptions()
  public static async getById(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const queryText = `SELECT * FROM kpi_assignments WHERE id = $1`;

    try {
      const result = await db.query(queryText, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json(new ServerResponse(false, "KPI Assignment not found"));
      }

      return res.status(200).json(new ServerResponse(true, result.rows[0]));
    } catch (err: unknown) {
      logger.error("Error fetching KPI assignment:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignment"));
    }
  }


  @HandleExceptions()
  public static async getByUserId(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json(new ServerResponse(false, "User ID is required"));
    }

    const queryText = `
      SELECT ka.*, k.name as kpi_name, k.description as kpi_description
      FROM kpi_assignments ka
      JOIN kpis k ON ka.kpi_id = k.id
      WHERE ka.team_member_id = $1
      ORDER BY ka.created_at DESC;
    `;

    try {
      const result = await db.query(queryText, [user_id]);
      return res.status(200).json(new ServerResponse(true, result.rows));
    } catch (err: unknown) {
      logger.error("Error fetching KPI assignments by user ID:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignments by user ID"));
    }
  }

// In your kpi-assignments controller
@HandleExceptions()
public static async getByTaskId(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { task_id } = req.params;

    if (!task_id) {
        return res.status(400).json(new ServerResponse(false, "Task ID is required"));
    }

    const queryText = `
      SELECT ka.*, k.name as kpi_name, k.description as kpi_description
      FROM kpi_assignments ka
      JOIN kpis k ON ka.kpi_id = k.id
      WHERE ka.task_id = $1
      ORDER BY ka.created_at DESC;
    `;

    try {
        const result = await db.query(queryText, [task_id]);

        // Ensure we always return an array, even if empty
        return res.status(200).json(new ServerResponse(true, result.rows || []));
    } catch (err: unknown) {
        logger.error("Error fetching KPI assignments by task ID:", (err as Error).stack);
        return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignments by task ID"));
    }
}



@HandleExceptions()
public static async getByTaskAndUser(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
  const { task_id , user_id } = req.params;

  if (!task_id || !user_id) {
      return res.status(400).json(new ServerResponse(false, "Task ID and User ID are required"));
  }

  const queryText = `
    SELECT
      ka.*,
      k.name as kpi_name,
      k.description as kpi_description,
      k.target_value,
      k.unit
    FROM kpi_assignments ka
    JOIN kpis k ON ka.kpi_id = k.id
    JOIN team_members tm ON ka.team_member_id = tm.id
    WHERE ka.task_id = $1 AND tm.user_id = $2
    ORDER BY ka.created_at DESC;
  `;

  try {
      const result = await db.query(queryText, [task_id, user_id]);
      return res.status(200).json(new ServerResponse(true, result.rows || []));
  } catch (err: unknown) {
      logger.error("Error fetching user KPI assignments for task:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching KPI assignments"));
  }
}

  @HandleExceptions()
  public static async update(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const { team_member_id, task_id, project_id, current_value, start_date, end_date } = req.body;

    const queryText = `
      UPDATE kpi_assignments
      SET team_member_id = COALESCE($1, team_member_id),
          task_id = COALESCE($2, task_id),
          project_id = COALESCE($3, project_id),
          current_value = COALESCE($4, current_value),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;

    try {
      const result = await db.query(queryText, [
        team_member_id,
        task_id,
        project_id,
        current_value,
        start_date,
        end_date,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json(new ServerResponse(false, "KPI Assignment not found"));
      }

      return res.status(200).json(new ServerResponse(true, result.rows[0]));
    } catch (err: unknown) {
      logger.error("Error updating KPI assignment:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error updating KPI assignment"));
    }
  }

  @HandleExceptions()
  public static async delete(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const queryText = `DELETE FROM kpi_assignments WHERE id = $1 RETURNING *`;

    try {
      const result = await db.query(queryText, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json(new ServerResponse(false, "KPI Assignment not found"));
      }

      return res.status(200).json(new ServerResponse(true, { message: "KPI Assignment deleted" }));
    } catch (err: unknown) {
      logger.error("Error deleting KPI assignment:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error deleting KPI assignment"));
    }
  }



  @HandleExceptions()
  public static async getReport(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const {
      start_date,
      end_date,
      user_id,
      team_id,
      project_id,
      page = "1",
      size = "10"
    } = req.query;

    try {
      const pageNum = parseInt(page as string, 10) || 1;
      const sizeNum = parseInt(size as string, 10) || 10;
      const offset = (pageNum - 1) * sizeNum;

      const queryText = `
        SELECT ka.*, k.name as kpi_name, k.description as kpi_description, k.target_value, k.unit
        FROM kpi_assignments ka
        JOIN kpis k ON ka.kpi_id = k.id
        WHERE ($1::date IS NULL OR ka.start_date >= $1::date)
          AND ($2::date IS NULL OR ka.end_date <= $2::date)
          AND ($3::uuid IS NULL OR ka.team_member_id = $3::uuid)
          AND ($4::uuid IS NULL OR ka.project_id = $4::uuid)
        ORDER BY ka.created_at DESC
        LIMIT $5 OFFSET $6;
      `;

      const countQuery = `
        SELECT COUNT(*)
        FROM kpi_assignments ka
        WHERE ($1::date IS NULL OR ka.start_date >= $1::date)
          AND ($2::date IS NULL OR ka.end_date <= $2::date)
          AND ($3::uuid IS NULL OR ka.team_member_id = $3::uuid)
          AND ($4::uuid IS NULL OR ka.project_id = $4::uuid);
      `;

      const result = await db.query(queryText, [start_date, end_date, user_id, team_id, sizeNum, offset]);
      const countResult = await db.query(countQuery, [start_date, end_date, user_id, team_id]);

      const response = {
        data: result.rows,
        total: parseInt(countResult.rows[0].count, 10)
      };

      return res.status(200).json(new ServerResponse(true, response));
    } catch (err: unknown) {
      logger.error("Error generating KPI report:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error generating report"));
    }
  }

@HandleExceptions()
public static async exportReport(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse | undefined> {
  const { start_date, end_date, team_id, project_id, kpi_id } = req.query;

  try {
    const queryText = `
      SELECT ka.*, k.name as kpi_name, k.description as kpi_description, k.target_value, k.unit
      FROM kpi_assignments ka
      JOIN kpis k ON ka.kpi_id = k.id
      WHERE ($1::date IS NULL OR ka.start_date >= $1::date)
        AND ($2::date IS NULL OR ka.end_date <= $2::date)
        AND ($3::uuid IS NULL OR ka.team_member_id = $3::uuid)
        AND ($4::uuid IS NULL OR ka.project_id = $4::uuid)
        AND ($5::uuid IS NULL OR ka.kpi_id = $5::uuid)
      ORDER BY ka.created_at DESC;
    `;

    const result = await db.query(queryText, [start_date, end_date, team_id, project_id, kpi_id]);

    // Convert result to CSV or desired format
    const csvData = result.rows.map(row => Object.values(row).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.status(200).send(csvData);
    return;
  } catch (err: unknown) {
    logger.error("Error exporting KPI report:", (err as Error).stack);
    return res.status(500).json(new ServerResponse(false, "Error exporting report"));
  }
}


  @HandleExceptions()
  public static async getTeamsWithKpis(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const queryText = `
      SELECT DISTINCT t.id, t.name
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      JOIN kpi_assignments ka ON tm.id = ka.team_member_id
      ORDER BY t.name
    `;

    try {
      const result = await db.query(queryText);
      return res.status(200).json(new ServerResponse(true, result.rows));
    } catch (err: unknown) {
      logger.error("Error fetching teams with KPIs:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching teams"));
    }
  }

  @HandleExceptions()
  public static async getProjectsForReport(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { team_ids } = req.query;

    if (!team_ids) {
      return res.status(400).json(new ServerResponse(false, "Team IDs are required"));
    }

    const teamIdsArray = Array.isArray(team_ids) ? team_ids : [team_ids];

    const queryText = `
      SELECT DISTINCT p.id, p.name
      FROM projects p
      JOIN kpi_assignments ka ON p.id = ka.project_id
      JOIN team_members tm ON ka.team_member_id = tm.id
      WHERE tm.team_id = ANY($1::uuid[])
      ORDER BY p.name
    `;

    try {
      const result = await db.query(queryText, [teamIdsArray]);
      return res.status(200).json(new ServerResponse(true, result.rows));
    } catch (err: unknown) {
      logger.error("Error fetching projects for report:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error fetching projects"));
    }
  }

  @HandleExceptions()
  public static async getKpiSummary(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const {
      start_date,
      end_date,
      user_id,
      team_id,
      project_id,
      page = "1",
      size = "10"
    } = req.query;

    try {
      // Convert query parameters to numbers
      const pageNum = parseInt(page as string, 10) || 1;
      const sizeNum = parseInt(size as string, 10) || 10;
      const offset = (pageNum - 1) * sizeNum;

      const queryParams = [];
      const whereClauses = [];

      // Add filter conditions
      if (start_date && end_date) {
        whereClauses.push(`ka.start_date >= $${queryParams.length + 1} AND ka.end_date <= $${queryParams.length + 2}`);
        queryParams.push(start_date, end_date);
      }

      if (user_id) {
        whereClauses.push(`tm.user_id = $${queryParams.length + 1}`);
        queryParams.push(user_id);
      }

      if (team_id) {
        whereClauses.push(`tm.team_id = $${queryParams.length + 1}`);
        queryParams.push(team_id);
      }

      if (project_id) {
        whereClauses.push(`ka.project_id = $${queryParams.length + 1}`);
        queryParams.push(project_id);
      }

      // Build main query
      let queryText = `
      SELECT
        ka.team_member_id,
        u.name as member_name,
        u.avatar_url as member_avatar,
        SUM(k.target_value) as total_target_value,
        SUM(ka.current_value) as total_current_value,
        COUNT(ka.id) as total_kpis,
        CASE
          WHEN SUM(ka.current_value) >= SUM(k.target_value) THEN 'Completed'
          WHEN SUM(ka.current_value) >= (SUM(k.target_value) * 0.8) THEN 'On Track'
          WHEN SUM(ka.current_value) >= (SUM(k.target_value) * 0.5) THEN 'At Risk'
          ELSE 'Off Track'
        END as overall_status
      FROM kpi_assignments ka
      JOIN kpis k ON ka.kpi_id = k.id
      JOIN team_members tm ON ka.team_member_id = tm.id
      JOIN users u ON tm.user_id = u.id
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}
      GROUP BY ka.team_member_id, u.name, u.avatar_url
      ORDER BY u.name ASC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

      // Query for total count
      const countQuery = `SELECT COUNT(*) FROM (${queryText}) as grouped_data`;

      // Execute queries
      const result = await db.query(queryText, queryParams);
      const countResult = await db.query(countQuery, queryParams.slice(0, -2));

      const response: IKpiReportResponse = {
        data: result.rows,
        total: parseInt(countResult.rows[0].count, 10)
      };

      return res.status(200).json(new ServerResponse(true, response));
    } catch (err: unknown) {
      logger.error("Error generating KPI summary:", (err as Error).stack);
      return res.status(500).json(new ServerResponse(false, "Error generating summary"));
    }
  }

  // New API to fetch aggregated KPI data by team_member_id
  @HandleExceptions()
  public static async getAggregatedKpiReport(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    try {
      const queryText = `
        SELECT
          ka.team_member_id,
          u.name as member_name,
          u.avatar_url as member_avatar,
          SUM(k.target_value) as total_target_value,
          SUM(ka.current_value) as total_current_value,
          COUNT(ka.id) as total_kpis,
          CASE
            WHEN SUM(ka.current_value) >= SUM(k.target_value) THEN 'Completed'
            WHEN SUM(ka.current_value) >= (SUM(k.target_value) * 0.8) THEN 'On Track'
            WHEN SUM(ka.current_value) >= (SUM(k.target_value) * 0.5) THEN 'At Risk'
            ELSE 'Off Track'
          END as overall_status
        FROM kpi_assignments ka
        JOIN kpis k ON ka.kpi_id = k.id
        JOIN team_members tm ON ka.team_member_id = tm.id
        JOIN users u ON tm.user_id = u.id
        GROUP BY ka.team_member_id, u.name, u.avatar_url
        ORDER BY u.name ASC
      `;

      const result = await db.query(queryText);

      return res.status(200).json({
        done: true,
        body: {
          data: result.rows,
          total: result.rowCount
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error("Error generating aggregated KPI report:", err.message);
      } else {
        logger.error("Unknown error occurred while generating aggregated KPI report");
      }
      return res.status(500).json({
        done: false,
        message: "Error generating aggregated KPI report"
      });
    }
  }
}
