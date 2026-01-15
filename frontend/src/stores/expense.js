import { defineStore } from 'pinia';
import { ref } from 'vue';
import { expenseAPI, statisticsAPI } from '../api/index.js';

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref([]);
  const statistics = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchExpenses(filters = {}) {
    loading.value = true;
    error.value = null;
    try {
      const response = await expenseAPI.list(filters);
      expenses.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch expenses';
    } finally {
      loading.value = false;
    }
  }

  async function addExpense(data) {
    try {
      const response = await expenseAPI.create(data);
      await fetchExpenses();
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: 'Failed to add expense' };
    }
  }

  async function updateExpense(id, data) {
    try {
      const response = await expenseAPI.update(id, data);
      await fetchExpenses();
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: 'Failed to update expense' };
    }
  }

  async function removeExpense(id) {
    try {
      await expenseAPI.delete(id);
      expenses.value = expenses.value.filter(exp => exp.id !== id);
    } catch (err) {
      throw err.response?.data || { error: 'Failed to delete expense' };
    }
  }

  async function fetchStatistics(type = 'summary', filters = {}) {
    try {
      let response;
      if (type === 'summary') {
        response = await statisticsAPI.summary(filters);
      } else if (type === 'by-category') {
        response = await statisticsAPI.byCategory(filters);
      } else if (type === 'by-date') {
        response = await statisticsAPI.byDate(filters);
      }
      statistics.value = response.data;
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: 'Failed to fetch statistics' };
    }
  }

  return {
    expenses,
    statistics,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    fetchStatistics
  };
});
