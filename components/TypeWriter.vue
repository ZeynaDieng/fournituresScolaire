<template>
  <span ref="textRef" class="typewriter-text">
    {{ displayText
    }}<span class="cursor" :class="{ 'cursor-blink': showCursor }">|</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  showCursor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 100,
  delay: 1000,
  loop: false,
  showCursor: true,
});

const emit = defineEmits<{
  complete: [];
  start: [];
}>();

const textRef = ref<HTMLElement>();
const displayText = ref("");
const currentIndex = ref(0);
let timer: NodeJS.Timeout | null = null;

const typeText = () => {
  if (currentIndex.value < props.text.length) {
    displayText.value += props.text[currentIndex.value];
    currentIndex.value++;
    timer = setTimeout(typeText, props.speed);
  } else {
    emit("complete");
    if (props.loop) {
      setTimeout(() => {
        reset();
        startTyping();
      }, props.delay);
    }
  }
};

const reset = () => {
  displayText.value = "";
  currentIndex.value = 0;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const startTyping = () => {
  emit("start");
  typeText();
};

onMounted(() => {
  setTimeout(startTyping, props.delay);
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.typewriter-text {
  display: inline-block;
  font-family: "Courier New", monospace;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  color: currentColor;
  font-weight: normal;
}

.cursor-blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
