<template>
  <div class="dashboard">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">💰 记账本</h1>
        <div class="nav-user">
          <span>欢迎，{{ username }}</span>
          <button @click="handleLogout" class="btn btn-logout">登出</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container">
      <!-- 标签页 -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="['tab', { active: activeTab === tab }]"
        >
          {{ tabLabels[tab] }}
        </button>
      </div>

      <!-- 统计摘要 -->
      <div v-if="activeTab === 'summary'" class="tab-content">
        <div class="summary-grid">
          <div class="summary-card">
            <h3>总支出</h3>
            <p class="amount">¥{{ statistics.totalAmount?.toFixed(2) || '0.00' }}</p>
          </div>
          <div class="summary-card">
            <h3>记录数</h3>
            <p class="amount">{{ statistics.expenseCount || 0 }}</p>
          </div>
        </div>

        <!-- 分类统计图表 -->
        <div class="card">
          <h2>分类统计</h2>
          <div v-if="categoryStats.length > 0" class="category-chart">
            <div v-for="stat in categoryStats" :key="stat.id" class="chart-bar">
              <div class="bar-label">
                <span :style="{ color: stat.color }" class="color-dot">●</span>
                {{ stat.name }}
              </div>
              <div class="bar-container">
                <div
                  class="bar-fill"
                  :style="{ width: (stat.total / maxCategoryAmount * 100) + '%', backgroundColor: stat.color }"
                ></div>
              </div>
              <div class="bar-value">¥{{ stat.total?.toFixed(2) || '0.00' }}</div>
            </div>
          </div>
          <p v-else>暂无数据</p>
        </div>
      </div>

      <!-- 记录花销 -->
      <div v-if="activeTab === 'add'" class="tab-content">
        <div class="card">
          <h2>记录新的花销</h2>
          <form @submit.prevent="handleAddExpense">
            <div class="form-row">
              <div class="form-group">
                <label>分类</label>
                <select v-model="newExpense.categoryId" required>
                  <option value="">选择分类</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>金额</label>
                <input v-model.number="newExpense.amount" type="number" step="0.01" placeholder="0.00" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>日期</label>
                <input v-model="newExpense.date" type="date" required>
              </div>

              <div class="form-group">
                <label>描述（可选）</label>
                <input v-model="newExpense.description" type="text" placeholder="输入描述">
              </div>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="addingExpense">
              {{ addingExpense ? '添加中...' : '添加花销' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 花销列表 -->
      <div v-if="activeTab === 'list'" class="tab-content">
        <div class="card">
          <h2>花销记录</h2>
          <div v-if="expenses.length > 0" class="expense-list">
            <div v-for="expense in expenses" :key="expense.id" class="expense-item">
              <div class="expense-info">
                <div class="expense-category">
                  <span :style="{ color: getCategoryColor(expense.category_id) }" class="color-dot">●</span>
                  {{ expense.categoryName }}
                </div>
                <div class="expense-desc">{{ expense.description }}</div>
              </div>
              <div class="expense-amount">¥{{ expense.amount?.toFixed(2) }}</div>
              <div class="expense-date">{{ formatDate(expense.date) }}</div>
              <button @click="handleDeleteExpense(expense.id)" class="btn btn-delete">删除</button>
            </div>
          </div>
          <p v-else>暂无花销记录</p>
        </div>
      </div>

      <!-- 分类管理 -->
      <div v-if="activeTab === 'categories'" class="tab-content">
        <div class="card">
          <h2>分类管理</h2>
          <form @submit.prevent="handleAddCategory" class="add-category-form">
            <input v-model="newCategory.name" type="text" placeholder="输入分类名称" required>
            <input v-model="newCategory.color" type="color">
            <button type="submit" class="btn btn-primary">添加分类</button>
          </form>

          <div class="categories-list">
            <div v-for="cat in categories" :key="cat.id" class="category-item">
              <span :style="{ color: cat.color }" class="color-dot">●</span>
              <span>{{ cat.name }}</span>
              <button @click="handleDeleteCategory(cat.id)" class="btn btn-delete-sm">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useExpenseStore } from '../stores/expense.js';
import { useCategoryStore } from '../stores/category.js';
import { useRouter } from '../router.js';

const authStore = useAuthStore();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const router = useRouter();

const activeTab = ref('summary');
const tabs = ['summary', 'add', 'list', 'categories'];
const tabLabels = {
  summary: '📊 统计',
  add: '➕ 记录',
  list: '📝 列表',
  categories: '🏷️ 分类'
};

const newExpense = ref({
  categoryId: '',
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
});

const newCategory = ref({
  name: '',
  color: '#FF6B6B'
});

const addingExpense = ref(false);
const statistics = ref({ totalAmount: 0, expenseCount: 0 });

const username = computed(() => authStore.username);
const categories = computed(() => categoryStore.categories);
const expenses = computed(() => expenseStore.expenses);

const categoryStats = computed(() => expenseStore.statistics || []);
const maxCategoryAmount = computed(() => {
  if (categoryStats.value.length === 0) return 1;
  return Math.max(...categoryStats.value.map(s => s.total || 0)) || 1;
});

function getCategoryColor(categoryId) {
  const cat = categories.value.find(c => c.id === categoryId);
  return cat?.color || '#999';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}

async function loadData() {
  await categoryStore.fetchCategories();
  await expenseStore.fetchExpenses();
  await loadStatistics();
}

async function loadStatistics() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  try {
    const summary = await expenseStore.fetchStatistics('summary', { startDate, endDate });
    statistics.value = summary;

    await expenseStore.fetchStatistics('by-category', { startDate, endDate });
  } catch (err) {
    console.error('Failed to load statistics:', err);
  }
}

async function handleAddExpense() {
  addingExpense.value = true;
  try {
    await expenseStore.addExpense({
      categoryId: newExpense.value.categoryId,
      amount: newExpense.value.amount,
      description: newExpense.value.description,
      date: newExpense.value.date
    });

    newExpense.value = {
      categoryId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };

    activeTab.value = 'list';
    await loadStatistics();
  } catch (err) {
    alert(err.error || '添加花销失败');
  } finally {
    addingExpense.value = false;
  }
}

async function handleDeleteExpense(id) {
  if (confirm('确定要删除这条记录吗？')) {
    try {
      await expenseStore.removeExpense(id);
      await loadStatistics();
    } catch (err) {
      alert(err.error || '删除失败');
    }
  }
}

async function handleAddCategory() {
  try {
    await categoryStore.addCategory(newCategory.value.name, newCategory.value.color);
    newCategory.value = { name: '', color: '#FF6B6B' };
  } catch (err) {
    alert(err.error || '添加分类失败');
  }
}

async function handleDeleteCategory(id) {
  if (confirm('确定要删除这个分类吗？')) {
    try {
      await categoryStore.removeCategory(id);
    } catch (err) {
      alert(err.error || '删除失败');
    }
  }
}

function handleLogout() {
  if (confirm('确定要登出吗？')) {
    authStore.logout();
    router.push('/login');
  }
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
  } else {
    loadData();
  }
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 24px;
  margin: 0;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: white;
  color: #667eea;
  font-weight: 500;
  transition: all 0.3s;
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tab:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card h2 {
  margin-bottom: 20px;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.summary-card h3 {
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.amount {
  font-size: 32px;
  font-weight: bold;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-delete {
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
}

.btn-delete:hover {
  background: #ee5a52;
}

.btn-delete-sm {
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  margin-left: auto;
}

.btn-delete-sm:hover {
  background: #ee5a52;
}

.category-chart {
  margin-top: 20px;
}

.chart-bar {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
}

.bar-label {
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  font-size: 12px;
}

.bar-container {
  background: #f0f0f0;
  border-radius: 5px;
  height: 30px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.bar-value {
  text-align: right;
  font-weight: bold;
  font-size: 14px;
}

.expense-list {
  margin-top: 20px;
}

.expense-item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 80px;
  gap: 15px;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
}

.expense-info {
  flex: 1;
}

.expense-category {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.expense-desc {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.expense-amount {
  font-weight: bold;
  color: #667eea;
}

.expense-date {
  font-size: 12px;
  color: #999;
}

.add-category-form {
  display: grid;
  grid-template-columns: 1fr 60px auto;
  gap: 10px;
  margin-bottom: 20px;
}

.add-category-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-category-form input[type="color"] {
  cursor: pointer;
  height: 40px;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
  justify-content: space-between;
}

.btn-delete-sm {
  margin-left: auto;
}

@media (max-width: 768px) {
  .expense-item {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .add-category-form {
    grid-template-columns: 1fr;
  }
}
</style>
