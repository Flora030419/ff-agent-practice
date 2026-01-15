import { allAsync, getAsync } from '../utils/db.js';

export async function getSummary(req, res) {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = 'SELECT SUM(amount) as totalAmount, COUNT(id) as expenseCount FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    const summary = await getAsync(query, params);

    res.json({
      totalAmount: summary.totalAmount || 0,
      expenseCount: summary.expenseCount || 0
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getByCategory(req, res) {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = `
      SELECT c.id, c.name, c.color, SUM(e.amount) as total, COUNT(e.id) as count
      FROM categories c
      LEFT JOIN expenses e ON c.id = e.category_id AND e.user_id = ?
      WHERE c.user_id = ?
    `;
    const params = [userId, userId];

    if (startDate) {
      query += ' AND e.date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND e.date <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY c.id ORDER BY total DESC';

    const statistics = await allAsync(query, params);

    res.json(statistics.map(stat => ({
      id: stat.id,
      name: stat.name,
      color: stat.color,
      total: stat.total || 0,
      count: stat.count || 0
    })));
  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getByDate(req, res) {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = `
      SELECT date, SUM(amount) as total, COUNT(id) as count
      FROM expenses
      WHERE user_id = ?
    `;
    const params = [userId];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY date ORDER BY date DESC';

    const statistics = await allAsync(query, params);

    res.json(statistics);
  } catch (error) {
    console.error('Get by date error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
