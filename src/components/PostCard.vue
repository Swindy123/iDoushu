<template>
  <div class="post-card" @click="handleClick">
    <!-- 用户信息 -->
    <div class="post-header">
      <img :src="post.user.avatar" class="avatar" alt="avatar">
      <div class="user-info">
        <div class="username">{{ post.user.username }}</div>
        <div class="post-meta">
          <span class="time">{{ post.createTime }}</span>
          <span v-if="post.location" class="location">· {{ post.location }}</span>
        </div>
      </div>
      <button class="more-btn">⋯</button>
    </div>

    <!-- 内容 -->
    <div class="post-content">
      <p class="content-text">{{ post.content }}</p>
      
      <!-- 图片展示 -->
      <div class="post-image" v-if="post.images && post.images.length">
        <img :src="post.images[0]" alt="post image">
      </div>

      <!-- 视频展示 -->
      <div class="post-video" v-else-if="post.video">
        <div 
          class="video-container"
          @click.stop="handleVideoClick"
        >
          <video
            :src="post.video.url"
            class="video-preview"
            :poster="post.video.thumbnail"
            preload="metadata"
          ></video>
          <div class="video-overlay">
            <div class="play-button">▶</div>
            <div class="video-duration">{{ post.video.duration }}</div>
          </div>
          <div class="video-badge">视频</div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 互动操作 -->
    <div class="post-actions">
      <button 
        class="action-btn"
        :class="{ liked: post.interactions.isLiked }"
        @click.stop="$emit('like', post.id)"
      >
        ❤️ {{ post.stats.likeCount }}
      </button>
      <button class="action-btn" @click.stop="$emit('comment', post.id)">
        💬 {{ post.stats.commentCount }}
      </button>
      <button class="action-btn">
        ⭐ {{ post.stats.collectCount }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.post.id)
    },
    handleVideoClick() {
      this.$emit('video-click', this.post.id)
    }
  }
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 2px;
}

.post-meta {
  font-size: 12px;
  color: #666;
}

.more-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.content-text {
  line-height: 1.5;
  margin-bottom: 12px;
  font-size: 15px;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* 视频容器 */
.post-video {
  margin-bottom: 12px;
}

.video-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  cursor: pointer;
}

.video-preview {
  width: 100%;
  height: auto;
  display: block;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.video-container:hover .video-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ff2442;
  transition: transform 0.2s;
}

.video-container:hover .play-button {
  transform: scale(1.1);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.post-tags {
  margin-bottom: 12px;
}

.tag {
  color: #ff2442;
  margin-right: 8px;
  font-size: 14px;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.action-btn:hover {
  background: #f5f5f5;
}

.action-btn.liked {
  color: #ff2442;
  transform: scale(1.1);
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1.1); }
}

.action-btn.liked {
  animation: likeAnimation 0.3s ease;
}
</style>