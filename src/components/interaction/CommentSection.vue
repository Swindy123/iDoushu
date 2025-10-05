<template>
  <div class="comment-section">
    <div class="comment-header">
      <h3>评论 ({{ comments.length }})</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>

    <div class="comments-list">
      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="comment-item"
      >
        <img :src="comment.user.avatar" class="avatar" alt="avatar">
        <div class="comment-content">
          <div class="comment-header">
            <span class="username">{{ comment.user.username }}</span>
            <span class="time">{{ comment.createTime }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-actions">
            <button class="action-btn" @click="likeComment(comment.id)">
              👍 {{ comment.likeCount }}
            </button>
            <button class="action-btn" @click="replyToComment(comment)">
              回复
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="comment-input-area">
      <input 
        v-model="newComment"
        type="text" 
        placeholder="写下你的评论..."
        class="comment-input"
        @keyup.enter="submitComment"
      >
      <button 
        class="submit-btn"
        :disabled="!newComment.trim()"
        @click="submitComment"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentSection',
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    postId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      newComment: ''
    }
  },
  methods: {
    submitComment() {
      if (this.newComment.trim()) {
        const commentData = {
          user: {
            username: '当前用户',
            avatar: 'https://via.placeholder.com/32'
          },
          content: this.newComment.trim(),
          likeCount: 0,
          createTime: '刚刚'
        }
        this.$emit('comment-submit', this.postId, commentData)
        this.newComment = ''
      }
    },
    likeComment(commentId) {
      this.$emit('comment-like', this.postId, commentId)
    },
    replyToComment(comment) {
      this.newComment = `回复 @${comment.user.username}: `
    }
  }
}
</script>

<style scoped>
.comment-section {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 16px;
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f8f8;
}

.comment-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding: 0;
  border: none;
}

.username {
  font-weight: 600;
  font-size: 14px;
}

.time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin-bottom: 8px;
  line-height: 1.4;
  font-size: 14px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.comment-input-area {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.comment-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
}

.submit-btn {
  padding: 12px 20px;
  background: #ff2442;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>