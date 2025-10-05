<template>
  <div class="video-modal" v-if="show" @click="close">
    <div class="video-modal-content" @click.stop>
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="close">×</button>
      
      <!-- 视频信息 -->
      <div class="video-info" v-if="video">
        <div class="user-info">
          <img :src="video.user.avatar" class="avatar" alt="avatar">
          <div class="user-details">
            <div class="username">{{ video.user.username }}</div>
            <div class="video-title">{{ video.content }}</div>
          </div>
        </div>
      </div>

      <!-- 视频播放器 -->
      <div class="video-player-container">
        <video
          ref="videoPlayer"
          :src="videoUrl"
          controls
          autoplay
          class="video-player"
          @ended="handleVideoEnd"
          @timeupdate="handleTimeUpdate"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 视频控制 -->
      <div class="video-controls">
        <div class="control-group">
          <button class="control-btn" @click="togglePlay">
            {{ isPlaying ? '❚❚' : '▶' }}
          </button>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              :value="progress"
              @input="seekVideo"
              class="progress-slider"
            >
          </div>
          <div class="time-display">
            {{ currentTime }} / {{ duration }}
          </div>
        </div>
        
        <div class="control-group">
          <button class="control-btn" @click="toggleMute">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            :value="volume"
            @input="changeVolume"
            class="volume-slider"
          >
          <button class="control-btn" @click="toggleFullscreen">
            ⛶
          </button>
        </div>
      </div>

      <!-- 互动操作 -->
      <div class="video-actions">
        <button 
          class="action-btn"
          :class="{ liked: video.interactions.isLiked }"
          @click="handleLike"
        >
          <span class="btn-icon">❤️</span>
          <span class="btn-count">{{ video.stats.likeCount }}</span>
        </button>
        <button class="action-btn" @click="handleComment">
          <span class="btn-icon">💬</span>
          <span class="btn-count">{{ video.stats.commentCount }}</span>
        </button>
        <button 
          class="action-btn"
          :class="{ collected: video.interactions.isCollected }"
          @click="handleCollect"
        >
          <span class="btn-icon">⭐</span>
          <span class="btn-count">{{ video.stats.collectCount }}</span>
        </button>
        <button class="action-btn" @click="handleShare">
          <span class="btn-icon">↗️</span>
          <span class="btn-text">分享</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    videoUrl: {
      type: String,
      default: ''
    },
    video: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isPlaying: false,
      isMuted: false,
      volume: 80,
      progress: 0,
      currentTime: '0:00',
      duration: '0:00',
      isFullscreen: false
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.setupVideo()
        })
      } else {
        this.cleanupVideo()
      }
    }
  },
  methods: {
    setupVideo() {
      const video = this.$refs.videoPlayer
      if (video) {
        video.volume = this.volume / 100
        video.addEventListener('loadedmetadata', this.updateDuration)
      }
    },
    cleanupVideo() {
      const video = this.$refs.videoPlayer
      if (video) {
        video.pause()
        video.removeEventListener('loadedmetadata', this.updateDuration)
      }
    },
    togglePlay() {
      const video = this.$refs.videoPlayer
      if (video) {
        if (video.paused) {
          video.play()
          this.isPlaying = true
        } else {
          video.pause()
          this.isPlaying = false
        }
      }
    },
    toggleMute() {
      const video = this.$refs.videoPlayer
      if (video) {
        video.muted = !video.muted
        this.isMuted = video.muted
      }
    },
    changeVolume(event) {
      const volume = event.target.value
      this.volume = volume
      const video = this.$refs.videoPlayer
      if (video) {
        video.volume = volume / 100
      }
    },
    seekVideo(event) {
      const progress = event.target.value
      const video = this.$refs.videoPlayer
      if (video) {
        const time = (progress / 100) * video.duration
        video.currentTime = time
      }
    },
    handleTimeUpdate() {
      const video = this.$refs.videoPlayer
      if (video) {
        this.progress = (video.currentTime / video.duration) * 100
        this.currentTime = this.formatTime(video.currentTime)
      }
    },
    updateDuration() {
      const video = this.$refs.videoPlayer
      if (video) {
        this.duration = this.formatTime(video.duration)
      }
    },
    handleVideoEnd() {
      this.isPlaying = false
      this.progress = 0
      this.currentTime = '0:00'
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    toggleFullscreen() {
      const videoContainer = this.$el.querySelector('.video-player-container')
      if (!this.isFullscreen) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      this.isFullscreen = !this.isFullscreen
    },
    handleLike() {
      this.$emit('like', this.video.id)
    },
    handleComment() {
      this.$emit('comment', this.video.id)
    },
    handleCollect() {
      this.$emit('collect', this.video.id)
    },
    handleShare() {
      this.$emit('share', this.video.id)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.video-modal-content {
  background: #000;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-info {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info .avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.user-details {
  flex: 1;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.video-title {
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
}

.video-player-container {
  position: relative;
  width: 100%;
  background: #000;
}

.video-player {
  width: 100%;
  height: auto;
  max-height: 60vh;
  display: block;
}

.video-controls {
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid #333;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.progress-bar {
  flex: 1;
  position: relative;
  height: 4px;
  background: #555;
  border-radius: 2px;
  cursor: pointer;
}

.progress {
  position: absolute;
  height: 100%;
  background: #ff2442;
  border-radius: 2px;
  transition: width 0.1s;
}

.progress-slider {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.time-display {
  color: #ccc;
  font-size: 12px;
  min-width: 80px;
  text-align: center;
}

.volume-slider {
  width: 80px;
}

.video-actions {
  display: flex;
  justify-content: space-around;
  padding: 16px 20px;
  border-top: 1px solid #333;
}

.video-actions .action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s;
}

.video-actions .action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.video-actions .action-btn.liked {
  color: #ff2442;
}

.video-actions .action-btn.collected {
  color: #ff9500;
}

.btn-icon {
  font-size: 20px;
}

.btn-count, .btn-text {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-modal-content {
    width: 95%;
    max-height: 80vh;
  }
  
  .video-player {
    max-height: 50vh;
  }
  
  .control-group {
    flex-wrap: wrap;
  }
  
  .volume-slider {
    width: 60px;
  }
}
</style>