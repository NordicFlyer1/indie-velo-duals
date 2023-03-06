<template>
  <div class="px-2 pt-2">
    <div class="flex flex-col">
      <div class="flex flex-col text-xl font-semibold">
        {{ userProfile?.friendly_name }}
      </div>
      <div class="flex flex-col gap-1 text-sm pt-2 pl-1">
        <div class="text-gray-700">
          Age
          <span class="font-thin">{{ userProfile?.age }}</span>
        </div>
        <div class="text-gray-700">
          Weight
          <span class="font-thin">
            {{ userProfile?.weight }} <span class="text-xs">kg</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { userProfile } = workoutFileStoreToRefs();
</script>
