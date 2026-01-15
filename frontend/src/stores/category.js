import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryAPI } from '../api/index.js';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchCategories() {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryAPI.list();
      categories.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch categories';
    } finally {
      loading.value = false;
    }
  }

  async function addCategory(name, color) {
    try {
      const response = await categoryAPI.create({ name, color });
      await fetchCategories();
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: 'Failed to add category' };
    }
  }

  async function removeCategory(id) {
    try {
      await categoryAPI.delete(id);
      categories.value = categories.value.filter(cat => cat.id !== id);
    } catch (err) {
      throw err.response?.data || { error: 'Failed to delete category' };
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    removeCategory
  };
});
