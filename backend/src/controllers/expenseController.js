import { allAsync, getAsync, runAsync } from '../utils/db.js';

export async function getExpenses(req, res) {
  try {
    const userId = req.userId;
    const { startDate, endDate, categoryId } = req.query;

    let query = 'SELECT e.*, c.name as categoryName FROM expenses e JOIN categories c ON e.category_id = c.id WHERE e.user_id = ?';
    const params = [userId];

    if (startDate) {
      query += ' AND e.date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND e.date <= ?';
      params.push(endDate);
    }

    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY e.date DESC';

    const expenses = await allAsync(query, params);
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createExpense(req, res) {
  try {
    const userId = req.userId;
    const { categoryId, amount, description, date } = req.body;

    if (!categoryId || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 验证分类属于该用户
    const category = await getAsync('SELECT id FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId]);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const result = await runAsync(
      'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [userId, categoryId, amount, description || '', date]
    );

    res.status(201).json({
      id: result.lastID,
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateExpense(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { categoryId, amount, description, date } = req.body;

    // 验证花销属于该用户
    const expense = await getAsync('SELECT id FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (categoryId) {
      const category = await getAsync('SELECT id FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId]);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const updates = [];
    const values = [];

    if (categoryId) {
      updates.push('category_id = ?');
      values.push(categoryId);
    }
    if (amount !== undefined) {
      updates.push('amount = ?');
      values.push(amount);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (date) {
      updates.push('date = ?');
      values.push(date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    await runAsync(`UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteExpense(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // 验证花销属于该用户
    const expense = await getAsync('SELECT id FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await runAsync('DELETE FROM expenses WHERE id = ?', [id]);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
