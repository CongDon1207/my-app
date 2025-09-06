// server/src/domains/catalog/controllers/home.controller.js
import { getHomeData } from "../services/home.service.js";

export async function getHome(req, res, next) {
  try {
    const data = await getHomeData(); // gọi service
    return res.json({
      success: true,
      data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}
