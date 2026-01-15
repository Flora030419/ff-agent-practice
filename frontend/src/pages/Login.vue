<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1>💰 记账本</h1>
        <p class="subtitle">智能记账，轻松管理日常花销</p>

        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <!-- 登录表单 -->
        <form v-if="!showRegister" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.username" type="text" placeholder="输入用户名" required>
          </div>

          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="输入密码" required>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>

          <p class="switch-mode">
            还没有账号？
            <a href="#" @click.prevent="showRegister = true">注册一个</a>
          </p>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="registerForm.username" type="text" placeholder="输入用户名" required>
          </div>

          <div class="form-group">
            <label>邮箱</label>
            <input v-model="registerForm.email" type="email" placeholder="输入邮箱" required>
          </div>

          <div class="form-group">
            <label>密码</label>
            <input v-model="registerForm.password" type="password" placeholder="输入密码（至少6位）" required>
          </div>

          <div class="form-group">
            <label>确认密码</label>
            <input v-model="registerForm.confirmPassword" type="password" placeholder="再次输入密码" required>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>

          <p class="switch-mode">
            已有账号？
            <a href="#" @click.prevent="showRegister = false">返回登录</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useRouter } from '../router.js';

const authStore = useAuthStore();
const router = useRouter();

const showRegister = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const loginForm = ref({
  username: '',
  password: ''
});

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

async function handleLogin() {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    await authStore.login(loginForm.value.username, loginForm.value.password);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.error || '登录失败，请检查用户名和密码';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    await authStore.register(
      registerForm.value.username,
      registerForm.value.email,
      registerForm.value.password,
      registerForm.value.confirmPassword
    );
    successMessage.value = '注册成功！请登录';
    showRegister.value = false;
    registerForm.value = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  } catch (err) {
    error.value = err.error || '注册失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-card h1 {
  text-align: center;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 32px;
}

.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 30px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #999;
}

.switch-mode a {
  color: #667eea;
  text-decoration: none;
  cursor: pointer;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.alert {
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-error {
  background: #ffe0e0;
  color: #c92a2a;
  border: 1px solid #ff6b6b;
}

.alert-success {
  background: #d3f9d8;
  color: #2b8a3e;
  border: 1px solid #51cf66;
}
</style>
