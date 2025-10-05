<template>
  <div class="publish">
    <header class="publish-header">
      <button class="cancel-btn" @click="$router.back()">取消</button>
      <h2>发布笔记</h2>
      <button class="publish-btn" @click="handlePublish">发布</button>
    </header>
    
    <div class="publish-content">
      <!-- 内容输入 -->
      <textarea 
        v-model="content"
        class="content-input"
        placeholder="分享你的生活..."
        rows="6"
      ></textarea>

      <!-- 图片上传 -->
      <div class="image-upload">
        <div 
          v-for="(image, index) in images"
          :key="index"
          class="image-item"
        >
          <img :src="image" alt="预览">
          <button class="remove-btn" @click="removeImage(index)">×</button>
        </div>
        
        <div v-if="images.length < 9" class="upload-btn" @click="handleUpload">
          <span class="upload-icon">+</span>
          <span class="upload-text">添加图片</span>
        </div>
      </div>

      <!-- 位置和标签 -->
      <div class="publish-options">
        <div class="option-item">
          <span class="option-label">📍 添加位置</span>
          <input 
            v-model="location"
            type="text" 
            placeholder="你在哪里？"
            class="option-input"
          >
        </div>
        
        <div class="option-item">
          <span class="option-label">🏷️ 添加标签</span>
          <input 
            v-model="newTag"
            type="text" 
            placeholder="输入标签"
            class="option-input"
            @keyup.enter="addTag"
          >
        </div>
        
        <div class="tags-list" v-if="tags.length > 0">
          <span 
            v-for="(tag, index) in tags" 
            :key="index"
            class="tag"
          >
            #{{ tag }}
            <button @click="removeTag(index)" class="tag-remove">×</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Publish',
  data() {
    return {
      content: '',
      images: [],
      location: '',
      tags: [],
      newTag: ''
    }
  },
  methods: {
    handleUpload() {
      // 模拟图片上传
      const fakeImage = 'https://via.placeholder.com/300x300/4ECDC4/white?text=新图片'
      this.images.push(fakeImage)
    },
    removeImage(index) {
      this.images.splice(index, 1)
    },
    addTag() {
      if (this.newTag.trim() && this.tags.length < 5) {
        this.tags.push(this.newTag.trim())
        this.newTag = ''
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1)
    },
    handlePublish() {
      if (!this.content.trim()) {
        alert('请输入内容')
        return
      }

      const newPost = {
        id: Date.now(),
        user: {
          username: '当前用户',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
        },
        content: this.content,
        images: this.images,
        location: this.location,
        tags: this.tags,
        createTime: '刚刚',
        stats: {
          likeCount: 0,
          commentCount: 0,
          collectCount: 0
        },
        interactions: {
          isLiked: false,
          isCollected: false
        },
        comments: []
      }

      // 这里应该调用 API 或更新 store
      console.log('发布新帖子:', newPost)
      alert('发布成功！')
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.publish {
  background: white;
  min-height: 100vh;
}

.publish-header {
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

.cancel-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  color: #666;
}

.publish-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.publish-btn {
  background: #ff2442;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
}

.publish-content {
  margin-top: 50px;
  padding: 16px;
}

.content-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  margin-bottom: 20px;
}

.content-input::placeholder {
  color: #999;
}

/* 图片上传 */
.image-upload {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
}

.upload-btn {
  aspect-ratio: 1;
  border: 2px dashed #e8e8e8;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 12px;
}

/* 发布选项 */
.publish-options {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.option-label {
  width: 80px;
  font-size: 14px;
  color: #333;
}

.option-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 8px 0;
}

.option-input::placeholder {
  color: #999;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #999;
}
</style>