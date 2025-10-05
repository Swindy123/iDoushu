<template>
  <div class="profile">
    <header class="profile-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h2>我的主页</h2>
    </header>
    
    <div class="profile-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" class="user-avatar" alt="avatar">
        <div class="user-info">
          <h2 class="username">小红书用户</h2>
          <p class="user-bio">分享生活中的美好瞬间 ✨</p>
        </div>
      </div>

      <!-- 用户统计 -->
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-number">128</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">456</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">23</div>
          <div class="stat-label">获赞与收藏</div>
        </div>
      </div>

      <!-- 我的笔记 -->
      <div class="my-posts">
        <h3 class="section-title">我的笔记</h3>
        <div class="posts-grid">
          <div v-for="post in myPosts" :key="post.id" class="post-thumbnail" @click="goToPostDetail(post.id)">
            <img :src="post.thumbnail" :alt="post.title">
            <div class="post-overlay">
              <span class="post-stats">❤️ {{ post.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      myPosts: [
        {
          id: 1,
          thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
          title: '咖啡店探店',
          likes: 156
        },
        {
          id: 2,
          thumbnail: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&h=200&fit=crop',
          title: '抹茶蛋糕',
          likes: 289
        }
      ]
    }
  },
  methods: {
    goToPostDetail(postId) {
      this.$router.push(`/post/${postId}`)
    }
  }
}
</script>

<style scoped>
.profile {
  background: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e8e8e8;
  z-index: 1000;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
}

.profile-header h2 {
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
}

.profile-content {
  margin-top: 50px;
}

.user-card {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-bio {
  color: #666;
  font-size: 14px;
}

.user-stats {
  background: white;
  margin-top: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.my-posts {
  background: white;
  margin-top: 8px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.post-thumbnail {
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
  padding: 8px;
  color: white;
  font-size: 12px;
}
</style>