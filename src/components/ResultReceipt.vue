<template>
    <div class="receipt-card">
        <div class="receipt-head">
            <div>
                <p class="receipt-title">{{ title }}</p>
                <p class="receipt-subtitle">{{ subtitle }}</p>
            </div>
            <slot name="badge" />
        </div>
        <hr class="receipt-divider" />
        <div class="receipt-main">
            <p class="receipt-main-label">{{ mainLabel }}</p>
            <p class="receipt-main-value" :class="toneClass">{{ mainValue }}</p>
            <template v-if="secondaryLabel">
                <p class="receipt-secondary-label">{{ secondaryLabel }}</p>
                <p class="receipt-secondary-value">{{ secondaryValue }}</p>
            </template>
        </div>
        <hr class="receipt-divider" />
        <div class="receipt-rows">
            <div v-for="row in rows" :key="row.label" class="receipt-row">
                <span class="receipt-row-label">{{ row.label }}</span>
                <span class="receipt-row-value" :class="row.tone ? `tone-${row.tone}` : ''">{{ row.value }}</span>
            </div>
        </div>
        <p v-if="footer" class="receipt-footer">{{ footer }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    mainLabel: { type: String, default: '' },
    mainValue: { type: String, default: '' },
    mainTone: { type: String, default: 'brand' },
    secondaryLabel: { type: String, default: '' },
    secondaryValue: { type: String, default: '' },
    rows: { type: Array, default: () => [] },
    footer: { type: String, default: '' },
});

const toneClass = computed(() => `tone-${props.mainTone}`);
</script>
