<template>
    <div>
        <div class="max-w-2xl mx-auto mb-12 text-center">
            <h1 class="text-3xl font-bold text-stone-900 mb-4">TaiCalc 專欄</h1>
            <p class="text-stone-500">深入淺出的財經知識，助您做出更好的決策。</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20 text-stone-400">
            正在載入文章...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500">
            {{ error }}
        </div>

        <!-- Article Grid -->
        <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <a v-for="article in paginatedArticles" :key="article.id" :href="'/blog/' + article.slug"
                    class="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-100 flex flex-col h-full">
                    <!-- Image -->
                    <div class="h-48 overflow-hidden bg-stone-100 relative">
                        <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div v-else class="w-full h-full flex items-center justify-center text-stone-300">No Image
                        </div>
                        <div class="absolute top-4 left-4">
                            <span
                                class="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-emerald-600 rounded-full shadow-sm">
                                {{ article.category }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="text-xs text-stone-400 mb-2">{{ article.date }}</div>
                        <h2
                            class="text-lg font-bold text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {{ article.title }}
                        </h2>
                        <p class="text-sm text-stone-500 line-clamp-3 mb-4 flex-grow">
                            {{ article.excerpt }}
                        </p>
                        <div
                            class="text-sm font-medium text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            閱讀更多 →
                        </div>
                    </div>
                </a>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    ← 上一頁
                </button>
                <div class="flex gap-2">
                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                            'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
                            currentPage === page 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                        ]">
                        {{ page }}
                    </button>
                </div>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    下一頁 →
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 9

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return articles.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(articles.value.length / itemsPerPage)
})

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const goToPage = (page) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
    try {
        const res = await fetch('/data/articles.json?v=' + Date.now())
        if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        articles.value = await res.json()
        // Sort by date desc
        articles.value.sort((a, b) => new Date(b.date) - new Date(a.date))
        
    } catch (e) {
        console.error(e)
        error.value = "載入文章失敗，請稍後再試。"
    } finally {
        loading.value = false
    }
})
</script>
