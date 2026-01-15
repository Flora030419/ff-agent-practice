import { allAsync, runAsync, getAsync } from '../utils/db.js';

export async function getCategories(req, res) {
  try {
    const userId = req.userId;

    const categories = await allAsync(
      'SELECT id, name, color FROM categories WHERE user_id = ? ORDER BY created_at',
      [userId]
    );

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCategory(req, res) {
  try {
    const userId = req.userId;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name required' });
    }

    // 检查分类是否已存在
    const existingCategory = await getAsync(
      'SELECT id FROM categories WHERE user_id = ? AND name = ?',
      [userId, name]
    );

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const result = await runAsync(
      'INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)',
      [userId, name, color || '#FF6B6B']
    );

    res.status(201).json({
      id: result.lastID,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // 验证分类属于该用户
    const category = await getAsync('SELECT id FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // 检查是否有花销使用该分类
    const expense = await getAsync('SELECT id FROM expenses WHERE category_id = ?', [id]);
    if (expense) {
      return res.status(400).json({ error: 'Cannot delete category with expenses' });
    }

    await runAsync('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
