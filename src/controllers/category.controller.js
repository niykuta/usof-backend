import CategoryModel from "#src/models/category.model.js";
import { ValidationError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const categories = await CategoryModel.findAll();
  res.json(categories);
}

export async function get(req, res) {
  const { category_id } = req.params;

  const category = await CategoryModel.find(category_id);
  if (!category) throw new ValidationError("Category not found");

  res.json(category);
}

export async function posts(req, res) {
  const { category_id } = req.params;

  const category = await CategoryModel.find(category_id);
  if (!category) throw new ValidationError("Category not found");

  const posts = await CategoryModel.findPosts(category_id);
  res.json(posts);
}

export async function update(req, res) {
  const { category_id } = req.params;
  const { title, description } = req.body;

  const category = await CategoryModel.update(category_id, { title, description });
  res.status(200).json(category);
}

export async function remove(req, res) {
  const { category_id } = req.params;
  await CategoryModel.delete(category_id);

  res.status(200).json({
    message: "Category deleted"
  });
}
