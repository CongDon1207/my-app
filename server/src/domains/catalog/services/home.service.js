import { fetchHomeData } from "../repositories/home.repo.js";

export async function getHomeData() {
  const data = await fetchHomeData();
  return data;
}