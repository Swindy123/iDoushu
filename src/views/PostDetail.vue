<template>
  <div class="post-detail">
    <!-- 返回按钮 -->
    <header class="detail-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h2>笔记详情</h2>
      <div class="header-actions">
        <button class="action-btn">⋯</button>
      </div>
    </header>

    <!-- 帖子内容 -->
    <div class="post-content" v-if="post">
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
        <button class="follow-btn">关注</button>
      </div>

      <!-- 内容 -->
      <div class="post-body">
        <p class="content-text">{{ post.content }}</p>
        
        <!-- 图片轮播 -->
        <div class="post-images" v-if="post.images && post.images.length">
          <div class="image-carousel">
            <img 
              v-for="(image, index) in post.images" 
              :key="index"
              :src="image" 
              :class="['post-image', { active: currentImageIndex === index }]"
              alt="post image"
              @click="nextImage"
            >
          </div>
          <div class="image-indicator" v-if="post.images.length > 1">
            <span 
              v-for="(image, index) in post.images" 
              :key="index"
              :class="['indicator-dot', { active: currentImageIndex === index }]"
              @click="currentImageIndex = index"
            ></span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="post-tags" v-if="post.tags && post.tags.length">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>

        <!-- 统计信息 -->
        <div class="post-stats">
          <span>👍 {{ post.stats.likeCount }} 点赞</span>
          <span>💬 {{ post.stats.commentCount }} 评论</span>
          <span>⭐ {{ post.stats.collectCount }} 收藏</span>
        </div>
      </div>

      <!-- 互动操作 -->
      <div class="post-actions">
        <button 
          class="action-btn"
          :class="{ liked: post.interactions.isLiked }"
          @click="handleLike"
        >
          <span class="btn-icon">❤️</span>
          <span class="btn-text">点赞</span>
        </button>
        <button class="action-btn" @click="focusCommentInput">
          <span class="btn-icon">💬</span>
          <span class="btn-text">评论</span>
        </button>
        <button 
          class="action-btn"
          :class="{ collected: post.interactions.isCollected }"
          @click="handleCollect"
        >
          <span class="btn-icon">⭐</span>
          <span class="btn-text">收藏</span>
        </button>
        <button class="action-btn" @click="handleShare">
          <span class="btn-icon">↗️</span>
          <span class="btn-text">分享</span>
        </button>
      </div>

      <!-- 完整评论列表 -->
      <div class="comments-section">
        <h3 class="comments-title">评论 ({{ post.comments.length }})</h3>
        
        <div class="comments-list" v-if="post.comments.length > 0">
          <div 
            v-for="comment in post.comments" 
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
                  <span class="btn-icon">👍</span>
                  <span class="btn-count">{{ comment.likeCount }}</span>
                </button>
                <button class="action-btn" @click="replyToComment(comment)">
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="no-comments" v-else>
          <p>还没有评论，快来发表第一条评论吧！</p>
        </div>
      </div>
    </div>

    <!-- 底部评论输入 -->
    <div class="comment-input-fixed">
      <input 
        ref="commentInput"
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
  name: 'PostDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      newComment: '',
      currentImageIndex: 0,
      // 这里应该从 API 或 store 获取数据，暂时用静态数据
      posts: [
        {
          id: 1,
          user: {
            username: '旅行达人小美',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'
          },
          content: '发现了这家藏在胡同里的宝藏咖啡店！环境超级温馨，抹茶拿铁绝了～\n\n📍 地址：北京市东城区某胡同\n⏰ 营业时间：10:00-20:00\n💰 人均：50元\n\n推荐菜品：\n• 抹茶拿铁 ☕️ - 抹茶味浓郁，奶泡细腻\n• 提拉米苏 🍰 - 口感层次丰富\n• 手工饼干 🍪 - 酥脆香甜，配咖啡绝佳\n\n小贴士：建议工作日去，周末人比较多哦！阳光透过窗户洒进来，真的太治愈了！',
          images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=750&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=750&fit=crop',
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=750&fit=crop'
          ],
          createTime: '2小时前',
          location: '北京 · 三里屯',
          tags: ['咖啡店', '探店', '下午茶', '北京美食'],
          stats: {
            likeCount: 156,
            commentCount: 23,
            collectCount: 45
          },
          interactions: {
            isLiked: false,
            isCollected: false
          },
          comments: [
            {
              id: 1,
              user: {
                username: '咖啡爱好者',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
              },
              content: '看起来好棒！求具体地址～周末准备去打卡！',
              createTime: '1小时前',
              likeCount: 5
            },
            {
              id: 2,
              user: {
                username: '探店小分队',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
              },
              content: '照片拍得真好！已经收藏了，这周末就去！',
              createTime: '30分钟前',
              likeCount: 2
            },
            {
              id: 3,
              user: {
                username: '美食家老王',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
              },
              content: '这家的抹茶拿铁确实不错，我上周刚去过，推荐他们家的芝士蛋糕！',
              createTime: '15分钟前',
              likeCount: 8
            }
          ]
        },
        {
          id: 2,
          user: {
            username: '美食侦探',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
          },
          content: '周末自制抹茶千层蛋糕，零失败教程分享！\n\n🍰 食材准备：\n• 低筋面粉 100g\n• 抹茶粉 15g\n• 鸡蛋 3个\n• 牛奶 250ml\n• 淡奶油 200ml\n• 糖 80g\n\n👩‍🍳 制作步骤：\n1. 将面粉、抹茶粉过筛\n2. 加入鸡蛋和牛奶搅拌均匀\n3. 平底锅小火煎制千层皮\n4. 淡奶油加糖打发\n5. 一层皮一层奶油叠加\n6. 冷藏4小时以上\n\n成品口感细腻，抹茶味浓郁，朋友都说比店里卖的还好吃！',
          images: [
            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop'
          ],
          createTime: '5小时前',
          location: '上海',
          tags: ['烘焙', '甜品', '抹茶', '自制', '教程'],
          stats: {
            likeCount: 289,
            commentCount: 34,
            collectCount: 167
          },
          interactions: {
            isLiked: true,
            isCollected: false
          },
          comments: [
            {
              id: 4,
              user: {
                username: '烘焙新手',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
              },
              content: '太详细了！周末就按照这个方子试试，希望成功！',
              createTime: '3小时前',
              likeCount: 8
            },
            {
              id: 5,
              user: {
                username: '甜品控',
                avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face'
              },
              content: '看起来好好吃！请问抹茶粉用哪个牌子的比较好？',
              createTime: '2小时前',
              likeCount: 3
            }
          ]
        },
        // 其他帖子的详情数据...
        {
          id: 3,
          user: {
            username: '摄影小能手',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'
          },
          content: '杭州西湖边的日落真的太美了！捕捉到了绝美的瞬间，分享给大家～\n\n📸 拍摄设备：Sony A7III\n🎨 后期：Lightroom调色\n📍 拍摄地点：西湖断桥\n⏰ 最佳时间：傍晚5-6点\n\n小贴士：建议带上三脚架，日落时光线变化很快，需要稳定拍摄。',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=750&fit=crop'
          ],
          createTime: '3小时前',
          location: '杭州 · 西湖',
          tags: ['摄影', '旅行', '日落', '西湖', '风景'],
          stats: {
            likeCount: 423,
            commentCount: 67,
            collectCount: 89
          },
          interactions: {
            isLiked: false,
            isCollected: true
          },
          comments: []
        }
        // 可以继续添加其他帖子的详情...
      ]
    }
  },
  computed: {
    post() {
      return this.posts.find(p => p.id === Number(this.id))
    }
  },
  methods: {
    handleLike() {
      this.post.interactions.isLiked = !this.post.interactions.isLiked
      this.post.stats.likeCount += this.post.interactions.isLiked ? 1 : -1
    },
    handleCollect() {
      this.post.interactions.isCollected = !this.post.interactions.isCollected
      this.post.stats.collectCount += this.post.interactions.isCollected ? 1 : -1
    },
    handleShare() {
      if (navigator.share) {
        navigator.share({
          title: `${this.post.user.username}的小红书笔记`,
          text: this.post.content,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板！')
      }
    },
    submitComment() {
      if (this.newComment.trim()) {
        const newComment = {
          id: Date.now(),
          user: {
            username: '当前用户',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
          },
          content: this.newComment.trim(),
          likeCount: 0,
          createTime: '刚刚'
        }
        this.post.comments.push(newComment)
        this.post.stats.commentCount += 1
        this.newComment = ''
        
        // 滚动到最新评论
        this.$nextTick(() => {
          const commentsSection = document.querySelector('.comments-list')
          if (commentsSection) {
            commentsSection.scrollTop = commentsSection.scrollHeight
          }
        })
      }
    },
    likeComment(commentId) {
      const comment = this.post.comments.find(c => c.id === commentId)
      if (comment) {
        comment.likeCount += 1
      }
    },
    replyToComment(comment) {
      this.newComment = `回复 @${comment.user.username}: `
      this.focusCommentInput()
    },
    focusCommentInput() {
      this.$refs.commentInput?.focus()
    },
    nextImage() {
      if (this.post.images) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.post.images.length
      }
    },
    prevImage() {
      if (this.post.images) {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.post.images.length) % this.post.images.length
      }
    }
  }
}
</script>

<style scoped>
.post-detail {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 70px;
}

.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #e8e8e8;
  z-index: 1000;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  color: #333;
}

.detail-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.post-content {
  margin-top: 50px;
}

/* 用户信息 */
.post-header {
  background: white;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.post-header .avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 2px;
}

.post-meta {
  font-size: 13px;
  color: #666;
}

.follow-btn {
  background: #ff2442;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
}

/* 帖子内容 */
.post-body {
  background: white;
  padding: 16px;
}

.content-text {
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 15px;
  white-space: pre-line;
}

/* 图片轮播 */
.post-images {
  margin: 16px 0;
}

.image-carousel {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: none;
  cursor: pointer;
}

.post-image.active {
  display: block;
}

.image-indicator {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: background 0.3s;
}

.indicator-dot.active {
  background: #ff2442;
}

/* 标签 */
.post-tags {
  margin: 16px 0;
}

.tag {
  color: #ff2442;
  margin-right: 12px;
  font-size: 14px;
}

/* 统计信息 */
.post-stats {
  display: flex;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  color: #666;
  font-size: 13px;
}

/* 互动操作 */
.post-actions {
  background: white;
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.post-actions .action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  font-size: 12px;
}

.post-actions .action-btn.liked {
  color: #ff2442;
}

.post-actions .action-btn.collected {
  color: #ff9500;
}

.btn-icon {
  font-size: 20px;
}

/* 评论区域 */
.comments-section {
  background: white;
  padding: 16px;
}

.comments-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f8f8;
}

.comment-item:last-child {
  border-bottom: none;
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
}

.comment-header .username {
  font-weight: 600;
  font-size: 14px;
}

.comment-header .time {
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

.comment-actions .action-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* 底部评论输入 */
.comment-input-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
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