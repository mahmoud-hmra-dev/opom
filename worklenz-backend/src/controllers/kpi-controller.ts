import { IWorkLenzRequest } from "../interfaces/worklenz-request";
import { IWorkLenzResponse } from "../interfaces/worklenz-response";

import db from "../config/db";
import { ServerResponse } from "../models/server-response";
import WorklenzControllerBase from "./worklenz-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";
import { v4 as uuidv4 } from 'uuid';

export default class KpiController extends WorklenzControllerBase {
  @HandleExceptions()
  public static async create(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const kpis = req.body;
    console.log(kpis);

    if (!kpis || !Array.isArray(kpis) || kpis.length === 0) {
      return res.status(400).json(new ServerResponse(false, "Missing or invalid KPI array"));
    }

    const values = kpis.map(kpi => [
      uuidv4(), kpi.name, kpi.description, kpi.calculation_method, kpi.frequency,
      kpi.target_value, kpi.unit, kpi.responsible_id, kpi.accountable_id, kpi.user_id, kpi.created_by
    ]);

    const queryText = `
      INSERT INTO kpis (
        id, name, description, calculation_method, frequency,
        target_value, unit, responsible_id, accountable_id, user_id, created_by
      ) VALUES
      ${values.map((_, i) => `($${i * 11 + 1}, $${i * 11 + 2}, $${i * 11 + 3}, $${i * 11 + 4}, $${i * 11 + 5},
        $${i * 11 + 6}, $${i * 11 + 7}, $${i * 11 + 8}, $${i * 11 + 9}, $${i * 11 + 10}, $${i * 11 + 11})`).join(', ')}
      RETURNING *;
    `;

    try {
      const result = await db.query(queryText, values.flat());
      return res.status(201).json(new ServerResponse(true, result.rows));
    } catch (err:any) {
      console.error('Error creating KPIs:', err.stack);
      return res.status(500).json(new ServerResponse(false, 'Error creating KPIs'));
    }
  }

  @HandleExceptions()
  public static async get(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const q = `SELECT * FROM kpis`;
    const result = await db.query(q, []);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }

  @HandleExceptions()
  public static async getById(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const q = `SELECT * FROM kpis WHERE id = $1`;
    const result = await db.query(q, [id]);
    const [data] = result.rows;
    return res.status(200).send(new ServerResponse(true, data));
  }

  @HandleExceptions()
  public static async update(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const kpi = req.body;
    const q = `UPDATE kpis SET name = $1, description = $2, calculation_method = $3, frequency = $4, target_value = $5, unit = $6, responsible_id = $7, accountable_id = $8, user_id = $9, created_by = $10 WHERE id = $11 RETURNING *`;
    const result = await db.query(q, [
      kpi.name, kpi.description, kpi.calculation_method, kpi.frequency,
      kpi.target_value, kpi.unit, kpi.responsible_id, kpi.accountable_id, kpi.user_id, kpi.created_by, id
    ]);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }

  @HandleExceptions()
  public static async deleteById(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { id } = req.params;
    const q = `DELETE FROM kpis WHERE id = $1 RETURNING *`;
    const result = await db.query(q, [id]);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }


  @HandleExceptions()
public static async getByUserId(req: IWorkLenzRequest, res: IWorkLenzResponse): Promise<IWorkLenzResponse> {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json(new ServerResponse(false, "User ID is required"));
    }

    const q = `
        SELECT *
        FROM kpis
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;

    const result = await db.query(q, [user_id]);

    return res.status(200).send(new ServerResponse(true, result.rows));
}
}
