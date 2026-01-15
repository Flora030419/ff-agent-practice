import bcryptjs from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { runAsync, getAsync } from '../utils/db.js';

export async function register(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // 检查用户是否已存在
    const existingUser = await getAsync('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // 加密密码
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 创建用户
    const result = await runAsync('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    // 创建默认分类
    const defaultCategories = ['食物', '交通', '购物', '娱乐', '其他'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

    for (let i = 0; i < defaultCategories.length; i++) {
      await runAsync('INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)', [result.lastID, defaultCategories[i], colors[i]]);
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.lastID
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // 查找用户
    const user = await getAsync('SELECT id, password FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 验证密码
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 生成 token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logout(req, res) {
  res.json({ message: 'Logout successful' });
}
