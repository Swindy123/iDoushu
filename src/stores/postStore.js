import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const loading = ref(false)

  // 模拟数据
  const mockPosts = [
    {
      id: 1,
      user: {
        username: '旅行达人',
        avatar: 'https://via.placeholder.com/40'
      },
      content: '发现了超美的咖啡店！',
      images: ['https://via.placeholder.com/400x500'],
      createTime: '2小时前',
      stats: {
        likeCount: 156,
        commentCount: 23,
        collectCount: 45
      },
      interactions: {
        isLiked: false,
        isCollected: false
      },
      comments: []
    }
  ]

  const fetchPosts = async () => {
    loading.value = true
    setTimeout(() => {
      posts.value = mockPosts
      loading.value = false
    }, 1000)
  }

  return {
    posts,
    loading,
    fetchPosts
  }
})