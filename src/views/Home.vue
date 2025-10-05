<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">📕</span>
          <span class="logo-text">iDouShu</span>
        </div>
        <div class="search-box">
          <input type="text" placeholder="搜索笔记" class="search-input">
        </div>
        <router-link to="/publish" class="publish-btn">发布</router-link>
      </div>
    </header>

    <!-- 主要内容 - 瀑布流布局 -->
    <main class="main-content">
      <div class="masonry-container">
        <div class="masonry-column" v-for="(column, index) in masonryColumns" :key="index">
          <PostCard 
            v-for="post in column" 
            :key="post.id"
            :post="post"
            @like="handleLike"
            @comment="handleComment"
            @click="goToPostDetail(post.id)"
            @video-click="handleVideoClick"
          />
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <div class="nav-item">
        <span class="nav-icon">🔍</span>
        <span class="nav-text">发现</span>
      </div>
      <router-link to="/publish" class="nav-item">
        <span class="nav-icon">✏️</span>
        <span class="nav-text">发布</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </nav>

    <!-- 评论弹窗 -->
    <div v-if="showCommentModal" class="modal-overlay" @click="showCommentModal = false">
      <div class="modal-content" @click.stop>
        <CommentSection
          :comments="currentPostComments"
          :post-id="currentPostId"
          @close="showCommentModal = false"
          @comment-submit="handleCommentSubmit"
          @comment-like="handleCommentLike"
        />
      </div>
    </div>
    <!-- 视频播放弹窗 -->
    <VideoPlayer
      v-if="showVideoModal"
      :show="showVideoModal"
      :video-url="currentVideo?.video?.url"
      :video="currentVideo"
      @close="showVideoModal = false"
      @like="handleVideoLike"
      @collect="handleVideoCollect"
      @comment="handleComment"
    />
  </div>
</template>

<script>
import PostCard from '@/components/PostCard.vue'
import CommentSection from '@/components/interaction/CommentSection.vue'
import VideoPlayer from '@/components/interaction/VideoPlayer.vue' 

export default {
  name: 'Home',
  components: {
    PostCard,
    CommentSection,
    VideoPlayer
  },
  data() {
    return {
      showCommentModal: false,
      showVideoModal: false,
      currentPostId: null,
      currentVideo: null,
      posts: [
        {
          id: 1,
          user: {
            username: '旅行达人小美',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'
          },
          content: '发现了这家藏在胡同里的宝藏咖啡店！环境超级温馨，抹茶拿铁绝了～阳光透过窗户洒进来，真的太治愈了！',
          images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
          ],
          createTime: '2小时前',
          location: '北京 · 三里屯',
          tags: ['咖啡店', '探店', '下午茶'],
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
            }
          ]
        },
        {
          id: 2,
          user: {
            username: '美食侦探',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
          },
          content: '周末自制抹茶千层蛋糕，零失败教程分享！口感细腻，抹茶味浓郁，朋友都说比店里卖的还好吃！',
          images: [
            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
          ],
          createTime: '5小时前',
          location: '上海',
          tags: ['烘焙', '甜品', '抹茶'],
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
              id: 2,
              user: {
                username: '烘焙新手',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
              },
              content: '求食谱！看起来太好吃了！',
              createTime: '3小时前',
              likeCount: 8
            }
          ]
        },
        {
          id: 3,
          user: {
            username: '摄影小能手',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'
          },
          content: '杭州西湖边的日落真的太美了！捕捉到了绝美的瞬间，分享给大家～',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop'
          ],
          createTime: '3小时前',
          location: '杭州 · 西湖',
          tags: ['摄影', '旅行', '日落'],
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
        },
        {
          id: 4,
          user: {
            username: '健身教练Mike',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face'
          },
          content: '分享我的居家健身routine！不需要器械，每天20分钟，轻松保持好身材！',
          images: [
            'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop'
          ],
          createTime: '8小时前',
          location: '广州',
          tags: ['健身', '健康', '运动'],
          stats: {
            likeCount: 567,
            commentCount: 124,
            collectCount: 234
          },
          interactions: {
            isLiked: false,
            isCollected: false
          },
          comments: []
        },
        {
          id: 5,
          user: {
            username: '读书笔记',
            avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face'
          },
          content: '最近读完了《活着》，感触很深。人生无常，珍惜当下才是最重要的。',
          images: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop'
          ],
          createTime: '1天前',
          location: '成都',
          tags: ['读书', '文学', '感悟'],
          stats: {
            likeCount: 189,
            commentCount: 45,
            collectCount: 78
          },
          interactions: {
            isLiked: true,
            isCollected: true
          },
          comments: []
        },
        {
          id: 6,
          user: {
            username: '美妆博主CC',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
          },
          content: '秋季妆容分享！温柔奶茶色系，适合日常通勤，超显气质！',
          images: [
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop'
          ],
          createTime: '6小时前',
          location: '深圳',
          tags: ['美妆', '化妆', '秋季'],
          stats: {
            likeCount: 678,
            commentCount: 89,
            collectCount: 156
          },
          interactions: {
            isLiked: false,
            isCollected: false
          },
          comments: []
        },
        {
          id: 7,
          user: {
            username: '宠物日记',
            avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=80&h=80&fit=crop&crop=face'
          },
          content: '我家猫咪的日常～今天又发现了它的新睡姿，太可爱了！',
          images: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=500&fit=crop'
          ],
          createTime: '4小时前',
          location: '南京',
          tags: ['宠物', '猫咪', '日常'],
          stats: {
            likeCount: 345,
            commentCount: 56,
            collectCount: 67
          },
          interactions: {
            isLiked: true,
            isCollected: false
          },
          comments: []
        },
        {
          id: 8,
          user: {
            username: '手工达人',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face'
          },
          content: '手工编织的围巾完成啦！温暖的米白色，准备送给朋友当生日礼物～',
          images: [
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'
          ],
          createTime: '2天前',
          location: '西安',
          tags: ['手工', '编织', '礼物'],
          stats: {
            likeCount: 234,
            commentCount: 34,
            collectCount: 45
          },
          interactions: {
            isLiked: false,
            isCollected: true
          },
          comments: []
        },
        {
          id: 9,
          user: {
            username: '电影推荐官',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
          },
          content: '最近看的几部高分电影推荐！每一部都值得反复观看，剧情和演技都在线！',
          images: [
            'https://images.unsplash.com/photo-1489599809255-98f27d8f55e5?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=500&fit=crop'
          ],
          createTime: '12小时前',
          location: '重庆',
          tags: ['电影', '推荐', '影评'],
          stats: {
            likeCount: 456,
            commentCount: 78,
            collectCount: 123
          },
          interactions: {
            isLiked: true,
            isCollected: false
          },
          comments: []
        },
        {
          id: 10,
          user: {
            username: '植物爱好者',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
          },
          content: '阳台小花园更新！新入的多肉植物太可爱了，每天看着心情都变好了～',
          images: [
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=500&fit=crop'
          ],
          createTime: '1天前',
          location: '苏州',
          tags: ['植物', '多肉', '园艺'],
          stats: {
            likeCount: 189,
            commentCount: 23,
            collectCount: 34
          },
          interactions: {
            isLiked: false,
            isCollected: false
          },
          comments: []
        },
        {
        id: 11,
        user: {
          username: 'Vlog博主',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
        },
        content: '周末探店Vlog｜这家咖啡店的拉花太绝了！咖啡师小哥哥手法超专业～',
        video: {
          url: 'https://videos.pexels.com/video-files/3209960/3209960-uhd_2560_1440_25fps.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=500&fit=crop',
          duration: '2:15'
        },
        createTime: '1小时前',
        location: '上海 · 静安寺',
        tags: ['Vlog', '咖啡', '探店', '日常'],
        stats: {
          likeCount: 324,
          commentCount: 45,
          collectCount: 89
        },
        interactions: {
          isLiked: false,
          isCollected: true
        },
        comments: [
          {
            id: 11,
            user: {
              username: '咖啡控',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
            },
            content: '这个拉花太厉害了！求店名！',
            createTime: '30分钟前',
            likeCount: 3
          }
        ]
      },
       {
        id: 12,
        user: {
          username: '健身达人',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'
        },
        content: '居家健身教程｜10分钟高效燃脂训练，不需要任何器械！跟着练起来💪',
        video: {
          url: 'https://videos.pexels.com/video-files/7034628/7034628-uhd_2560_1440_25fps.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
          duration: '1:45'
        },
        createTime: '3小时前',
        location: '家里',
        tags: ['健身', '教程', '燃脂', '居家'],
        stats: {
          likeCount: 567,
          commentCount: 78,
          collectCount: 234
        },
        interactions: {
          isLiked: true,
          isCollected: false
        },
        comments: []
      },
      {
        id: 13,
        user: {
          username: '旅行日记',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
        },
        content: '巴厘岛旅行Vlog｜绝美日落海滩，每一帧都像明信片！分享我的旅行攻略🌴',
        video: {
          url: 'https://videos.pexels.com/video-files/3134890/3134890-uhd_2560_1440_25fps.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
          duration: '3:20'
        },
        createTime: '1天前',
        location: '巴厘岛',
        tags: ['旅行', 'Vlog', '巴厘岛', '海滩'],
        stats: {
          likeCount: 892,
          commentCount: 123,
          collectCount: 345
        },
        interactions: {
          isLiked: false,
          isCollected: true
        },
        comments: []
      }
      ]
    }
  },
  computed: {
    currentPostComments() {
      const post = this.posts.find(p => p.id === this.currentPostId)
      return post ? post.comments : []
    },
    // 瀑布流列数计算
    masonryColumns() {
      const columns = [[], [], []] // 3列瀑布流
      this.posts.forEach((post, index) => {
        columns[index % 3].push(post)
      })
      return columns
    }
  },
  methods: {
    handleLike(postId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.interactions.isLiked = !post.interactions.isLiked
        post.stats.likeCount += post.interactions.isLiked ? 1 : -1
      }
    },
    handleComment(postId) {
      this.currentPostId = postId
      this.showCommentModal = true
    },
    handleCommentSubmit(postId, commentData) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        const newComment = {
          id: Date.now(),
          ...commentData
        }
        post.comments.push(newComment)
        post.stats.commentCount += 1
      }
    },
    handleCommentLike(postId, commentId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        const comment = post.comments.find(c => c.id === commentId)
        if (comment) {
          comment.likeCount += 1
        }
      }
    },
    goToPostDetail(postId) {
      this.$router.push(`/post/${postId}`)
    },
    handleVideoClick(postId) {
    this.currentPostId = postId
    this.currentVideo = this.posts.find(p => p.id === postId)
    this.showVideoModal = true
  },
  
  handleVideoLike(postId) {
    const post = this.posts.find(p => p.id === postId)
    if (post) {
      post.interactions.isLiked = !post.interactions.isLiked
      post.stats.likeCount += post.interactions.isLiked ? 1 : -1
    }
  },
  
  handleVideoCollect(postId) {
    const post = this.posts.find(p => p.id === postId)
    if (post) {
      post.interactions.isCollected = !post.interactions.isCollected
      post.stats.collectCount += post.interactions.isCollected ? 1 : -1
    }
  }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding-bottom: 60px;
  background: #f5f5f5;
}

/* 顶部导航 */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  max-width: 500px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  color: #ff2442;
  font-weight: bold;
  font-size: 18px;
}

.logo-icon {
  font-size: 20px;
  margin-right: 5px;
}

.search-box {
  flex: 1;
  margin: 0 15px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  outline: none;
  font-size: 14px;
}

.publish-btn {
  background: #ff2442;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

/* 主要内容 - 瀑布流布局 */
.main-content {
  margin-top: 60px;
  padding: 15px 0;
}

.masonry-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 12px;
}

.masonry-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: white;
  border-top: 1px solid #e8e8e8;
  height: 60px;
  padding: 8px 0;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  text-decoration: none;
  gap: 4px;
}

.nav-item.active {
  color: #ff2442;
}

.nav-icon {
  font-size: 20px;
}

.nav-text {
  font-size: 10px;
}

/* 评论弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.modal-content {
  width: 100%;
  background: white;
  border-radius: 12px 12px 0 0;
  max-height: 80vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .masonry-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .masonry-container {
    grid-template-columns: 1fr;
  }
}
</style>