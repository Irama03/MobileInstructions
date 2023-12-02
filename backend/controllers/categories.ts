import { ControllerFN } from "../types";
import * as CategoriesService from "../services/categories";

export const getCategories: ControllerFN = async (req, res) => {
  const categories = await CategoriesService.findCategories();
  return res.status(200).json(categories);
};